import db from '@/lib/firebase-utils';
import { withMethod, withAuth, withRequestBody } from '@/lib/middlewares';
import { FieldValue } from 'firebase-admin/firestore';
import { PRICING_PLANS } from '@/lib/constants';
import { baseUrlPg } from '@/common/utils';
import compose from 'ramda/src/compose';

/**
 * API route to verify Cashfree payment status and credit the user.
 * Expects { orderId } in the request body.
 */
async function handler(req, res, user) {
  const { orderId } = req.body;
  const orderRef = db.collection('cashfreeOrders').doc(orderId);

  const snapshot = await orderRef.get();
  if (!snapshot.exists) {
    return res.status(404).send('Order not found');
  }
  const orderData = snapshot.data();
  // Guard against double-crediting if already processed
  if (orderData.status !== 'PENDING') {
    return res.status(200).send(orderData.status);
  }

  try {
    // v3 endpoint: returns an array of payments for the order
    const response = await fetch(`${baseUrlPg()}/orders/${orderId}/payments`, {
      method: 'GET',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2025-01-01',
      },
    });

    const data = await response.json();
    const payment = Array.isArray(data) ? data[0] : data;
    const status = payment?.payment_status;

    if (!response.ok) {
      console.error('Cashfree verification error', data);
      return res.status(500).send('Cashfree verification failed');
    }

    if (status === 'SUCCESS') {
      const plan = PRICING_PLANS.find(p => p.id === orderData.planId);
      const userRef = db.collection('users').doc(user.userId);
      await userRef.update({
        credits: FieldValue.increment(plan.credits),
      });
    }
    await orderRef.update({ status, verifiedAt: new Date().toISOString() });
    res.status(200).send(status);
  } catch (err) {
    console.error('Verify payment exception !!', err.message);
    res.status(500).send('Internal server error');
  }
}

export default compose(
  withMethod('POST'),
  withAuth,
  withRequestBody('orderId'),
)(handler);
