import db from '@/lib/firebase-admin';
import { withAuth } from '@/lib/middlewares';

export default withAuth(async (req, res, { userId }) => {
  if (req.method === 'POST') {
    return handleSave(req, res, userId);
  }
  if (req.method === 'GET') {
    return handleFetch(req, res, userId);
  }
  if (req.method === 'DELETE') {
    return handleDelete(req, res, userId);
  }

  res.status(405).send('Method not allowed');
});

async function handleSave(req, res, userId) {
  try {
    const { algoId, type, data } = req.body;

    if (!algoId || !type || !data) {
      return res.status(400).send('Missing required fields');
    }
    const savedRef = db.collection('savedData');
    const snapshot = await savedRef
      .where('userId', '==', userId)
      .where('algoId', '==', algoId)
      .get();

    if (snapshot.size >= 10) {
      return res
        .status(400)
        .send('Maximum 10 saves per algorithm. Delete older ones to save new.');
    }
    await savedRef.add({
      userId,
      algoId,
      type,
      data: JSON.stringify(data),
      createdAt: new Date().toISOString(),
    });
    res.status(200).send('success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to save data');
  }
}

async function handleFetch(req, res, userId) {
  const { algoId } = req.query;
  try {
    if (!algoId) {
      return res.status(400).send('algoId is required');
    }
    const snapshot = await db
      .collection('savedData')
      .where('userId', '==', userId)
      .where('algoId', '==', algoId)
      .orderBy('createdAt', 'desc')
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to fetch data');
  }
}

async function handleDelete(req, res, userId) {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(400).send('Id is required');
    }
    const docRef = db.collection('savedData').doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return res.status(404).send('Item not found');
    }
    await docRef.delete();
    res.status(200).send('success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to delete item');
  }
}
