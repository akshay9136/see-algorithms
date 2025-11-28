import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import Features from '@/components/features';

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      {/* HERO */}
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={7}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            Visualize the Logic{' '}
            <Box component="span" color="warning.main">
              Behind the Code
            </Box>
          </Typography>

          <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            fontWeight={400}
          >
            Master sorting, searching, and graph algorithms through clean,
            interactive animations. Build your own data structures and watch
            them come to life.
          </Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  height: 220,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  [Animated preview placeholder]
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
              >
                Use the controls to pause/resume animations, tweak inputs, or
                generate a shareable URL for the current graph.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Features />
      </Box>

      <Box bgcolor="success.light" color="primary.contrastText" py={5}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
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
