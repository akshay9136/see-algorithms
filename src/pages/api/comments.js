import db from '@/utils/firebase-utils';
import {
  withAuth,
  withDocument,
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

const COMMENTS = 'comments';

export default async function (req, res) {
  const handlers = {
    GET: compose(withOptionalAuth, withQueryParams('pageId'))(handleGet),
    POST: compose(withAuth, withRequestBody('pageId', 'comment'))(handlePost),
    DELETE: compose(
      withAuth,
      withQueryParams('id'),
      withDocument('comments'),
    )(handleDelete),
    PATCH: compose(
      withAuth,
      withQueryParams('id', 'action'),
      withDocument('comments'),
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

function buildQuery(pageId) {
  const query = db
    .collection(COMMENTS)
    .where('pageId', '==', pageId)
    .where('deleted', '==', false);

  return query.orderBy('upvotes', 'desc').orderBy('createdAt', 'desc');
}

async function handleGet(req, res, user) {
  const { pageId } = req.query;
  const query = buildQuery(pageId).limit(50);
  const snapshot = await query.get();

  const comments = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const replies = await doc.ref
        .collection('replies')
        .where('deleted', '==', false)
        .get();

      const replyCount = replies.size;
      return getComment(doc, user, { replyCount });
    }),
  );

  res.status(200).json(comments);
}

async function handlePost(req, res, user) {
  const { pageId, comment = '' } = req.body;
  const text = comment.trim();
  const error = await validateComment(text, user.userId);
  if (error) {
    return res.status(error.status).send(error.message);
  }

  const data = buildComment(text, user, { pageId });
  const docRef = await db.collection(COMMENTS).add(data);

  res.status(201).json({
    id: docRef.id,
    isAuthor: true,
    upvoted: false,
    ...data,
  });
}

async function handleDelete(req, res, user, doc) {
  await deleteComment(doc, user, res);
}

async function handlePatch(req, res, user, doc) {
  const { action } = req.query;
  await updateComment(doc, action, user.email, res);
}
