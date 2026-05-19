import { Box, Skeleton, Stack } from '@mui/material';

/**
 * Loading skeleton placeholder for comments.
 */
export default function CommentLoading() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Stack key={i} direction="row" gap={2} sx={{ py: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="30%" height={20} sx={{ mb: 1 }} />
            <Skeleton width="90%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton width="60%" height={20} />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
