import db, { checkLastComments } from '@/utils/firebase-utils';
import {
  withAuth,
  withOptionalAuth,
  withQueryParams,
  withRequestBody,
} from '@/utils/middlewares';
import { hasProfanity } from '@/utils/profanity';
import { FieldValue } from 'firebase-admin/firestore';
import compose from 'ramda/src/compose';

const MAX_LENGTH = 500;

export default async function (req, res) {
  const handlers = {
    GET: compose(withOptionalAuth, withQueryParams('parentId'))(handleGet),
    POST: compose(withAuth, withRequestBody('parentId', 'comment'))(handlePost),
    DELETE: compose(withAuth, withQueryParams('id', 'parentId'))(handleDelete),
    PATCH: compose(
      withAuth,
      withQueryParams('id', 'parentId', 'action'),
    )(handlePatch),
  };

  try {
    if (handlers[req.method]) {
      await handlers[req.method](req, res);
    } else {
      res.status(405).send('Method not allowed');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
}

function repliesRef(parentId) {
  return db.collection('comments').doc(parentId).collection('replies');
}

async function handleGet(req, res, user) {
  const { parentId } = req.query;
  const snapshot = await repliesRef(parentId)
    .where('deleted', '==', false)
    .orderBy('createdAt', 'asc')
    .get();

  const replies = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      parentId,
      isAuthor: user && data.authorId === user.userId,
      upvoted: user && (data.upvotedBy || []).includes(user.email),
      upvotes: data.upvotes || 0,
      ...data,
    };
  });

  res.status(200).json(replies);
}

async function handlePost(req, res, user) {
  const { parentId, comment } = req.body;
  const text = comment.trim();

  if (text.length > MAX_LENGTH) {
    return res.status(400).send(`Reply must be under ${MAX_LENGTH} characters.`);
  }
  if (hasProfanity(text)) {
    return res.status(400).send('Your reply contains inappropriate words.');
  }

  // Verify parent comment exists
  const parentDoc = await db.collection('comments').doc(parentId).get();
  if (!parentDoc.exists) {
    return res.status(404).send('Parent comment not found.');
  }

  const allowed = await checkLastComments(user.userId);
  if (!allowed) {
    return res.status(429).send('Too many comments. Please wait a minute.');
  }

  const authorInfo = {
    authorId: user.userId,
    authorName: user.name,
    authorEmail: user.email,
    authorImage: user.image,
  };

  const docRef = await repliesRef(parentId).add({
    text,
    parentId,
    upvotes: 0,
    upvotedBy: [],
    reportedBy: [],
    deleted: false,
    createdAt: new Date().toISOString(),
    ...authorInfo,
  });

  res.status(201).json({
    id: docRef.id,
    parentId,
    text,
    isAuthor: true,
    upvoted: false,
    upvotes: 0,
    createdAt: new Date().toISOString(),
    ...authorInfo,
  });
}

async function handleDelete(req, res, user) {
  const { id, parentId } = req.query;
  const { userId, isAdmin } = user;

  const docRef = repliesRef(parentId).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).send('Reply not found');
  }
  if (doc.data().authorId !== userId && !isAdmin) {
    return res.status(403).send('User forbidden');
  }

  await docRef.update({ deleted: true });
  res.status(200).send('success');
}

async function handlePatch(req, res, user) {
  const { id, parentId, action } = req.query;
  const { email } = user;

  const docRef = repliesRef(parentId).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).send('Reply not found');
  }

  const { upvotedBy = [], reportedBy = [] } = doc.data();

  switch (action) {
    case 'upvote': {
      if (upvotedBy.includes(email)) {
        await docRef.update({
          upvotes: FieldValue.increment(-1),
          upvotedBy: FieldValue.arrayRemove(email),
        });
      } else {
        await docRef.update({
          upvotes: FieldValue.increment(1),
          upvotedBy: FieldValue.arrayUnion(email),
        });
      }
      res.status(200).send('success');
      break;
    }
    case 'report': {
      if (reportedBy.includes(email)) {
        return res.status(400).send('Already reported');
      }
      await docRef.update({
        reportedBy: FieldValue.arrayUnion(email),
        deleted: reportedBy.length >= 3,
      });
      res.status(200).send('success');
      break;
    }
    default:
      res.status(400).send('Invalid action');
  }
}
