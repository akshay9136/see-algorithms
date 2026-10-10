import { Box, Card, Grid, Typography } from '@mui/material';
import {
  PlayCircleOutline,
  DrawOutlined,
  AutoAwesomeOutlined,
  AccountTreeOutlined,
  PolylineOutlined,
} from '@mui/icons-material';

const STATS = [
  {
    icon: <PolylineOutlined sx={{ fontSize: 36, color: '#2563eb' }} />,
    title: '30+ Visualizers',
    subtitle: 'Sorting, Graphs, Trees, Heaps & Geometry',
    bgColor: '#eff6ff',
  },
  {
    icon: <PlayCircleOutline sx={{ fontSize: 36, color: '#059669' }} />,
    title: 'Playback Control',
    subtitle: 'Pause, step through, or step back anytime',
    bgColor: '#ecfdf5',
  },
  {
    icon: <DrawOutlined sx={{ fontSize: 36, color: '#d97706' }} />,
    title: 'Custom Inputs',
    subtitle: 'Draw interactive graphs or sort custom arrays',
    bgColor: '#fffbeb',
  },
  {
    icon: <AutoAwesomeOutlined sx={{ fontSize: 36, color: '#7c3aed' }} />,
    title: 'AI Insights',
    subtitle: 'Get AI generated step-by-step breakdowns',
    bgColor: '#f5f3ff',
  },
];

export default function QuickStats() {
  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={2}>
        {STATS.map((stat, i) => (
          <Grid item xs={12} md={6} lg={3} key={i}>
            <Card
              elevation={1}
              sx={{
                gap: 2,
                padding: 2,
                height: '100%',
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
