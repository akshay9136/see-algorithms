import db, { checkLastComments } from '@/lib/firebase-utils';
import { withAuth, withOptionalAuth } from '@/lib/middlewares';
import { hasProfanity } from '@/lib/profanity';
import { FieldValue } from 'firebase-admin/firestore';

const COMMENTS = 'comments';

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await withOptionalAuth(handleGet)(req, res);
        break;
      case 'POST':
        await withAuth(handlePost)(req, res);
        break;
      case 'DELETE':
        await withAuth(handleDelete)(req, res);
        break;
      case 'PATCH':
        await withAuth(handlePatch)(req, res);
        break;
      default:
        res.status(405).send('Method not allowed');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
};

function buildQuery(algoId) {
  const query = db
    .collection(COMMENTS)
    .where('algoId', '==', algoId)
    .where('deleted', '==', false);

  return query.orderBy('upvotes', 'desc').orderBy('createdAt', 'desc');
}

async function handleGet(req, res, user) {
  const { algoId } = req.query;
  if (!algoId) {
    return res.status(400).send('algoId is required');
  }
  const query = buildQuery(algoId).limit(50);
  const snapshot = await query.get();
  const comments = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      isAuthor: user && data.authorId === user.userId,
      upvoted: user && data.upvotedBy.includes(user.email),
      ...data,
    };
  });
  return res.status(200).json(comments);
}

async function handlePost(req, res, user) {
  const { algoId, comment } = req.body;
  if (!algoId || !comment) {
    return res.status(400).send('Missing required fields');
  }
  const text = comment.trim();
  if (text.length > 1000) {
    return res.status(400).send('Comment must be under max length allowed.');
  }
  if (hasProfanity(text)) {
    return res.status(400).send('Your comment contains inappropriate language');
  }
  const allowed = await checkLastComments(user.userId);
  if (!allowed) {
    return res.status(429).send('Too many comments. Please wait a minute.');
  }
  const comments = db.collection(COMMENTS);
  const authorInfo = {
    authorId: user.userId,
    authorName: user.name,
    authorEmail: user.email,
    authorImage: user.image,
  };
  const docRef = await comments.add({
    text,
    algoId,
    upvotes: 0,
    upvotedBy: [],
    reportedBy: [],
    deleted: false,
    createdAt: new Date().toISOString(),
    ...authorInfo,
  });
  return res.status(201).json({
    id: docRef.id,
    text,
    upvotes: 0,
    upvotedBy: [],
    createdAt: new Date().toISOString(),
    isAuthor: true,
    upvoted: false,
    ...authorInfo,
  });
}

async function handleDelete(req, res, { userId, isAdmin }) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send('Comment Id is required');
  }
  const docRef = db.collection(COMMENTS).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(404).send('Comment not found');
  }
  const { authorId } = doc.data();
  if (authorId !== userId && !isAdmin) {
    return res.status(403).send('Not allowed');
  }
  await docRef.update({ deleted: true });

  return res.status(200).send('success');
}

async function handlePatch(req, res, { email }) {
  const { id, action } = req.body;
  if (!id || !action) {
    return res.status(400).send('Missing required fields');
  }
  const docRef = db.collection(COMMENTS).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(404).send('Comment not found');
  }
  const { upvotedBy, reportedBy } = doc.data();

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
