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
} from '@mui/material';
import { AutoAwesomeOutlined } from '@mui/icons-material';
import { PRICING_PLANS } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { showError } from '@/common/utils';
import { showToast } from '@/components/toast';
import useCredits from '@/hooks/useCredits';

const styles = {
  introBox: {
    background: (theme) =>
      `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.secondary.light}22 100%)`,
    border: '1px solid',
    borderColor: 'primary.light',
    borderRadius: 3,
    padding: { xs: 3, md: 4 },
    mb: 6,
  },
  pricingCard: (recommended) => ({
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...(recommended && {
      border: 2,
      borderColor: 'primary.main',
      boxShadow: 4,
    }),
  }),
};

export default function BuyCredits() {
  const { data: session } = useSession();
  const { fetchCredits } = useCredits();
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();

  const handlePurchase = async (plan) => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent('/buy-credits')}`);
      return;
    }
    setLoadingId(plan.id);
    try {
      // To do: implement payment gateway
    } catch (err) {
      showError('Failed to process payment. Please try again.');
    }
    setLoadingId(null);
  };

  return (
    <Container sx={{ minWidth: { md: 900 } }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Get AI Credits
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Purchase credits to generate AI summaries for your custom algorithms.
        </Typography>
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
          Each time you request a summary, few credits are consumed to query our
          AI. It reads your exact custom graph topology, tree structure, or
          input array and produces a clear, step-by-step narrative — covering
          time complexity, edge cases, and the reasoning behind every pivotal
          step. Credits never expire, so you can learn at your own pace without
          feeling pressured by a ticking clock or a monthly billing cycle.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {PRICING_PLANS.map((plan) => (
          <Grid item key={plan.id} xs={12} sm={4}>
            <Card sx={styles.pricingCard(plan.recommended)}>
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
                  <Typography component="h2" variant="h4" color="text.primary">
                    ${plan.price}
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
                  variant={plan.recommended ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handlePurchase(plan)}
                  disabled={true}
                >
                  {loadingId === plan.id ? 'Processing...' : 'Buy Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
