import { useCallback, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCredits, useDialog } from '@/hooks';
import {
  Alert,
  Typography,
  Button,
  Box,
  Chip,
  Container,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardActions,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { AutoAwesomeOutlined } from '@mui/icons-material';
import { getServerSession } from 'next-auth/next';
import { PRICING_PLANS } from '@/utils/constants';
import { validOrderId } from '@/utils/paypal';
import { capturePaypalOrder } from '@/utils/paypal-orders';
import { authOptions } from './api/auth/[...nextauth]';
import AppContext from '@/common/context';
import Script from 'next/script';

const styles = {
  introBox: {
    background: (theme) =>
      `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.secondary.light}22 100%)`,
    border: '1px solid',
    borderColor: 'primary.light',
    borderRadius: 3,
    padding: { xs: 3, md: 4 },
    mb: 5,
  },
  pricingCard: {
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};

const paymentDialogs = {
  CANCELLED: {
    message: 'PayPal checkout was cancelled.',
    variant: 'info',
  },
  ERROR: {
    message:
      'We could not confirm your payment. If you were charged, your credits will be reconciled automatically.',
    variant: 'warning',
  },
  SIGN_IN_REQUIRED: {
    message: 'Sign in to the account to confirm your payment.',
    variant: 'info',
  },
  SUCCESS: {
    title: 'Payment Successful',
    message: 'Credits have been added to your account.',
    variant: 'success',
  },
  FAILED: {
    title: 'Payment Failed',
    message: 'Failed to process payment. Please try again.',
    variant: 'error',
  },
  PENDING: {
    title: 'Payment Pending',
    message: 'Credits will be added after your payment is confirmed.',
    variant: 'info',
  },
};

// A return URL only triggers verification; credits come from the server's
// authenticated capture and Firestore transaction, never the query parameters.
export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (query.paypal === 'cancelled')
    return { props: { paymentStatus: 'CANCELLED' } };

  if (query.paypal !== 'approved') return { props: {} };
  if (!validOrderId(query.orderId))
    return { props: { paymentStatus: 'ERROR' } };

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return {
      props: {
        paymentStatus: 'SIGN_IN_REQUIRED',
        returnUrl: `/buy-credits?paypal=approved&orderId=${encodeURIComponent(query.orderId)}`,
      },
    };
  }

  try {
    const userId = `${session.user.provider}_${session.user.id}`;
    const paymentStatus = await capturePaypalOrder(query.orderId, userId);
    return { props: { paymentStatus } };
  } catch (err) {
    return { props: { paymentStatus: 'ERROR' } };
  }
}

