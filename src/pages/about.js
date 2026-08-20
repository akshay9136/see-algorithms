import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CustomSeo } from '@/components/common';
import { PERSON_SCHEMA, SITE_AUTHOR } from '@/utils/constants';
import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <CustomSeo />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
      </Head>

      <Box>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          About{' '}
          <Box component="span" color="warning.main" whiteSpace="nowrap">
            See Algorithms
          </Box>
        </Typography>

        <Typography
          variant="subtitle1"
          textAlign="center !important"
          color="text.secondary"
        >
          Making Algorithm Learning Accessible Through Interactive
          Visualizations
        </Typography>

        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" component="h2" gutterBottom>
                Our Mission
              </Typography>
              <Typography paragraph>
                <strong>See Algorithms</strong> was created with a simple yet
                powerful mission: to make algorithm learning accessible,
                engaging, and effective for everyone. We believe that
                understanding algorithms shouldn&apos;t be limited to those with
                extensive programming experience or mathematical backgrounds.
              </Typography>
              <Typography paragraph>
                Through interactive visualizations and step-by-step animations,
                we transform complex algorithmic concepts into intuitive, visual
                experiences that anyone can understand and appreciate.
              </Typography>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 3 }}
              >
                Why We Built This
              </Typography>
              <Typography paragraph>
                Traditional algorithm learning often relies on static diagrams,
                complex mathematical notation, or dry textual explanations. We
                recognized that many learners struggle with these approaches,
                especially when trying to understand how algorithms work in
                practice.
              </Typography>
              <Typography paragraph>
                Our solution combines the power of modern web technologies with
                educational best practices to create an immersive learning
                experience that makes algorithms come alive through interactive
                demonstrations.
              </Typography>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 3 }}
              >
                What We Offer
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, '& li': { mb: 1.5 } }}>
                <Typography component="li">
                  <strong>Interactive Playback &amp; Step Controls:</strong>{' '}
                  Pause, resume, and step through animations at your own pace to
                  inspect algorithmic decisions as they execute.
                </Typography>
                <Typography component="li">
                  <strong>Custom Graphs &amp; Data Structures:</strong> Move
                  beyond static examples by drawing your own directed or
                  undirected graphs, editing edge weights, and building custom
                  trees.
                </Typography>
                <Typography component="li">
                  <strong>Embeddable Visualizers:</strong> Embed live,
                  responsive DSA visualizers directly into technical articles,
                  documentation, course materials, or Notion pages.
                </Typography>
                <Typography component="li">
                  <strong>Shareable Links &amp; AI Summaries:</strong> Share
                  your exact visualization setups via unique URLs, save them to
                  your library and generate AI-powered insights.
                </Typography>
                <Typography component="li">
                  <strong>In-Depth Articles &amp; Interview Prep:</strong>{' '}
                  Deep-dive articles, complexity tables, and curated interview
                  questions to bridge the gap between code and conceptual
                  understanding.
                </Typography>
              </Box>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mt: 3 }}
              >
                Our Technology
              </Typography>
              <Typography paragraph>
                Built with modern web technologies to ensure fast, responsive,
                and accessible learning experiences across all devices.
              </Typography>

              <Grid container spacing={2}>
                {[
                  { name: 'Next.js', desc: 'React Framework' },
                  { name: 'MUI', desc: 'Design System' },
                  { name: 'Motion', desc: 'Animations' },
                  { name: 'jQuery', desc: 'Custom Graphs' },
                ].map((tech) => (
                  <Grid item xs={6} sm={3} key={tech.name}>
                    <Card elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {tech.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tech.desc}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Our Values
                  </Typography>
                  <Typography paragraph>
                    <strong>Accessibility:</strong> Making complex concepts
                    understandable for all skill levels.
                  </Typography>
                  <Typography paragraph>
                    <strong>Quality:</strong> Providing accurate,
                    well-researched educational content.
                  </Typography>
                  <Typography paragraph>
                    <strong>Innovation:</strong> Using cutting-edge technology
                    to enhance learning.
                  </Typography>
                  <Typography>
                    <strong>Community:</strong> Building a supportive learning
                    environment for all users.
                  </Typography>
                </CardContent>
              </Card>

              <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>
                    Algorithm Categories
                  </Typography>
                  <Typography paragraph>• Sorting Algorithms</Typography>
                  <Typography paragraph>• Graph Algorithms</Typography>
                  <Typography paragraph>• Data Structures</Typography>
                  <Typography>• Computational Geometry</Typography>
                </CardContent>
              </Card>

              <Card elevation={3}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    The Creator
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1.5} my={1.5}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'warning.main',
                        fontSize: '1rem',
                        fontWeight: 700,
                      }}
                    >
                      AK
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        lineHeight={1.5}
                      >
                        <Link href="/author" underline="hover" color="inherit">
                          {SITE_AUTHOR.name}
                        </Link>
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Software Engineer &amp; Educator
                      </Typography>
                    </Box>
                  </Box>
                  <Typography paragraph sx={{ mb: 1.5 }}>
                    Built See Algorithms to make complex algorithms intuitive
                    and accessible through step-by-step interactive
                    visualizations.
                  </Typography>
                  <Link href="/author" underline="hover">
                    Learn more about the author →
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Join Our Learning Community
            </Typography>
            <Typography paragraph>
              Whether you&apos;re a student, educator, or professional
              developer, See Algorithms provides the tools and resources you
              need to master algorithmic thinking.
            </Typography>
            <Typography paragraph>
              Start exploring algorithms today and discover the beauty of
              computational thinking!
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Affiliate Disclosure
            </Typography>
            <Typography paragraph>
              This site may contain affiliate links. I may earn a commission if
              you purchase through them. This helps support the site at no extra
              cost to you.
            </Typography>
            <Typography paragraph>
              I only recommend products and services that I believe will add
              value to my users. Thank you for your support!
            </Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Contact &amp; Support
            </Typography>
            <Typography paragraph>
              Questions, feedback, or suggestions? We&apos;d love to hear from
              you!
            </Typography>
            <Typography gutterBottom>
              Email:{' '}
              <Link href="mailto:hello@see-algorithms.com">
                hello@see-algorithms.com
              </Link>
            </Typography>
            <Typography>
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
