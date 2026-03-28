import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers } from '@/components/common';
import { useRadixSort } from '@/hooks/sorting';

function RadixSort() {
  const { animation, pseudocode, handleSort, handleStop } = useRadixSort();

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        <strong>Radix Sort</strong> organizes numbers by sorting them digit by
        digit. It starts with the least significant digit (rightmost) and works
        to the most significant digit (leftmost). Numbers are placed into
        buckets based on each digit&apos;s value, then collected back together
        in order. This process is repeated for each digit, leading to arr sorted
        list.
      </Typography>
      <Typography variant="h6" component="h2">
        Things to Observe
      </Typography>
      <Typography
        component="ul"
        variant="body1"
        sx={{ '& li': { mb: 1 } }}
      >
        <li>
          <strong>Digit by Digit:</strong> Notice how the sorting happens in
          passes, one for each digit place (ones, tens, hundreds, etc.),
          starting from the rightmost digit.
        </li>
        <li>
          <strong>Bucketing:</strong> In each pass, watch how the numbers are
          distributed into {'"buckets"'} (0-9) based on the value of the current
          digit. They are then collected back from the buckets in order,
          preserving the relative order from the previous pass.
        </li>
      </Typography>
      <Typography variant="h6" component="h2">
        Pseudocode
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap">
        {pseudocode}
        <Stack spacing={2}>
          <InputNumbers onStart={handleSort} onReset={handleStop} />
          {animation}
        </Stack>
      </Box>
    </Stack>
  );
}

export default RadixSort;
