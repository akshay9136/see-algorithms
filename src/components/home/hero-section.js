import { Box, Card, Grid, Typography } from '@mui/material';
import Link from 'next/link';

const PREVIEW_GIFS = [
  { src: '/gifs/avl-tree.gif', alt: 'AVL Tree visualization' },
];

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
        <Card elevation={3} sx={{ borderRadius: 2, py: 1.5 }}>
          <Typography variant="h6" textAlign="center" sx={{ mb: 1 }}>
            Visualization Preview
          </Typography>

          {PREVIEW_GIFS.map((gif, index) => (
            <Box key={index} sx={{ width: '100%', flexShrink: 0 }}>
              <img
                src={gif.src}
                alt={gif.alt}
                style={{
                  width: '100%',
                  border: '1px solid #e5e5e5',
                }}
              />
            </Box>
          ))}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 2, mt: 0.5 }}
          >
            Use the controls to pause/resume animations, tweak inputs, or
            generate a shareable URL for the current graph or tree.
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
