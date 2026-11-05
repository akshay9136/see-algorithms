import db from '@/utils/firebase-utils';
import { capturePaypalOrder, fulfillPaypalOrder } from '@/utils/paypal-orders';
import { paymentError, paypalRequest, validOrderId } from '@/utils/paypal';

export async function verifyPaypalWebhook(headers, event) {
  if (!process.env.PAYPAL_WEBHOOK_ID) {
    throw paymentError('PayPal webhook is not configured.', 503);
  }
  const fields = {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
  };
  const invalid = Object.values(fields).some(
    (value) => typeof value !== 'string' || !value,
  );
  if (invalid) return false;
  const result = await paypalRequest(
    '/v1/notifications/verify-webhook-signature',
    {
      method: 'POST',
      body: {
        ...fields,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      },
    },
  );
  return result.verification_status === 'SUCCESS';
}

// Read the order from PayPal rather than trusting payment details in an event.
async function reconcileOrder(event) {
  const approved = event.event_type === 'CHECKOUT.ORDER.APPROVED';
  const paypalId = approved
    ? event.resource?.id
    : event.resource?.supplementary_data?.related_ids?.order_id;

  if (!validOrderId(paypalId)) throw paymentError('Missing order ID.');

  const order = await paypalRequest(`/v2/checkout/orders/${paypalId}`);
  const orderId = order.purchase_units?.[0]?.custom_id;
  if (!validOrderId(orderId)) return;

  const snapshot = await db.collection('paypalOrders').doc(orderId).get();
  // The merchant account may receive events from other products or apps.
  if (!snapshot.exists) return;
  if (snapshot.data().paypalOrderId !== paypalId)
    throw paymentError('Order is not ready for reconciliation.', 409);

  const status = approved
    ? await capturePaypalOrder(orderId)
    : await fulfillPaypalOrder(order);

  if (!approved && status !== 'SUCCESS')
    throw paymentError(
      'Payment confirmation is not ready. Retry delivery.',
      503,
    );
}

export async function processPaypalWebhook(event) {
  switch (event.event_type) {
    case 'CHECKOUT.ORDER.APPROVED':
    case 'PAYMENT.CAPTURE.COMPLETED':
      return reconcileOrder(event);
    case 'PAYMENT.CAPTURE.REFUNDED':
    case 'PAYMENT.CAPTURE.REVERSED':
      // Consumed credits require a manual refund/reversal decision.
      return db.collection('paypalPaymentReviews').doc(event.id).set(
        {
          type: event.event_type,
          resource: event.resource,
          status: 'NEEDS_REVIEW',
          receivedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    default:
      return;
  }
}
