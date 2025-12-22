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

const RESOURCES = [
  {
    title: 'Grokking Algorithms',
    description:
      'A friendly, fully illustrated guide. The best starting point for visual learners.',
    link: 'https://amzn.to/3YFdbKs',
    tag: 'Beginner Friendly',
    color: 'success',
  },
  {
    title: 'A Common-Sense Guide to Data Structures and Algorithms',
    description:
      'A practical guide with clear explanations and real-world examples.',
    link: 'https://amzn.to/4aL8B4T',
    tag: 'Practical Guide',
    color: 'warning',
  },
  {
    title: 'Introduction to Algorithms',
    description:
      'The definitive guide (CLRS). Comprehensive and rigorous, perfect for deep diving into theory.',
    link: 'https://amzn.to/4aYPsfx',
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

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        color="text.disabled"
        mt={4}
      >
        As an Amazon Associate, I earn from qualifying purchases. This helps
        support the site at no extra cost to you.
      </Typography>
    </Box>
  );
}

export default Affiliates;

const styles = {
  card: {
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: 'primary.main',
      boxShadow: 6,
    },
    border: 1,
    borderColor: 'divider',
  },
  cardAction: {
    height: '100%',
    padding: 2.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
};