export default function BuyCredits({ paymentStatus, returnUrl }) {
  const [loadingId, setLoadingId] = useState(null);
  const [currency, setCurrency] = useState(paymentStatus ? 'USD' : 'INR');
  const { credits, fetchCredits } = useCredits();
  const { dialog, showDialog } = useDialog();
  const { data: session } = useSession();
  const { setContext } = useContext(AppContext);

  const handleResult = useCallback(
    (status) => {
      showDialog(paymentDialogs[status] || paymentDialogs.PENDING);
      if (status === 'SUCCESS') fetchCredits();
    },
    [showDialog, fetchCredits],
  );

  // PayPal returns via a new page load; Cashfree calls handleResult after checkout.
  useEffect(() => {
    if (paymentDialogs[paymentStatus]?.title) handleResult(paymentStatus);
  }, [paymentStatus, handleResult]);

  const handlePurchase = async (plan) => {
    if (!session) {
      setContext({ signInOpen: true, callbackUrl: '/buy-credits' });
      return;
    }
    setLoadingId(plan.id);

    try {
      if (currency === 'USD') {
        const response = await fetch('/api/payments/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: plan.id }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Unable to start PayPal checkout.');
        }
        window.location.assign(result.approvalUrl);
        return;
      }

      const orderRes = await fetch(
        `/api/payments/create-order?planId=${plan.id}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      );

      if (!orderRes.ok) {
        const error = await orderRes.text();
        throw new Error(error || 'Failed to create order');
      }

      const { orderId, paymentSessionId } = await orderRes.json();

      const cashfree = await window.Cashfree({
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      });
      // Open checkout UI in modal
      await cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' });

      // Verify payment status
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const status = await verifyRes.text();
      handleResult(status);
    } catch (err) {
      showDialog({
        title: 'API Error',
        message: err.message || 'Something went wrong. Please try again.',
        variant: 'error',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const paymentAlert = paymentDialogs[paymentStatus];

  return (
    <Container sx={{ minWidth: { md: 900 }, p: 0 }}>
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="warning.main"
        >
          Get AI Credits
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Purchase credits to generate AI summaries for your custom algorithms.
        </Typography>
        {session && (
          <Typography variant="h6" color="primary" mt={2}>
            <strong>Balance: {credits !== null ? credits : '...'}</strong>
          </Typography>
        )}
      </Box>

      {paymentAlert && (
        <Alert
          severity={paymentAlert.variant}
          sx={{ width: 'fit-content', mx: 'auto', mb: 3 }}
          action={
            paymentStatus === 'SIGN_IN_REQUIRED' && (
              <Button
                sx={{ width: 72, textTransform: 'none', fontWeight: 'bold' }}
                size="small"
                variant="outlined"
                color="warning"
                onClick={() =>
                  setContext({ signInOpen: true, callbackUrl: returnUrl })
                }
              >
                Sign in
              </Button>
            )
          }
        >
          {paymentAlert.message}
        </Alert>
      )}

      <Box sx={styles.introBox}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AutoAwesomeOutlined /> What are AI Credits?
        </Typography>
        <Typography lineHeight={1.6} mb={1}>
          Watching an algorithm animate is powerful — but truly understanding
          why it makes each decision is what transforms a learner into a
          practitioner. AI Credits unlock on-demand, intelligent explanations
          generated specifically for the algorithm and data you are currently
          visualizing.
        </Typography>
        <Typography lineHeight={1.6} color="text.secondary">
          Each time you request a summary, a few credits are consumed to query
          our AI. It reads your exact custom graph topology, tree structure, or
          input array and produces a clear, step-by-step narrative — covering
          time complexity, edge cases, and the reasoning behind every pivotal
          step. Credits never expire, so you can learn at your own pace without
          feeling pressured by a ticking clock or a monthly billing cycle.
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={3}>
        <ToggleButtonGroup
          exclusive
          value={currency}
          onChange={(_e, value) => {
            if (value) setCurrency(value);
          }}
          aria-label="Currency"
          disabled={loadingId !== null}
        >
          <ToggleButton value="INR" sx={{ px: 2 }}>
            <b>INR</b>
          </ToggleButton>
          <ToggleButton value="USD" sx={{ px: 2 }}>
            <b>USD</b>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Typography
        color="text.secondary"
        variant="body2"
        textAlign="center"
        visibility={currency === 'USD' ? 'visible' : 'hidden'}
        mb={3}
      >
        USD payments are processed by PayPal for international customers.
      </Typography>

      <Grid container spacing={4} mb={5}>
        {PRICING_PLANS.map((plan) => (
          <Grid item key={plan.id} xs={12} sm={4}>
            <Card sx={styles.pricingCard}>
              <CardContent>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Typography variant="h6" color="text.secondary" mr={1}>
                    {plan.name}
                  </Typography>
                  {plan.recommended && (
                    <Chip
                      label="POPULAR"
                      color="secondary"
                      sx={{ fontWeight: 'bold', lineHeight: 1, height: 24 }}
                    />
                  )}
                </Box>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Typography
                    component="h2"
                    variant="h4"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {currency === 'INR' ? `₹${plan.inr}` : `$${plan.usd}`}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  textAlign="center"
                >
                  <strong>{plan.credits}</strong> AI Credits
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handlePurchase(plan)}
                  disabled={loadingId !== null}
                >
                  <strong>
                    {loadingId === plan.id ? 'Processing...' : 'Buy Now'}
                  </strong>
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {dialog}

      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
      />
    </Container>
  );
}
