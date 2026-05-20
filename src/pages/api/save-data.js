import db from '@/lib/firebase-utils';
import compose from 'ramda/src/compose';
import {
  withAuth,
  withDocument,
  withQueryParams,
  withRequestBody,
} from '@/lib/middlewares';

export default withAuth(async (req, res, { userId }) => {
  const handlers = {
    GET: withQueryParams('algoId')(handleFetch),
    POST: withRequestBody('algoId', 'type', 'data')(handleSave),
    DELETE: compose(
      withQueryParams('id'),
      withDocument('savedData'),
    )(handleDelete),
  };

  try {
    if (handlers[req.method]) {
      await handlers[req.method](req, res, userId);
    } else {
      res.status(405).send('Method not allowed');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

async function handleFetch(req, res, userId) {
  const { algoId } = req.query;

  const snapshot = await db
    .collection('savedData')
    .where('userId', '==', userId)
    .where('algoId', '==', algoId)
    .orderBy('createdAt', 'desc')
    .get();

  const items = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });

  res.status(200).json(items);
}

async function handleSave(req, res, userId) {
  const { algoId, type, data } = req.body;

  const dataRef = db.collection('savedData');
  const snapshot = await dataRef
    .where('userId', '==', userId)
    .where('algoId', '==', algoId)
    .get();

  if (snapshot.size >= 10) {
    return res
      .status(400)
      .send('Maximum 10 saves per algorithm. Delete older ones to save new.');
  }

  await dataRef.add({
    userId,
    algoId,
    type,
    data: JSON.stringify(data),
    createdAt: new Date().toISOString(),
  });

  res.status(200).send('success');
}

async function handleDelete(req, res, userId, doc) {
  if (doc.data().userId !== userId) {
    return res.status(403).send('User forbidden');
  }
  await doc.ref.delete();
  res.status(200).send('success');
}
