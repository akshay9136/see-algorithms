import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import db from '@/lib/firebase-admin';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = `${session.user.provider}_${session.user.id}`;

  if (req.method === 'POST') {
    return handleSave(req, res, userId);
  }

  if (req.method === 'GET') {
    return handleFetch(req, res, userId);
  }

  if (req.method === 'DELETE') {
    return handleDelete(req, res, userId);
  }

  res.status(405).json({ error: 'Method not allowed' });
}

async function handleSave(req, res, userId) {
  try {
    const { algoId, type, data } = req.body;

    if (!algoId || !type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const savedRef = db.collection('savedData');
    const snapshot = await savedRef
      .where('userId', '==', userId)
      .where('algoId', '==', algoId)
      .get();

    if (snapshot.size >= 10) {
      return res.status(400).json({
        error: 'Maximum 10 saves per algorithm. Delete older ones to save new.',
      });
    }

    const docRef = await savedRef.add({
      userId,
      algoId,
      type,
      data: JSON.stringify(data),
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ id: docRef.id });
  } catch (err) {
    console.error('Save failed:', err.message);
    res.status(500).json({ error: 'Failed to save data' });
  }
}

async function handleFetch(req, res, userId) {
  try {
    const { algoId } = req.query;

    if (!algoId) {
      return res.status(400).json({ error: 'algoId is required' });
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
    console.error('Fetch failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

async function handleDelete(req, res, userId) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const docRef = db.collection('savedData').doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data().userId !== userId) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await docRef.delete();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Delete failed:', err.message);
    res.status(500).json({ error: 'Failed to delete data' });
  }
}
