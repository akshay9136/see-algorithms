import { Box, Divider, Stack, Typography } from '@mui/material';
import { InputNumbers, ComplexityTable, Section } from '@/components/common';
import { useRadixSort } from '@/hooks/sorting';
import Link from 'next/link';

const complexityData = [
  {
    type: 'Time Complexity',
    complexity: 'O(n × k)',
    description:
      'Where n is the number of elements and k is the number of digits in the largest number. This makes Radix Sort linear when k is a constant.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n + k)',
    description: (
      <>
        Radix Sort requires additional memory for the buckets. It is not an{' '}
        <Link href="/articles/inplace-sorting">in-place</Link> algorithm.
      </>
    ),
  },
];

export default function RadixSort() {
  const { animation, pseudocode, handleSort, handleStop } = useRadixSort();

  return (
    <>
      <Typography paragraph>
        <strong>Radix Sort</strong> organizes numbers by sorting them digit by
        digit. It starts with the least significant digit (rightmost) and works
        to the most significant digit (leftmost). Numbers are placed into
        buckets based on each digit&apos;s value, then collected back together
        in order. This process is repeated for each digit using a stable
        distribution — numbers with the same digit maintain their relative order
        from the previous pass — eventually leading to a fully sorted list.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          {pseudocode}
        </Stack>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Visualizer
          </Typography>
          <InputNumbers onStart={handleSort} onReset={handleStop} />
          {animation}
        </Stack>
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section variant="h6" title="How It Works">
            <Typography paragraph>
              Radix Sort never directly compares two elements against each
              other. Instead, it exploits the structure of the numbers
              themselves. Starting from the least significant digit (ones
              place), the algorithm distributes all numbers into 10 buckets
              (0–9) based on the value of that digit. The numbers are then
              collected back from the buckets in order, preserving the sequence
              within each bucket. This process is repeated for the tens place,
              hundreds place, and so on, until all digit positions have been
              processed, resulting in a fully sorted array.
            </Typography>
          </Section>
          <Section variant="h6" title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Radix Sort excels when sorting large collections of integers or
              fixed-length strings where the number of digits (k) is small
              relative to the number of elements (n). It outperforms
              comparison-based sorts in these scenarios because it avoids the
              O(n log n) lower bound that applies to comparison sorts. However,
              it is less versatile — it requires elements that can be decomposed
              into digits or characters. For floating-point numbers or complex
              objects, comparison-based algorithms are more appropriate.
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>
    </>
  );
}
