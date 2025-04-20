import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Features from '../components/features';

export default function HomePage() {
  return (
    <Container sx={{p: 0 }}>
      <Typography variant="h4" align="center" my={3}>
        Visualization of Algorithms
      </Typography>
      <Typography variant="h6" align="center">
        Short explanations. Interactive steps. Share your learning.
      </Typography>
      <Typography variant="body1" my={4}>
        From sorting and searching to more advanced data structures and
        algorithms, <strong>see algorithms</strong> provides a hands-on approach
        to learning. Each animation is carefully crafted to walk you through the
        inner workings of various algorithms, step by step. Whether you're a
        student seeking to solidify your knowledge, an educator looking for
        dynamic teaching tools, or simply someone with a passion for computer
        science, you'll find value in our extensive library of visual resources.
      </Typography>
      <Features />
    </Container>
  );
}
