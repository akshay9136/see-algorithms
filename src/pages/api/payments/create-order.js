import db from '@/lib/firebase-utils';
import { withMethod, withAuth, withQueryParams } from '@/lib/middlewares';
import { PRICING_PLANS } from '@/lib/constants';
import { baseUrlPg } from '@/common/utils';
import compose from 'ramda/src/compose';

/**
 * Generate deterministic dummy phone  from orderId
 */
function getPhoneNumber(orderId) {
  const hash = [...orderId]
    .map((c) => c.charCodeAt(0))
    .filter((c) => c < 100)
    .join('');

  return '9' + hash.slice(0, 9).padEnd(9, '0');
}

/**
 * API route to create a Cashfree order and return a payment session ID.
 * Expects { planId } in the query params.
 */
async function handler(req, res, user) {
  const { planId } = req.query;

  const plan = PRICING_PLANS.find((plan) => plan.id === planId);
  if (!plan) return res.status(400).send('Invalid plan');

  const docRef = db.collection('cashfreeOrders').doc();
  const orderId = docRef.id;

  const payload = {
    order_id: orderId,
    order_amount: plan.inr,
    order_currency: 'INR',
    customer_details: {
      customer_id: user.userId,
      customer_email: user.email,
      customer_phone: getPhoneNumber(orderId),
      customer_name: user.name,
    },
  };

  try {
    const response = await fetch(`${baseUrlPg()}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2025-01-01',
        'x-idempotency-key': orderId,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const paymentSessionId = data.payment_session_id;

    if (!response.ok) {
      console.error('Cashfree order error', data);
      return res.status(500).send('Cashfree order creation failed');
    }

    // Store a pending order record for later verification
    await docRef.set({
      email: user.email,
      planId,
      amount: plan.inr,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ orderId, paymentSessionId });
  } catch (err) {
    console.error('Create order exception !!', err.message);
    res.status(500).send('Internal server error');
  }
}

export default compose(
  withMethod('POST'),
  withAuth,
  withQueryParams('planId'),
)(handler);
