import db from '@/lib/firebase-admin';

export default async function handler(req, res) {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startIso = yesterday.toISOString();
    const todayIso = today.toISOString();

    // 1. Signed-in users yesterday
    const usersRef = db.collection('users');
    const signedInQuery = await usersRef
      .where('lastSignIn', '>=', startIso)
      .where('lastSignIn', '<', todayIso)
      .get();

    // 2. Signed-up users yesterday
    const signedUpQuery = await usersRef
      .where('createdAt', '>=', startIso)
      .where('createdAt', '<', todayIso)
      .get();

    const stats = {
      signInCount: signedInQuery.size,
      signUpCount: signedUpQuery.size,
      createdAt: new Date().toISOString(),
    };

    const date = startIso.split('T')[0];
    await db.collection('dailyStats').doc(date).set(stats);

    res.status(200).json({ status: 'ok', stats });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to generate stats' });
  }
}
