import db from '@/utils/firebase-utils';
import { PRICING_PLANS } from '@/utils/constants';
import {
  capturePaypalOrder,
  createPaypalOrder,
  fulfillPaypalOrder,
} from '@/utils/paypal-orders';
import { verifyPaypalWebhook } from '@/utils/paypal-webhooks';
import { paypalConfig } from '@/utils/paypal';
import webhook from '@/pages/api/payments/paypal/webhook';

jest.mock('@/utils/firebase-utils', () => ({
  __esModule: true,
  default: {
    collection: jest.fn(),
    runTransaction: jest.fn(),
  },
}));

jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { increment: (amount) => ({ increment: amount }) },
}));

jest.mock('@/utils/middlewares', () => ({
  withMethod: () => (handler) => handler,
}));

const record = {
  userId: 'google_buyer',
  planId: 'basic',
  credits: 100,
  amount: '4.99',
  currency: 'USD',
  merchantId: 'MERCHANT',
  paypalOrderId: 'PAYPAL123',
  status: 'PENDING',
};

const completedOrder = () => ({
  id: 'PAYPAL123',
  status: 'COMPLETED',
  purchase_units: [
    {
      custom_id: 'local123',
      amount: { currency_code: 'USD', value: '4.99' },
      payee: { merchant_id: 'MERCHANT' },
      payments: {
        captures: [
          {
            id: 'CAPTURE123',
            status: 'COMPLETED',
            amount: { currency_code: 'USD', value: '4.99' },
          },
        ],
      },
    },
  ],
});

const response = (data, ok = true) => ({
  ok,
  status: ok ? 200 : 502,
  json: async () => data,
});

let stored;
let transaction;
let ref;
let originalEnv;
let originalFetch;

beforeEach(() => {
  jest.clearAllMocks();
  AbortSignal.timeout = jest.fn(() => undefined);
  originalEnv = { ...process.env };
  originalFetch = global.fetch;
  Object.assign(process.env, {
    PAYPAL_ENV: 'sandbox',
    PAYPAL_CLIENT_ID: 'client',
    PAYPAL_CLIENT_SECRET: 'secret',
    PAYPAL_MERCHANT_ID: 'MERCHANT',
    PAYPAL_WEBHOOK_ID: 'webhook',
    PAYPAL_RETURN_BASE_URL: 'https://preview.example.com',
  });
  stored = { ...record };
  ref = {
    id: 'local123',
    get: jest.fn(async () => ({ exists: true, data: () => ({ ...stored }) })),
    set: jest.fn(),
    update: jest.fn(),
  };
  db.collection.mockReturnValue({ doc: jest.fn(() => ref) });
  transaction = {
    get: ref.get,
    update: jest.fn((doc, patch) => {
      if (patch.status) Object.assign(stored, patch);
    }),
  };
  // Serialize callbacks like Firestore's conflict/retry behavior.
  let queue = Promise.resolve();
  db.runTransaction.mockImplementation((callback) => {
    const next = queue.then(() => callback(transaction));
    queue = next.catch(() => {});
    return next;
  });
  global.fetch = jest.fn();
});

afterEach(() => {
  process.env = originalEnv;
  global.fetch = originalFetch;
});

it('requires explicit environment and credentials', () => {
  delete process.env.PAYPAL_CLIENT_ID;
  expect(() => paypalConfig()).toThrow('unavailable');
});

it('uses server prices and stores the buyer and immutable credit quantity', async () => {
  global.fetch
    .mockResolvedValueOnce(response({ access_token: 'token' }))
    .mockResolvedValueOnce(
      response({
        id: 'PAYPAL123',
        links: [
          {
            rel: 'payer-action',
            href: 'https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL123',
          },
        ],
      }),
    );

  expect(await createPaypalOrder('basic', 'google_buyer')).toEqual({
    approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL123',
  });
  expect(ref.set).toHaveBeenCalledWith(
    expect.objectContaining({
      userId: 'google_buyer',
      amount: PRICING_PLANS[0].usd.toFixed(2),
      credits: 100,
      currency: 'USD',
    }),
  );
  const payload = JSON.parse(global.fetch.mock.calls[1][1].body);
  expect(payload.purchase_units[0]).toMatchObject({
    custom_id: 'local123',
    amount: { value: PRICING_PLANS[0].usd.toFixed(2), currency_code: 'USD' },
  });
  expect(payload.payment_source.paypal.experience_context).toMatchObject({
    user_action: 'PAY_NOW',
    return_url:
      'https://preview.example.com/buy-credits?paypal=approved&orderId=local123',
    cancel_url:
      'https://preview.example.com/buy-credits?paypal=cancelled&orderId=local123',
  });
});

it('rejects unknown plans before contacting PayPal', async () => {
  await expect(createPaypalOrder('fake', 'google_buyer')).rejects.toThrow(
    'Invalid plan',
  );
  expect(global.fetch).not.toHaveBeenCalled();
});

