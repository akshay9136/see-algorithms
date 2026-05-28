import db from '@/lib/firebase-utils';
import { FieldValue } from 'firebase-admin/firestore';
import { withAuth, withRequestBody } from '@/lib/middlewares';
import compose from 'ramda/src/compose';

async function handler(req, res) {
  const { pageId: algoId, action } = req.body;
  try {
    const upvotesRef = db.collection('summary').doc('upvotes');
    const downvotesRef = db.collection('summary').doc('downvotes');

    switch (action) {
      case 'upvote':
        await upvotesRef.set(
          { [algoId]: FieldValue.increment(1) },
          { merge: true },
        );
        break;
      case 'downvote':
        await downvotesRef.set(
          { [algoId]: FieldValue.increment(1) },
          { merge: true },
        );
        break;
      case 'undo_upvote':
        await upvotesRef.set(
          { [algoId]: FieldValue.increment(-1) },
          { merge: true },
        );
        break;
      case 'undo_downvote':
        await downvotesRef.set(
          { [algoId]: FieldValue.increment(-1) },
          { merge: true },
        );
        break;
      default:
        return res.status(400).send('Invalid action');
    }

    res.status(200).send('success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
}

export default compose(withAuth, withRequestBody('pageId', 'action'))(handler);
