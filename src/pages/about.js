import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Link,
  Stack,
} from '@mui/material';
import Head from 'next/head';

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Us - See Algorithms</title>
        <meta
          name="description"
          content="Learn about See Algorithms - Our mission to make algorithm learning accessible through interactive visualizations."
        />
      </Head>
      <Box>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          fontWeight={600}
          align="center"
        >
          About See Algorithms
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
        >
          Making Algorithm Learning Accessible Through Interactive
          Visualizations
        </Typography>

        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                See Algorithms was created with a simple yet powerful mission:
                to make algorithm learning accessible, engaging, and effective
                for everyone. We believe that understanding algorithms
                shouldn&apos;t be limited to those with extensive programming
                experience or mathematical backgrounds.
              </Typography>

              <Typography variant="body1" paragraph>
                Through interactive visualizations and step-by-step animations,
                we transform complex algorithmic concepts into intuitive, visual
                experiences that anyone can understand and appreciate.
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                sx={{ my: 2 }}
              >
                Why We Built This
              </Typography>
              <Typography variant="body1" paragraph>
                Traditional algorithm learning often relies on static diagrams,
                complex mathematical notation, or dry textual explanations. We
                recognized that many learners struggle with these approaches,
                especially when trying to understand how algorithms work in
                practice.
              </Typography>

              <Typography variant="body1" paragraph>
                Our solution combines the power of modern web technologies with
                educational best practices to create an immersive learning
                experience that makes algorithms come alive through interactive
                demonstrations.
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                sx={{ my: 2 }}
              >
                What Makes Us Different
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Interactive Learning:</strong> Every algorithm comes
                with hands-on visualizations that you can control and experiment
                with
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Step-by-Step Breakdown:</strong> Complex algorithms
                are broken down into digestible steps with clear explanations
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Multiple Learning Styles:</strong> Visual,
                interactive, and textual content to accommodate different
                learning preferences
              </Typography>
              <Typography variant="body1" paragraph>
                • <strong>Real-World Applications:</strong> Understanding not
                just how algorithms work, but why they matter in practical
                scenarios
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent component={Stack} spacing={2}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Our Values
                  </Typography>
                  <Typography variant="body2">
                    <strong>Accessibility:</strong> Making complex concepts
                    understandable for all skill levels
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quality:</strong> Providing accurate,
                    well-researched educational content
                  </Typography>
                  <Typography variant="body2">
                    <strong>Innovation:</strong> Using cutting-edge technology
                    to enhance learning
                  </Typography>
                  <Typography variant="body2">
                    <strong>Community:</strong> Building a supportive learning
                    environment for all users
                  </Typography>
                </CardContent>
              </Card>

              <Card elevation={3}>
                <CardContent component={Stack} spacing={2}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Algorithm Categories
                  </Typography>
                  <Typography variant="body2">• Sorting Algorithms</Typography>
                  <Typography variant="body2">• Graph Algorithms</Typography>
                  <Typography variant="body2">• Data Structures</Typography>
                  <Typography variant="body2">
                    • Computational Geometry
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={600}
              align="center"
            >
              Our Technology
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Built with modern web technologies to ensure fast, responsive, and
              accessible learning experiences across all devices.
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={3}>
                <Card elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Next.js
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    React Framework
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Material-UI
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Design System
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Framer Motion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Animations
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Responsive
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mobile-First
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Join Our Learning Community
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you&apos;re a student, educator, or professional
              developer, See Algorithms provides the tools and resources you
              need to master algorithmic thinking.
            </Typography>
            <Typography variant="body1" paragraph>
              Start exploring algorithms today and discover the beauty of
              computational thinking!
            </Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Contact & Support
            </Typography>
            <Typography variant="body1" paragraph>
              Questions, feedback, or suggestions? We&apos;d love to hear from
              you!
            </Typography>
            <Typography variant="body1">
              Email:{' '}
              <Link href="mailto:akarande777@outlook.com">
                akarande777@outlook.com
              </Link>
            </Typography>
            <Typography variant="body1">
              GitHub:{' '}
              <Link
                href="https://github.com/akshay9136/see-algorithms"
                target="_blank"
                rel="noopener"
              >
                github.com/akshay9136/see-algorithms
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
