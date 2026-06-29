require('dotenv').config({ path: '.env.local' });

const db = require('../src/utils/firebase-utils').default;

// google_108669132859438176684
// github_100084838

async function deleteSavedData() {
  const snapshot = await db
    .collection('savedData')
    .where('userId', '==', 'google_108669132859438176684')
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

  console.log(`Deleted ${snapshot.size} documents`);
}

deleteSavedData().catch(console.error);
