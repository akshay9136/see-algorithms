import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';

const features = [
  {
    icon: '/icons/steps.png',
    title: 'Step by Step',
    description: 'Understand algorithms through clear, interactive visuals.',
  },
  {
    icon: '/icons/editor.png',
    title: 'Draw Graphs',
    description: 'Visualize with custom graphs and data structures.',
  },
  {
    icon: '/icons/save.png',
    title: 'Save & Share',
    description: 'Keep track of your graphs and share it with others.',
  },
  {
    icon: '/icons/learn.png',
    title: 'Simple Learning',
    description: 'Focus on the essentials with concise explanations.',
  },
];

export default function Features() {
  return (
    <Grid container spacing={4} justifyContent="center" pb={3}>
      {features.map((feat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            elevation={3}
            sx={{ p: 2, textAlign: 'center', bgcolor: '#fcfeff' }}
          >
            <Image src={feat.icon} alt={feat.title} width={80} height={80} />
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {feat.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feat.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
