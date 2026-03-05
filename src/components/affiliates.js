import {
  Card,
  CardActionArea,
  Typography,
  Box,
  Grid,
  Chip,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Image from 'next/image';

const RESOURCES = [
  {
    title: 'Coding Interview Bootcamp: Algorithms + Data Structures',
    description:
      'Learn essential data structures and algorithms step-by-step with practical JavaScript examples.',
    link: 'https://trk.udemy.com/QYOyr6',
    tag: 'Beginner Friendly',
    color: 'success',
  },
  {
    title: 'JavaScript Algorithms & Data Structures Masterclass',
    description:
      'Master DSA fundamentals, problem-solving techniques, and advanced structures using JavaScript.',
    link: 'https://trk.udemy.com/9VWgPj',
    tag: 'Practical Guide',
    color: 'warning',
  },
  {
    title: 'Master the Coding Interview: Data Structures + Algorithms',
    description:
      'Prepare for top tech interviews with advanced DSA concepts and real-world coding challenges.',
    link: 'https://trk.udemy.com/GbjmB9',
    tag: 'Deep Dive',
    color: 'info',
  },
];

function CardHeader(item) {
  return (
    <Box display="flex" width="100%" mb={2}>
      <Chip
        size="small"
        label={item.tag}
        color={item.color || 'primary'}
        variant="outlined"
        sx={{ fontWeight: 600, lineHeight: 1.4 }}
      />
      <LaunchIcon
        fontSize="small"
        color="action"
        sx={{ opacity: 0.7, ml: 'auto' }}
      />
    </Box>
  );
}

function Affiliates() {
  return (
    <Box component="section">
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AutoStoriesIcon color="primary" fontSize="large" />
        <Box>
          <Typography variant="h6" fontSize="1.2rem">
            Curious to Learn More?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hand-picked resources to deepen your understanding
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {RESOURCES.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card elevation={2} sx={styles.card}>
              <CardActionArea
                component="a"
                href={item.link}
                target="_blank"
                rel="nofollow sponsored"
                sx={styles.cardAction}
              >
                <CardHeader {...item} />

                <Typography variant="subtitle1" gutterBottom lineHeight={1.4}>
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.4}
                >
                  {item.description}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        display="flex"
        justifyContent="center"
        sx={{ display: { xs: 'none', sm: 'flex' }, mt: 4 }}
      >
        <a href={BANNER_LINK} target="_blank" rel="nofollow sponsored">
          <Image
            src="/udemy-banner.png"
            alt="Learn DSA on Udemy"
            width={800}
            height={200}
            style={styles.banner}
          />
        </a>
      </Box>

      <Box sx={{ display: { sm: 'none' }, mt: 4 }}>
        <a href={BANNER_LINK} target="_blank" rel="nofollow sponsored">
          <Image
            src="/udemy-banner-small.png"
            alt="Learn DSA on Udemy"
            width={400}
            height={400}
            style={styles.banner}
          />
        </a>
      </Box>

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        color="text.disabled"
        mt={2}
      >
        As an Udemy Associate, I earn from qualifying purchases.
      </Typography>
    </Box>
  );
}

const BANNER_LINK = 'https://trk.udemy.com/c/6805590/3193860/39854';

const styles = {
  card: {
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
      borderColor: 'primary.main',
      boxShadow: 6,
    },
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
  },
  cardAction: {
    height: '100%',
    padding: 2.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  banner: {
    width: '100%',
    height: 'auto',
    borderRadius: 8,
  },
};

export default Affiliates;
