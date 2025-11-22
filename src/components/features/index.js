import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { styles } from './styles';
import Image from 'next/image';

const features = [
  {
    icon: '/icons/steps.png',
    title: 'Step by Step',
    description:
      'Understand algorithms through clear, interactive visuals that break down complex concepts.',
    color: '#4f46e5',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    path: '/sorting/MergeSort',
  },
  {
    icon: '/icons/draw.png',
    title: 'Draw Graphs',
    description:
      'Visualize with custom graphs and data structures using our intuitive drawing tools.',
    color: '#059669',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    path: '/graph/BFS',
  },
  {
    icon: '/icons/save.png',
    title: 'Save & Share',
    description:
      'Keep track of your graphs and share them with others in your learning community.',
    color: '#dc2626',
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    path: '/graph/Dijkstra',
  },
  {
    icon: '/icons/learn.png',
    title: 'Simple Learning',
    description:
      'Focus on the essentials with concise explanations and progressive difficulty levels.',
    color: '#7c3aed',
    bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    path: '/sorting/HeapSort',
  },
];

export default function Features() {
  const router = useRouter();

  return (
    <Grid container spacing={4} pb={4}>
      {features.map((feat, index) => (
        <Grid item xs={9} sm={6} md={3} key={index} mx="auto">
          <Card
            elevation={0}
            sx={styles.card(feat)}
            onClick={() => router.push(feat.path)}
          >
            {/* Decorative background element */}
            <Box className="feature-bg" sx={styles.cardBackground(feat)} />

            {/* Icon container with gradient background */}
            <Box display="flex" justifyContent="center" pt={3}>
              <Box sx={styles.iconBox(feat)}>
                <Image
                  src={feat.icon}
                  alt={feat.title}
                  width={70}
                  height={70}
                  className="feature-icon"
                  style={{
                    transition: 'transform 0.3s ease',
                    borderRadius: 8,
                  }}
                />
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
