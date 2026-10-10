import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';

const CATEGORY_COLORS = {
  Sorting: { bgcolor: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  Graph: { bgcolor: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  'Data Structures': { bgcolor: '#fffbeb', text: '#b45309', border: '#fde68a' },
  'Advanced Trees': { bgcolor: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  Other: { bgcolor: '#fff1f2', text: '#be123c', border: '#fecdd3' },
};

export default function AlgorithmCard({ algo }) {
  const catStyle = CATEGORY_COLORS[algo.category] || {};

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ padding: 2.5 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.25,
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 1.5,
              bgcolor: catStyle.bgcolor,
              color: catStyle.text,
              border: '1px solid',
              borderColor: catStyle.border,
            }}
          >
            {algo.category}
          </Box>

          <Chip
            label={algo.timeComplexity}
            size="small"
            sx={{
              borderRadius: 1.5,
              fontSize: '0.75rem',
              bgcolor: 'grey.100',
              color: 'grey.800',
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          fontWeight={600}
          color="grey.900"
          sx={{ fontSize: '1.15rem', mb: 1 }}
        >
          {algo.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {algo.description}
        </Typography>
      </CardContent>

      {/* Footer Action */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.secondary"
        >
          {algo.difficulty}
        </Typography>

        <Button
          component={Link}
          href={algo.path}
          size="small"
          color="primary"
          endIcon={<ArrowForward fontSize="small" />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            padding: 0,
            minWidth: 'auto',
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Launch Visualizer
        </Button>
      </Box>
    </Card>
  );
}
