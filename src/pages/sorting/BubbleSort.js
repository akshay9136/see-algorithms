import { Box, Divider, Stack, Typography } from '@mui/material';
import { InputNumbers, ComplexityTable, Section } from '@/components/common';
import { useBubbleSort } from '@/hooks/sorting';
import Link from 'next/link';

export default function BubbleSort() {
  const { animation, pseudocode, handleSort, handleStop } = useBubbleSort();

  return (
    <>
      <Typography paragraph>
        <strong>Bubble Sort</strong> is a simple sorting algorithm that works by
        repeatedly swapping adjacent elements if they are in the wrong order.
        This process continues until the list is fully sorted. While it&apos;s
        easy to understand, Bubble Sort is not very efficient for large datasets
        due to its quadratic time complexity. It’s often used for educational
        purposes or as a baseline for comparison with other sorting algorithms.
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
          <br />
          {animation}
        </Stack>
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section variant="h6" title="How It Works">
            <Typography paragraph>
              Bubble Sort begins at the start of the array and compares the
              first two elements. If the first element is greater than the
              second, they are swapped. The algorithm then moves to the next
              pair and repeats the comparison. After one complete pass through
              the array, the largest element will have &quot;bubbled up&quot; to
              the last position. The algorithm then repeats the process for the
              remaining unsorted portion, ignoring the already-sorted elements
              at the end. This continues until no swaps are needed in a full
              pass, indicating the array is sorted.
            </Typography>
          </Section>
          <Section variant="h6" title="When To Use" sx={{ mb: 0 }}>
            <Typography>
              Bubble Sort is primarily used as a teaching tool to introduce
              sorting concepts because of its simplicity. In practice, more
              efficient divide-and-conquer algorithms are preferred for large
              datasets. However, Bubble Sort can be useful for very small arrays
              or when the data is nearly sorted, as its optimized version
              achieves O(n) performance in the best case.
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>
    </>
  );
}

const complexityData = [
  {
    type: 'Best Case',
    complexity: 'O(n)',
    description:
      'When the array is already sorted and the optimized version detects no swaps in the first pass.',
  },
  {
    type: 'Average Case',
    complexity: 'O(n²)',
    description:
      'On average, each element must be compared with every other element.',
  },
  {
    type: 'Worst Case',
    complexity: 'O(n²)',
    description:
      'When the array is sorted in reverse order, every possible swap must be performed.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(1)',
    description: (
      <>
        Bubble Sort is an <Link href="/articles/inplace-sorting">in-place</Link>{' '}
        algorithm that only requires a constant amount of additional memory for
        the swap variable.
      </>
    ),
  },
];
