import db, { checkLastComments } from '@/lib/firebase-utils';
import {
  withAuth,
  withDocument,
  withOptionalAuth,
  withQueryParams,
  withRequestBody,
} from '@/lib/middlewares';
import { hasProfanity } from '@/lib/profanity';
import { FieldValue } from 'firebase-admin/firestore';
import compose from 'ramda/src/compose';

const COMMENTS = 'comments';

export default async function (req, res) {
  try {
    switch (req.method) {
      case 'GET': {
        const handler = compose(
          withOptionalAuth,
          withQueryParams('algoId'),
        )(handleGet);

        await handler(req, res);
        break;
      }
      case 'POST': {
        const handler = compose(
          withAuth,
          withRequestBody('algoId', 'comment'),
        )(handlePost);

        await handler(req, res);
        break;
      }
      case 'DELETE': {
        const handler = compose(
          withAuth,
          withQueryParams('id'),
          withDocument('comments'),
        )(handleDelete);

        await handler(req, res);
        break;
      }
      case 'PATCH': {
        const handler = compose(
          withAuth,
          withQueryParams('id', 'action'),
          withDocument('comments'),
        )(handlePatch);

        await handler(req, res);
        break;
      }
      default:
        res.status(405).send('Method not allowed');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
}

function buildQuery(algoId) {
  const query = db
    .collection(COMMENTS)
    .where('algoId', '==', algoId)
    .where('deleted', '==', false);

  return query.orderBy('upvotes', 'desc').orderBy('createdAt', 'desc');
}

async function handleGet(req, res, user) {
  const { algoId } = req.query;
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
  const text = comment.trim();

  if (text.length > 1000) {
    return res.status(400).send('Comment must be under 1000 characters.');
  }
  if (hasProfanity(text)) {
    return res.status(400).send('Your comment contains inappropriate words.');
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

async function handleDelete(req, res, user, doc) {
  const { userId, isAdmin } = user;
  const { authorId } = doc.data();

  if (authorId !== userId && !isAdmin) {
    return res.status(403).send('User forbidden');
  }
  await doc.ref.update({ deleted: true });

  return res.status(200).send('success');
}

async function handlePatch(req, res, { email }, doc) {
  const { action } = req.query;
  const { upvotedBy, reportedBy } = doc.data();

  switch (action) {
    case 'upvote': {
      if (upvotedBy.includes(email)) {
        await doc.ref.update({
          upvotes: FieldValue.increment(-1),
          upvotedBy: FieldValue.arrayRemove(email),
        });
      } else {
        await doc.ref.update({
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
      await doc.ref.update({
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
