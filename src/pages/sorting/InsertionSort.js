import { Box, Divider, Stack, Typography } from '@mui/material';
import { InputNumbers, ComplexityTable, Section } from '@/components/common';
import { useInsertionSort } from '@/hooks/sorting';
import Link from 'next/link';

export default function InsertionSort() {
  const { animation, pseudocode, handleSort, handleStop } = useInsertionSort();

  return (
    <>
      <Typography paragraph>
        <strong>Insertion Sort</strong> is a simple, comparison-based sorting
        algorithm that builds the final sorted array one element at a time. It
        takes each element from the unsorted part and slides it into its correct
        position in the sorted part. It is like placing a new card in the right
        spot of a sorted hand, making it intuitive and efficient for small
        datasets. Like <Link href="/sorting/BubbleSort">Bubble Sort</Link>,
        Insertion Sort is a O(n²) algorithm, but it performs significantly
        better on nearly sorted data.
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
          <Section title="How It Works" variant="h6">
            <Typography paragraph>
              Insertion Sort starts with the second element in the array
              (considering the first element as already sorted). It picks this
              &quot;key&quot; element and compares it with the elements to its
              left. If any of those elements are larger than the key, they are
              shifted one position to the right. The key is then inserted into
              the gap created by the shifting. This process repeats for each
              subsequent element until the entire array is sorted. Because the
              algorithm only moves elements when necessary, it is particularly
              efficient when the input data is already mostly sorted.
            </Typography>
          </Section>
          <Section title="When to Use" variant="h6" sx={{ mb: 0 }}>
            <Typography>
              Insertion Sort is ideal for small datasets, nearly sorted arrays,
              or as a finishing step inside more complex algorithms like Timsort
              (Python&apos;s built-in sort). Many hybrid sorting algorithms
              switch to Insertion Sort for small sub-arrays because its low
              overhead and cache-friendly access patterns outperform
              divide-and-conquer algorithms at that scale.
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
      'When the array is already sorted, each element is compared once and no shifting is needed.',
  },
  {
    type: 'Average Case',
    complexity: 'O(n²)',
    description:
      'On average, each element must be compared with about half of the elements already in the sorted portion.',
  },
  {
    type: 'Worst Case',
    complexity: 'O(n²)',
    description:
      'When the array is sorted in reverse order, every element must be compared with all previously sorted elements.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(1)',
    description: (
      <>
        Insertion Sort is an{' '}
        <Link href="/articles/inplace-sorting">in-place</Link> algorithm that
        sorts by shifting elements within the original array.
      </>
    ),
  },
];
