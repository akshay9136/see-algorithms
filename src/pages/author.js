import {
  Avatar,
  Box,
  Container,
  Divider,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import Head from 'next/head';
import { PERSON_SCHEMA, SITE_AUTHOR } from '@/utils/constants';

export default function AuthorPage() {
  return (
    <>
      <Head>
        <title>{SITE_AUTHOR.name} — Author | See Algorithms</title>
        <meta
          name="description"
          content={`${SITE_AUTHOR.name} is the creator of See Algorithms — an interactive platform for learning sorting, graph, and data structure algorithms through step-by-step visualizations.`}
        />
        <link rel="canonical" href={SITE_AUTHOR.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
      </Head>

      <Container maxWidth="lg" sx={{ p: 0 }}>
        <Box display="flex" gap={2}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'warning.main',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            AK
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              component="h1"
              fontWeight={700}
              lineHeight={1.5}
            >
              {SITE_AUTHOR.name}
            </Typography>
            <Typography color="text.secondary">
              Software Engineer &amp; Educator · Creator of{' '}
              <MuiLink component={Link} href="/">
                See Algorithms
              </MuiLink>
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Box mb={4}>
          <Typography paragraph>
            I&apos;m a Software Engineer with a deep passion for Computer
            Science education and visual learning. I believe the most intuitive
            way to master an algorithm isn&apos;t just memorizing pseudocode or
            tracing static textbook diagrams &mdash; it&apos;s getting to{' '}
            <em>see</em> it execute step by step, at your own pace.
          </Typography>

          <Typography paragraph>
            What you see today as <strong>See Algorithms</strong> originally
            started as a college project during my engineering days. Like many
            students, I found traditional resources &mdash; walls of dry code
            and rigid illustrations &mdash; insufficient for building strong
            mental models of dynamic processes like recursion trees, graph
            traversals, or self-balancing rotations. To solve this for myself
            and my peers, I began building interactive, canvas-driven
            visualizations where every pointer move, swap, and state change
            could be observed in real time.
          </Typography>

          <Typography paragraph>
            Building this platform from scratch went far beyond typical
            coursework. It came with real engineering hurdles &mdash; capturing
            continuous algorithm loops into pausable, step-by-step executions,
            handling asynchronous playback timers, and calculating coordinates
            to align node positions during dynamic rotations. When it came time
            to graduate and interview for software engineering roles, being able
            to walk through these concrete architectural decisions and
            trade-offs turned this project into the cornerstone of my technical
            portfolio, directly helping me land my first job.
          </Typography>

          <Typography paragraph>
            Since then, what started as a classroom idea has grown into a
            comprehensive open platform covering 30+ algorithms across sorting,
            graph traversal, tree data structures, and computational geometry.
            Whether you&apos;re a student preparing for technical interviews, an
            educator looking for dynamic classroom demos, or a curious developer
            revisiting fundamentals, <strong>See Algorithms</strong> is built to
            make that learning journey clear, engaging, and accessible.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
