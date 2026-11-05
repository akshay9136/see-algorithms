import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import BuyCredits, { getServerSideProps } from '@/pages/buy-credits';
import { capturePaypalOrder } from '@/utils/paypal-orders';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { useCredits } from '@/hooks';

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));
jest.mock('@/utils/paypal-orders', () => ({ capturePaypalOrder: jest.fn() }));
jest.mock('@/pages/api/auth/[...nextauth]', () => ({ authOptions: {} }));
jest.mock('@/hooks', () => ({
  useCredits: jest.fn(),
  useDialog: jest.requireActual('@/hooks/useDialog').default,
}));

const session = { user: { provider: 'google', id: 'buyer' } };

let originalFetch;
let context;

beforeEach(() => {
  jest.clearAllMocks();
  originalFetch = global.fetch;
  global.fetch = jest.fn();
  context = { req: {}, res: { setHeader: jest.fn() }, query: {} };
  getServerSession.mockResolvedValue(session);
  useSession.mockReturnValue({ data: session });
  useCredits.mockReturnValue({ credits: 100, fetchCredits: jest.fn() });
});

afterEach(() => {
  global.fetch = originalFetch;
});

it('does not capture payments on a normal page visit', async () => {
  expect(await getServerSideProps(context)).toEqual({ props: {} });
  expect(capturePaypalOrder).not.toHaveBeenCalled();
  expect(context.res.setHeader).toHaveBeenCalledWith(
    'Cache-Control',
    'private, no-store',
  );
});

it.each([
  ['SUCCESS', 'Payment Successful'],
  ['FAILED', 'Payment Failed'],
  ['PENDING', 'Payment Pending'],
])(
  'shows the %s dialog and keeps it dismissed on rerender',
  async (status, title) => {
    const { rerender } = render(<BuyCredits paymentStatus={status} />);
    expect(screen.getByRole('dialog')).toHaveTextContent(title);
    const { fetchCredits } = useCredits.mock.results[0].value;
    expect(fetchCredits).toHaveBeenCalledTimes(status === 'SUCCESS' ? 1 : 0);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    rerender(<BuyCredits paymentStatus={status} />);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(fetchCredits).toHaveBeenCalledTimes(status === 'SUCCESS' ? 1 : 0);
  },
);

it('handles cancellation without capturing payment', async () => {
  context.query = { paypal: 'cancelled', orderId: 'local123' };
  const { props } = await getServerSideProps(context);
  render(<BuyCredits {...props} />);
  expect(screen.getByRole('alert')).toHaveTextContent('checkout was cancelled');
  expect(capturePaypalOrder).not.toHaveBeenCalled();
});

it.each(['SUCCESS', 'PENDING'])(
  'uses the server-confirmed %s result after returning',
  async (status) => {
    context.query = {
      paypal: 'approved',
      orderId: 'local123',
      token: 'PAYPAL123',
    };
    capturePaypalOrder.mockResolvedValue(status);
    expect(await getServerSideProps(context)).toEqual({
      props: { paymentStatus: status },
    });
    expect(capturePaypalOrder).toHaveBeenCalledWith('local123', 'google_buyer');
  },
);

it('preserves the payment callback when the session has expired', async () => {
  context.query = { paypal: 'approved', orderId: 'local123' };
  getServerSession.mockResolvedValue(null);
  const { props } = await getServerSideProps(context);
  expect(props).toEqual({
    paymentStatus: 'SIGN_IN_REQUIRED',
    returnUrl: '/buy-credits?paypal=approved&orderId=local123',
  });
  render(<BuyCredits {...props} />);
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  expect(capturePaypalOrder).not.toHaveBeenCalled();
});

it('does not trust malformed order IDs or client-supplied success statuses', async () => {
  context.query = {
    paypal: 'approved',
    orderId: '../other',
    status: 'SUCCESS',
  };
  expect(await getServerSideProps(context)).toEqual({
    props: { paymentStatus: 'ERROR' },
  });
  expect(capturePaypalOrder).not.toHaveBeenCalled();
});

it('shows no success when server verification rejects the order', async () => {
  context.query = { paypal: 'approved', orderId: 'local123' };
  capturePaypalOrder.mockRejectedValue(
    new Error('Order belongs to another user.'),
  );
  expect(await getServerSideProps(context)).toEqual({
    props: { paymentStatus: 'ERROR' },
  });
});

it('starts USD purchases using only the selected plan ID', async () => {
  global.fetch.mockResolvedValue({
    json: async () => ({ error: 'Checkout unavailable.' }),
    ok: false,
  });
  render(<BuyCredits />);
  fireEvent.click(screen.getByRole('button', { name: 'USD' }));
  await act(async () => {
    fireEvent.click(screen.getAllByRole('button', { name: 'Buy Now' })[0]);
  });
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/payments/paypal/create-order',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: 'basic' }),
    },
  );
});
