require('dotenv').config({ path: '.env.local' });

const db = require('../src/utils/firebase-utils').default;

async function deleteOldDailyStats() {
  const snapshot = await db
    .collection('dailyStats')
    .orderBy('createdAt', 'asc')
    .limit(24)
    .get();

  if (snapshot.empty) {
    console.log('No documents found');
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  console.log('Successfully deleted old documents.');
}

deleteOldDailyStats().catch((err) => {
  console.error('Error during deletion:', err);
  process.exit(1);
});
