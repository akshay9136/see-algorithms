import { Box, Divider, Stack, Typography } from '@mui/material';
import { InputNumbers, ComplexityTable, Section } from '@/components/common';
import { useAlgorithm } from '@/hooks';
import { useQuickSort } from '@/hooks/sorting';
import Link from 'next/link';

export default function QuickSort() {
  const { animation, pseudocode, handleSort, handleStop } = useQuickSort();
  const [algorithm] = useAlgorithm(`
function quickSort(start, end):
    if start < end:
        pivot = partition(start, end)
        quickSort(start, pivot - 1)
        quickSort(pivot + 1, end)
`);

  return (
    <>
      <Typography paragraph>
        <strong>Quick sort</strong> is the speedster of sorting algorithms. It
        picks a <strong>pivot</strong> element and then arranges the rest of the
        elements into two groups: those less than the pivot and those greater.
        By recursively sorting these groups, Quick sort efficiently sorts even
        the largest datasets. It is perfect blend of strategy and speed, making
        it one of the most popular sorting techniques. However, its performance
        can degrade in{' '}
        <Link href="/articles/quick-sort-illusion">certain cases</Link>, unlike
        the guaranteed O(n log n) of{' '}
        <Link href="/sorting/MergeSort">Merge Sort</Link>.
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
          {algorithm}
          <br />
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
              Quick sort selects a pivot element from the array (commonly the
              last element). It then partitions the remaining elements into two
              sub-arrays — elements less than the pivot go to the left, and
              elements greater go to the right. The algorithm then recursively
              applies the same process to both sub-arrays. The{' '}
              <strong>partition</strong> step is the heart of Quick sort: a
              pointer scans from left to right, swapping elements smaller than
              the pivot to the front. When the scan completes, the pivot is
              swapped into its correct position.
            </Typography>
          </Section>
          <Section variant="h6" title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Quick sort is the go-to algorithm in many standard library
              implementations (including C&apos;s qsort) because of its
              excellent average-case performance and cache efficiency. It is
              preferred when average-case speed matters more than worst-case
              guarantees. However, randomized pivot selection or median-of-three
              strategies can mitigate the worst-case scenario. Quick sort lacks{' '}
              <Link href="/articles/stable-sorting">stability</Link>, making it
              less ideal for multi-level sorting or cases where the original
              sequence of duplicate keys must be maintained.
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
    complexity: 'O(n log n)',
    description:
      'When the pivot consistently divides the array into two roughly equal halves.',
  },
  {
    type: 'Average Case',
    complexity: 'O(n log n)',
    description:
      'Random input distributions tend to produce balanced partitions.',
  },
  {
    type: 'Worst Case',
    complexity: 'O(n²)',
    description:
      'Occurs when the pivot is always the smallest or largest element (e.g. already sorted input with last-element pivot).',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(log n)',
    description: (
      <>
        While Quick sort is{' '}
        <Link href="/articles/inplace-sorting">in-place</Link>, the recursive
        call stack uses O(log n) space on average, or O(n) in the worst case.
      </>
    ),
  },
];
