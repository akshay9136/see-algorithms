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
        <strong>Quick Sort</strong> is the speedster of sorting algorithms. It
        picks a {'"pivot"'} element and then arranges the rest of the elements
        into two groups: those less than the pivot and those greater. By
        recursively sorting these groups, Quick Sort efficiently sorts even the
        largest datasets. It is a perfect blend of strategy and speed, making it
        one of the most popular sorting techniques. However, its performance can
        degrade in{' '}
        <Link href="/articles/quick-sort-illusion">certain cases</Link>, unlike
        the guaranteed O(n log n) of{' '}
        <Link href="/sorting/MergeSort">Merge Sort</Link>.
      </Typography>
      <Typography paragraph>
        This visualization uses the <strong>Hoare partition</strong> scheme with
        two converging pointers starting from opposite ends. The left pointer
        moves right until it finds an element larger than the pivot, while the
        right pointer moves left until it finds a smaller element. When both
        find misplaced elements, they swap them and continue until the pointers
        cross.
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
          <Section title="How It Works">
            <Typography paragraph>
              Quick sort selects a pivot element from the array (commonly the
              last element). It then partitions the remaining elements into two
              sub-arrays — elements less than the pivot go to the left, and
              elements greater go to the right. Once partitioning is complete,
              the array is divided into two distinct sub-arrays. Quick Sort then
              recursively calls itself on both sub-arrays, repeating the pivot
              selection and pointer partitioning steps until each sub-array
              shrinks to a single element or becomes empty, resulting in a fully
              sorted array.
            </Typography>
          </Section>
          <Section variant="h6" title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Quick sort is the go-to algorithm in many standard library
              implementations (including C&apos;s qsort) because of its
              excellent average-case performance and cache efficiency. It is
              preferred when average-case speed matters more than worst-case
              guarantees. However, randomized pivot selection or median-of-three
              strategies can mitigate the worst-case scenario.
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
