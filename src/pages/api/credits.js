import db from '@/lib/firebase-utils';
import { INITIAL_CREDITS } from '@/lib/constants';
import { withAuth, withMethod } from '@/lib/middlewares';
import compose from 'ramda/src/compose';

async function handler(req, res, user) {
  try {
    const userRef = db.collection('users').doc(user.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }
    const data = userDoc.data();
    res.status(200).json(data.credits ?? INITIAL_CREDITS);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
}

export default compose(withMethod('GET'), withAuth)(handler);
