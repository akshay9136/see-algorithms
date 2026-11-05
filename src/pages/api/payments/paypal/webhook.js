import { withMethod } from '@/utils/middlewares';
import { paypalApiError } from '@/utils/paypal';
import {
  processPaypalWebhook,
  verifyPaypalWebhook,
} from '@/utils/paypal-webhooks';

async function handler(req, res) {
  try {
    const event = req.body;
    if (!event?.id || !(await verifyPaypalWebhook(req.headers, event))) {
      return res.status(400).json({ error: 'Invalid webhook signature.' });
    }

    await processPaypalWebhook(event);
    return res.status(200).json({ received: true });
  } catch (error) {
    return paypalApiError(res, error);
  }
}

export default withMethod('POST')(handler);
