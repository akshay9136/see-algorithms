import { Box, GridLegacy as Grid, Typography } from '@mui/material';
import Previews from './previews';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} lg={6}>
        <Typography variant="h4" component="h1" gutterBottom>
          Visualize the Logic
          <Box
            component="span"
            color="warning.main"
            sx={{ display: 'block', mt: 0.5 }}
          >
            Behind the Code
          </Box>
        </Typography>

        <Typography mt={2}>
          From sorting and searching to more advanced data structures and
          algorithms, <strong>See Algorithms</strong> provides a hands-on
          approach to learning. Each animation is carefully crafted to walk you
          through the inner workings of various algorithms, step by step.
          Whether you&apos;re a student seeking to solidify your knowledge, an
          educator looking for dynamic teaching tools, or simply someone with a
          passion for computer science, you&apos;ll find value in our extensive
          library of visual resources. Explore our{' '}
          <Link href="/articles">articles</Link> to deepen your understanding.
        </Typography>

        <Typography
          sx={{
            padding: 2,
            mt: 2,
            bgcolor: 'primary.50',
            borderLeft: 4,
            borderColor: 'primary.main',
            borderRadius: 1,
          }}
        >
          <strong>New Features:</strong> Elevate your learning with AI-powered
          insights, explore fearlessly with Undo / Redo, save custom setups to
          resume instantly, and embed interactive visualizers directly into your
          own website.
        </Typography>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Previews />
      </Grid>
    </Grid>
  );
}
