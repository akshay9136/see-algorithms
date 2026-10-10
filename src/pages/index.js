import { Box, Container, Divider, Typography } from '@mui/material';
import AlgoCatalog from '@/components/home/algo-catalog';
import HeroSection from '@/components/home/hero-section';
import Features from '@/components/features';
import Head from 'next/head';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ px: 0 }}>
      <Head>
        <meta
          name="impact-site-verification"
          value="a7e7b9b7-e9c4-4487-a779-71356560214e"
        />
      </Head>

      <HeroSection />

      <Divider sx={{ my: 4 }} />

      <Box>
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" component="h2">
            Built for Deep Conceptual Understanding
          </Typography>
          <Typography color="text.secondary" mx="auto" mt={1}>
            Everything you need to experiment, analyze, and retain algorithm
            mechanics.
          </Typography>
        </Box>
        <Features />
      </Box>

      <Box bgcolor="success.light" color="primary.contrastText" py={5}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>
            Bridge the Gap Between Code and Concept
          </Typography>

          <Typography sx={{ opacity: 0.9 }}>
            Textbooks and code editors can sometimes make logic feel abstract.{' '}
            <strong>SEE ALGORITHMS</strong> transforms complex logic into clear,
            step-by-step visualizations. Whether you are analyzing a directed
            graph or balancing a binary tree, our platform provides a focused,
            distraction-free environment to experiment and learn.
          </Typography>
        </Container>
      </Box>

      <Divider sx={{ my: 4 }} />

      <AlgoCatalog />
    </Container>
  );
}
