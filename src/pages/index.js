import { Box, Card, Container, Grid, Typography } from '@mui/material';
import Features from '@/components/features';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ pl: 0 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            color="text.primary"
            gutterBottom
          >
            Visualize the Logic
            <Box
              component="span"
              color="warning.main"
              sx={{ display: 'block', mt: 0.5 }}
            >
              Behind the Code
            </Box>
          </Typography>

          <Typography variant="body1" mt={2}>
            From sorting and searching to more advanced data structures and
            algorithms, <strong>SEE Algorithms</strong> provides a hands-on
            approach to learning. Each animation is carefully crafted to walk
            you through the inner workings of various algorithms, step by step.
            Whether you&apos;re a student seeking to solidify your knowledge, an
            educator looking for dynamic teaching tools, or simply someone with
            a passion for computer science, you&apos;ll find value in our
            extensive library of visual resources.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2, py: 1 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              textAlign="center"
            >
              Visualization Preview
            </Typography>

            <img src="/preview.gif" alt="preview" width="100%" />

            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              px={2}
            >
              Use the controls to pause/resume animations, tweak inputs, or
              generate a shareable URL for the current graph.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Features />
      </Box>

      <Box bgcolor="success.light" color="primary.contrastText" py={5}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
            Bridge the Gap Between Code and Concept
          </Typography>

          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Textbooks and code editors can sometimes make logic feel abstract.{' '}
            <strong>SEE ALGORITHMS</strong> transforms complex logic into clear,
            step-by-step visualizations. Whether you are analyzing a directed
            graph or balancing a binary tree, our platform provides a focused,
            distraction-free environment to experiment and learn.
          </Typography>
        </Container>
      </Box>
    </Container>
  );
}
