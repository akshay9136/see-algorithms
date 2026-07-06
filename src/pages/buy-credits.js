import { useState } from 'react';
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { AutoAwesomeOutlined } from '@mui/icons-material';
import { PRICING_PLANS } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCredits, useDialog } from '@/hooks';
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

export default function BuyCredits() {
  const [loadingId, setLoadingId] = useState(null);
  const [currency, setCurrency] = useState('INR');
  const { data: session } = useSession();
  const { credits, fetchCredits } = useCredits();
  const { dialog, showDialog } = useDialog();
  const router = useRouter();

  const handlePurchase = async (plan) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/buy-credits');
      return;
    }
    setLoadingId(plan.id);

    try {
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

      if (status === 'SUCCESS') {
        showDialog({
          title: 'Payment Successful',
          message: 'Credits have been added to your account.',
          variant: 'success',
        });
        fetchCredits();
      } else if (status === 'FAILED') {
        showDialog({
          title: 'Payment Failed',
          message: 'Failed to process payment. Please try again.',
          variant: 'error',
        });
      } else {
        showDialog({
          title: 'Payment Pending',
          message: 'We will update your credits shortly.',
          variant: 'warning',
        });
      }
    } catch (err) {
      showDialog({
        title: 'API Error',
        message: err.message || 'Something went wrong. Please try again.',
        variant: 'error',
      });
    }

    setLoadingId(null);
  };

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

      <Box display="flex" justifyContent="center" mb={4}>
        <ToggleButtonGroup
          color="primary"
          value={currency}
          exclusive
          onChange={(e, value) => setCurrency(value)}
          aria-label="Currency"
          disabled
        >
          <ToggleButton value="INR" sx={{ px: 2 }}>
            <b>INR</b>
          </ToggleButton>
          <ToggleButton value="USD" sx={{ px: 2 }}>
            <b>USD</b>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={4}>
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
                      sx={{ fontWeight: 'bold' }}
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
                  color="primary"
                  onClick={() => handlePurchase(plan)}
                  disabled={loadingId === plan.id}
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
