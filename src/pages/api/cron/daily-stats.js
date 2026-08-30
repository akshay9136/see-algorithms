import db from '@/utils/firebase-utils';

export default async function handler(req, res) {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startIso = yesterday.toISOString();
    const todayIso = today.toISOString();

    const usersRef = db.collection('users');
    const [
      signedInQuery,
      signedUpQuery,
      savedDataQuery,
      commentsQuery,
      repliesQuery,
      summaryCount,
    ] = await Promise.all([
      // 1. Signed-in users yesterday
      usersRef
        .where('lastSignIn', '>=', startIso)
        .where('lastSignIn', '<', todayIso)
        .get(),
      // 2. Signed-up users yesterday
      usersRef
        .where('createdAt', '>=', startIso)
        .where('createdAt', '<', todayIso)
        .get(),
      // 3. Saved data yesterday
      db
        .collection('savedData')
        .where('createdAt', '>=', startIso)
        .where('createdAt', '<', todayIso)
        .get(),
      // 4. New comments yesterday
      db
        .collection('comments')
        .where('createdAt', '>=', startIso)
        .where('createdAt', '<', todayIso)
        .get(),
      // 5. Comment replies yesterday
      db
        .collectionGroup('replies')
        .where('createdAt', '>=', startIso)
        .where('createdAt', '<', todayIso)
        .get(),
      // 6. Credits used yesterday (AI summaries)
      db
        .collection('creditsUsed')
        .where('createdAt', '>=', startIso)
        .where('createdAt', '<', todayIso)
        .get(),
    ]);

    const stats = {
      signInCount: signedInQuery.size,
      signUpCount: signedUpQuery.size,
      savedDataCount: savedDataQuery.size,
      summaryCount: summaryCount.size,
      newComments: commentsQuery.size + repliesQuery.size,
      createdAt: new Date().toISOString(),
    };

    const date = startIso.split('T')[0];
    await db.collection('dailyStats').doc(date).set(stats);

    res.status(200).json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to generate stats');
  }
}
