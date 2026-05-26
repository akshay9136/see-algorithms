import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey) {
      console.warn('⚠️  Firebase credentials missing. Database features are disabled.');
      return null;
    }
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
  return getFirestore();
}

const db = getFirebaseAdmin();

export default db;

/**
 * Check comment rate by querying the user's recent comments.
 * Returns true if within limits, false otherwise.
 */
async function checkLastComments(userId) {
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
  const snapshot = await db
    .collection('comments')
    .where('authorId', '==', userId)
    .where('createdAt', '>', oneMinuteAgo)
    .limit(3)
    .get();

  return snapshot.size < 3;
}

export { checkLastComments };
