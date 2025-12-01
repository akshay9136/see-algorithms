import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  LightbulbOutlined,
  PlayCircleOutline,
  SchoolOutlined,
  ShapeLine,
} from '@mui/icons-material';
import { styles } from './styles';
import { useRouter } from 'next/router';

const features = [
  {
    icon: <SchoolOutlined sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Visual Learning',
    description:
      "Stop guessing what happens inside the loop. Our visualizer isolates and highlights the algorithm's exact decisions as they occur.",
    color: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    path: '/sorting/HeapSort',
  },
  {
    icon: <PlayCircleOutline sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Playback Control',
    description:
      "Don't just watch — control the flow. Pause, resume, and step through animations at your own pace to truly understand the algorithm's behavior.",
    color: '#4f46e5',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    path: '/sorting/MergeSort',
  },
  {
    icon: <ShapeLine sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Custom Inputs',
    description:
      'Move beyond static examples. Draw custom directed or undirected graphs, edit weights, create binary trees, or input your own numbers to sort.',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    path: '/graph/Dijkstras',
  },
  {
    icon: <LightbulbOutlined sx={{ fontSize: 40, color: 'white' }} />,
    title: 'Share Scenarios',
    description:
      'Created a tricky graph or a specific tree structure? Generate a unique URL to share your exact visualization setup with peers or students instantly.',
    color: '#dc2626',
    bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    path: '/data-structures/BST',
  },
];

export default function Features() {
  const router = useRouter();

  return (
    <Grid container spacing={4} pb={4}>
      {features.map((feat, index) => (
        <Grid item sm={6} md={3} key={index} mx="auto">
          <Card
            elevation={0}
            sx={styles.card(feat)}
            onClick={() => router.push(feat.path)}
          >
            {/* Decorative background element */}
            <Box className="feature-bg" sx={styles.cardBackground(feat)} />

            {/* Icon container with gradient background */}
            <Box sx={styles.iconBox(feat)} mt={3} mx="auto">
              <Box className="feature-icon" height={40}>
                {feat.icon}
              </Box>
            </Box>

            <CardContent sx={{ px: 3, pb: 3, textAlign: 'center' }}>
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                mb={2}
                color="grey.900"
              >
                {feat.title}
              </Typography>

              <Typography lineHeight={1.6} variant="body2" color="grey.600">
                {feat.description}
              </Typography>
            </CardContent>

            {/* Bottom accent line */}
            <Box sx={styles.accentLine(feat)} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
