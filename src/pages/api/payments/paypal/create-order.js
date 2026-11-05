import compose from 'ramda/src/compose';
import { withAuth, withMethod } from '@/utils/middlewares';
import { createPaypalOrder } from '@/utils/paypal-orders';
import { paypalApiError } from '@/utils/paypal';

async function handler(req, res, user) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const result = await createPaypalOrder(req.body?.planId, user.userId);
    return res.status(200).json(result);
  } catch (error) {
    return paypalApiError(res, error);
  }
}

export default compose(withMethod('POST'), withAuth)(handler);
