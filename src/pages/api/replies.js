import db from '@/utils/firebase-utils';
import {
  withAuth,
  withOptionalAuth,
  withQueryParams,
  withRequestBody,
} from '@/utils/middlewares';
import {
  buildComment,
  deleteComment,
  getComment,
  updateComment,
  validateComment,
} from '@/utils/comment-utils';
import compose from 'ramda/src/compose';

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

  const replies = snapshot.docs.map((doc) =>
    getComment(doc, user, { parentId })
  );

  res.status(200).json(replies);
}

async function handlePost(req, res, user) {
  const { parentId, comment = '' } = req.body;
  const text = comment.trim();
  const error = await validateComment(text, user.userId);
  if (error) {
    return res.status(error.status).send(error.message);
  }
  // Verify parent comment exists
  const parentDoc = await db.collection('comments').doc(parentId).get();
  if (!parentDoc.exists) {
    return res.status(404).send('Parent comment not found.');
  }

  const data = buildComment(text, user, { parentId });
  const docRef = await repliesRef(parentId).add(data);

  res.status(201).json({
    id: docRef.id,
    isAuthor: true,
    upvoted: false,
    ...data,
  });
}

async function handleDelete(req, res, user) {
  const { id, parentId } = req.query;
  const docRef = repliesRef(parentId).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(404).send('Comment not found');
  }
  await deleteComment(doc, user, res);
}

async function handlePatch(req, res, user) {
  const { id, parentId, action } = req.query;
  const docRef = repliesRef(parentId).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(404).send('Comment not found');
  }
  await updateComment(doc, action, user.email, res);
}
