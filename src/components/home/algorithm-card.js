import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { CategoryColors } from '@/common/constants';
import Link from 'next/link';

export default function AlgorithmCard({ algo }) {
  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flex: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Chip
            label={algo.category}
            size="small"
            color={CategoryColors[algo.category]}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />

          <Chip
            label={algo.timeComplexity}
            size="small"
            sx={{ fontSize: '0.825rem !important', borderRadius: 1.5 }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          fontWeight={600}
          color="text.primary"
          sx={{ fontSize: '1.15rem', mb: 1 }}
        >
          {algo.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5,
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
          borderColor: 'divider',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          {algo.difficulty}
        </Typography>

        <Button
          component={Link}
          href={algo.path}
          color="primary"
          endIcon={<ArrowForward fontSize="small" />}
          sx={{
            py: 0,
            textTransform: 'none',
            fontWeight: 600,
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
