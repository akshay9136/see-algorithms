import {
  Box,
  CardActionArea,
  Container,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { AutoAwesome, LinkedIn, MovieOutlined } from '@mui/icons-material';
import { PERSON_SCHEMA, SITE_AUTHOR } from '@/utils/constants';
import { Section } from '@/components/common';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

const authorLinks = [
  {
    title: 'Cosmo Curated',
    description:
      'Essays and visual guides on astrophysics and cosmology, for everyone curious about the universe.',
    label: 'Explore Cosmo Curated',
    href: 'https://cosmocurated.com/',
    icon: AutoAwesome,
    appearance: 'cosmoCurated',
  },
  {
    title: 'CineTrail',
    description:
      'An AI-powered movie companion with plot breakdowns, critical reviews, and character analyses.',
    label: 'Explore CineTrail',
    href: 'https://cinetrail.app/',
    icon: MovieOutlined,
    appearance: 'cineTrail',
  },
];

const linkedInProfile = {
  title: 'LinkedIn',
  description:
    'Learn more about my software engineering experience and connect with me on LinkedIn.',
  label: 'View LinkedIn profile',
  href: SITE_AUTHOR.linkedIn,
  icon: LinkedIn,
  appearance: 'linkedIn',
};

function AuthorLinkCard({
  title,
  description,
  label,
  href,
  icon: Icon,
  appearance,
}) {
  return (
    <CardActionArea
      href={href}
      aria-label={label}
      sx={[styles.linkCard, styles.linkCardAppearance[appearance]]}
    >
      <Box display="flex" alignItems="center">
        <Icon sx={{ color: 'var(--card-accent)', mr: 1 }} />
        <Typography component="h2" variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      <Typography sx={{ color: 'var(--card-accent)' }}>
        {description}
      </Typography>
      <Typography component="span" sx={styles.linkCardLabel}>
        {label}
      </Typography>
    </CardActionArea>
  );
}

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

      <Container maxWidth="md" disableGutters>
        <Box sx={styles.cardGrid}>
          <Box component="header" sx={styles.profileHeader}>
            <Box sx={styles.portrait}>
              <Image
                src={SITE_AUTHOR.image}
                alt={SITE_AUTHOR.name}
                width={300}
                height={300}
              />
            </Box>
            <Typography component="h1" sx={styles.profileTitle}>
              {SITE_AUTHOR.name}
            </Typography>
            <Typography color="text.secondary" fontWeight={600} gridArea="bio">
              Software engineer, educator, and creator of{' '}
              <MuiLink component={Link} href="/" underline="always">
                See Algorithms
              </MuiLink>
              .
            </Typography>
          </Box>
          <AuthorLinkCard {...linkedInProfile} />
        </Box>

        <Section title="How See Algorithms started" sx={{ mt: 4 }}>
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
        </Section>

        <Section title="My other projects" sx={{ textAlign: 'left' }}>
          <Box sx={styles.cardGrid} mt={2.5}>
            {authorLinks.map((link) => (
              <AuthorLinkCard key={link.title} {...link} />
            ))}
          </Box>
        </Section>
      </Container>
    </>
  );
}

const styles = {
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
    },
    gap: 2.5,
  },
  profileHeader: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    gridTemplateAreas: {
      xs: '"portrait name" "bio bio"',
      lg: '"portrait name" "portrait bio"',
    },
    alignContent: 'center',
    alignItems: 'center',
    columnGap: { xs: 2, lg: 2.5 },
    rowGap: { xs: 1.5, lg: 0 },
    padding: { xs: 2.5, sm: 3 },
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 3,
    bgcolor: 'action.hover',
  },
  portrait: {
    gridArea: 'portrait',
    width: { xs: 64, sm: 80, lg: 96 },
    borderRadius: 2.5,
    overflow: 'hidden',
    '& img': {
      display: 'block',
      width: '100%',
      height: 'auto',
    },
  },
  profileTitle: {
    gridArea: 'name',
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  linkCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 1,
    padding: { xs: 2.5, sm: 3 },
    overflow: 'hidden',
    borderRadius: 3,
    color: 'white',
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'text.primary',
      outlineOffset: 3,
    },
  },
  linkCardAppearance: {
    cosmoCurated: {
      '--card-accent': '#eadcff',
      background: 'radial-gradient(ellipse at top right, #493275, #211638 72%)',
    },
    cineTrail: {
      '--card-accent': '#e0f2fe',
      background: 'radial-gradient(ellipse at top right, #075985, #023755 72%)',
    },
    linkedIn: {
      '--card-accent': '#dbeafe',
      background: 'radial-gradient(ellipse at top right, #0A66C2, #0a58a8 72%)',
    },
  },
  linkCardLabel: {
    pt: 1,
    color: 'var(--card-accent)',
    fontWeight: 600,
    textDecoration: 'underline',
  },
};
