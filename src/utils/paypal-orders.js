import db from '@/utils/firebase-utils';
import { FieldValue } from 'firebase-admin/firestore';
import { PRICING_PLANS, SITE_URL } from '@/utils/constants';
import {
  paymentError,
  paypalConfig,
  paypalRequest,
  validOrderId,
} from '@/utils/paypal';

export async function createPaypalOrder(planId, userId) {
  const config = paypalConfig();
  const plan = PRICING_PLANS.find((item) => item.id === planId);
  if (!plan) throw paymentError('Invalid plan.');

  const ref = db.collection('paypalOrders').doc();
  const amount = plan.usd.toFixed(2);
  const returnUrl = new URL(
    '/buy-credits',
    process.env.PAYPAL_RETURN_BASE_URL || SITE_URL,
  );
  returnUrl.searchParams.set('paypal', 'approved');
  returnUrl.searchParams.set('orderId', ref.id);
  const cancelUrl = new URL(returnUrl);
  cancelUrl.searchParams.set('paypal', 'cancelled');
  await ref.set({
    userId,
    planId,
    credits: plan.credits,
    amount,
    currency: 'USD',
    merchantId: config.merchantId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  });
  const order = await paypalRequest('/v2/checkout/orders', {
    method: 'POST',
    requestId: `create-${ref.id}`,
    body: {
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: ref.id,
          description: `See Algorithms — ${plan.credits} AI Credits`,
          payee: { merchant_id: config.merchantId },
          amount: { currency_code: 'USD', value: amount },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: returnUrl.href,
            cancel_url: cancelUrl.href,
          },
        },
      },
    },
  });
  if (!order.id) throw paymentError('PayPal did not create an order.', 502);
  await ref.update({ paypalOrderId: order.id });

  const approvalLink = order.links?.find(
    ({ rel }) => rel === 'payer-action' || rel === 'approve',
  );
  const approvalUrl = new URL(approvalLink?.href || 'about:blank');
  const paypalHost =
    process.env.PAYPAL_ENV === 'live'
      ? 'www.paypal.com'
      : 'www.sandbox.paypal.com';
  if (
    approvalUrl.protocol !== 'https:' ||
    approvalUrl.hostname !== paypalHost
  ) {
    throw paymentError('PayPal did not provide a valid checkout URL.', 502);
  }
  return { approvalUrl: approvalUrl.href };
}

// The capture response and webhook both use this transaction. Network calls stay
// outside it because Firestore may execute a transaction callback more than once.
export async function fulfillPaypalOrder(order) {
  const units = order.purchase_units;
  if (units?.length !== 1 || !validOrderId(units[0].custom_id))
    throw paymentError('Invalid PayPal purchase.');
  const unit = units[0];
  const ref = db.collection('paypalOrders').doc(unit.custom_id);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) throw paymentError('Order not found.', 404);
    const stored = snapshot.data();
    if (
      stored.paypalOrderId !== order.id ||
      unit.payee?.merchant_id !== stored.merchantId ||
      unit.amount?.currency_code !== stored.currency ||
      unit.amount?.value !== stored.amount
    ) {
      throw paymentError('PayPal order details do not match.');
    }
    if (stored.status === 'SUCCESS') return 'SUCCESS';
    const captures = unit.payments?.captures || [];
    const completed = captures.filter(
      (capture) => capture.status === 'COMPLETED',
    );
    if (order.status !== 'COMPLETED' || !completed.length) return 'PENDING';
    const capture = completed[0];
    if (
      captures.length !== 1 ||
      capture.amount?.currency_code !== stored.currency ||
      capture.amount?.value !== stored.amount ||
      !capture.id
    ) {
      throw paymentError('PayPal capture details do not match.');
    }
    transaction.update(db.collection('users').doc(stored.userId), {
      credits: FieldValue.increment(stored.credits),
    });
    transaction.update(ref, {
      status: 'SUCCESS',
      captureId: capture.id,
      creditedAt: new Date().toISOString(),
    });
    return 'SUCCESS';
  });
}

export async function capturePaypalOrder(orderId, userId) {
  if (!validOrderId(orderId)) throw paymentError('Invalid order ID.');
  const snapshot = await db.collection('paypalOrders').doc(orderId).get();
  if (!snapshot.exists) throw paymentError('Order not found.', 404);

  const stored = snapshot.data();
  if (userId && stored.userId !== userId) {
    throw paymentError('Order belongs to another user.', 403);
  }
  if (stored.status === 'SUCCESS') return 'SUCCESS';
  if (!validOrderId(stored.paypalOrderId)) {
    throw paymentError('Order is not ready. Please try again.', 409);
  }
  let path = `/v2/checkout/orders/${stored.paypalOrderId}`;
  let order = await paypalRequest(path);
  if (order.status === 'APPROVED') {
    try {
      order = await paypalRequest(`${path}/capture`, {
        method: 'POST',
        body: {},
        requestId: `capture-${orderId}`,
      });
    } catch (error) {
      // Capture may have succeeded before a timeout, or a webhook captured first.
      order = await paypalRequest(path);
      if (order.status !== 'COMPLETED') throw error;
    }
  }
  return fulfillPaypalOrder(order);
}