it('rejects another user before contacting PayPal', async () => {
  await expect(
    capturePaypalOrder('local123', 'other_user'),
  ).rejects.toMatchObject({ status: 403 });

  expect(global.fetch).not.toHaveBeenCalled();
});

it('awards credits only once across overlapping callback/webhook fulfillment', async () => {
  const results = await Promise.all([
    fulfillPaypalOrder(completedOrder()),
    fulfillPaypalOrder(completedOrder()),
  ]);
  expect(results).toEqual(['SUCCESS', 'SUCCESS']);
  expect(
    transaction.update.mock.calls.filter(([, patch]) => patch.credits),
  ).toEqual([[ref, { credits: { increment: 100 } }]]);
  expect(stored).toMatchObject({ status: 'SUCCESS', captureId: 'CAPTURE123' });
});

it.each(['amount', 'currency', 'merchant', 'order', 'captureAmount'])(
  'rejects a mismatching %s without awarding credits',
  async (field) => {
    const order = completedOrder();
    const unit = order.purchase_units[0];
    if (field === 'amount') unit.amount.value = '0.01';
    if (field === 'currency') unit.amount.currency_code = 'INR';
    if (field === 'merchant') unit.payee.merchant_id = 'OTHER';
    if (field === 'order') order.id = 'OTHER';
    if (field === 'captureAmount')
      unit.payments.captures[0].amount.value = '0.01';
    await expect(fulfillPaypalOrder(order)).rejects.toThrow('do not match');
    expect(transaction.update).not.toHaveBeenCalled();
  },
);

it('does not award credits for pending captures', async () => {
  const order = completedOrder();
  order.purchase_units[0].payments.captures[0].status = 'PENDING';
  expect(await fulfillPaypalOrder(order)).toBe('PENDING');
  expect(transaction.update).not.toHaveBeenCalled();
});

it('recovers a completed payment after a capture response timeout', async () => {
  const approved = completedOrder();
  approved.status = 'APPROVED';
  const token = response({ access_token: 'token' });
  global.fetch
    .mockResolvedValueOnce(token)
    .mockResolvedValueOnce(response(approved))
    .mockResolvedValueOnce(token)
    .mockRejectedValueOnce(new Error('Timeout'))
    .mockResolvedValueOnce(token)
    .mockResolvedValueOnce(response(completedOrder()));

  expect(await capturePaypalOrder('local123', 'google_buyer')).toBe('SUCCESS');
  expect(global.fetch.mock.calls[3][1].headers['PayPal-Request-Id']).toBe(
    'capture-local123',
  );
});

it('rejects missing webhook signature headers without an API request', async () => {
  expect(await verifyPaypalWebhook({}, { id: 'event' })).toBe(false);
  expect(global.fetch).not.toHaveBeenCalled();
});

it('rejects a webhook whose signature fails verification', async () => {
  global.fetch
    .mockResolvedValueOnce(response({ access_token: 'token' }))
    .mockResolvedValueOnce(response({ verification_status: 'FAILURE' }));

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  await webhook(
    {
      headers: {
        'paypal-auth-algo': 'algo',
        'paypal-cert-url': 'cert',
        'paypal-transmission-id': 'id',
        'paypal-transmission-sig': 'sig',
        'paypal-transmission-time': 'time',
      },
      body: { id: 'event', event_type: 'PAYMENT.CAPTURE.COMPLETED' },
    },
    res,
  );
  expect(res.status).toHaveBeenCalledWith(400);
  expect(db.runTransaction).not.toHaveBeenCalled();
});

it('fulfills a verified completed webhook without a browser session', async () => {
  const token = response({ access_token: 'token' });
  global.fetch
    .mockResolvedValueOnce(token)
    .mockResolvedValueOnce(response({ verification_status: 'SUCCESS' }))
    .mockResolvedValueOnce(token)
    .mockResolvedValueOnce(response(completedOrder()));

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  await webhook(
    {
      headers: {
        'paypal-auth-algo': 'algo',
        'paypal-cert-url': 'cert',
        'paypal-transmission-id': 'id',
        'paypal-transmission-sig': 'sig',
        'paypal-transmission-time': 'time',
      },
      body: {
        id: 'event',
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        resource: {
          supplementary_data: { related_ids: { order_id: 'PAYPAL123' } },
        },
      },
    },
    res,
  );
  expect(res.status).toHaveBeenCalledWith(200);
  expect(stored.status).toBe('SUCCESS');
});

it.each([
  undefined,
  'https://example.com/checkout',
  'http://www.sandbox.paypal.com/checkout',
])('rejects missing or invalid PayPal approval URLs: %s', async (href) => {
  global.fetch
    .mockResolvedValueOnce(response({ access_token: 'token' }))
    .mockResolvedValueOnce(
      response({
        id: 'PAYPAL123',
        links: href ? [{ rel: 'payer-action', href }] : [],
      }),
    );
  await expect(createPaypalOrder('basic', 'google_buyer')).rejects.toThrow(
    'valid checkout URL',
  );
});
