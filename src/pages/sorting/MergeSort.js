import { Box, Divider, Stack, Typography } from '@mui/material';
import { InputNumbers, ComplexityTable, Section } from '@/components/common';
import { useMergeSort } from '@/hooks/sorting';
import Link from 'next/link';

export default function MergeSort() {
  const { animation, pseudocode, handleSort, handleStop } = useMergeSort();

  return (
    <>
      <Typography paragraph>
        <strong>Merge Sort</strong> is a classic divide-and-conquer algorithm
        that recursively splits an unsorted list into smaller sublists until
        each contains a single element. These sublists are then merged back
        together in sorted order. With a guaranteed time complexity of O(n log
        n), Merge Sort provides predictable performance and{' '}
        <Link href="/articles/stable-sorting">stability</Link>.
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
          <Section title="How It Works">
            <Typography paragraph>
              Merge Sort begins by dividing the input array in half, then
              recursively divides each half until every sub-array contains just
              one element (which is trivially sorted). The &quot;conquer&quot;
              phase then merges pairs of sorted sub-arrays back together. During
              each merge operation, two sorted sub-arrays are{' '}
              <strong>combined</strong> by comparing their elements one at a
              time: the smaller element is placed first into a temporary array.
              The temporary array then overwrites the corresponding section of
              the original array. This bottom-up merging continues until the
              entire array is reconstructed in sorted order.
            </Typography>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Merge Sort is the preferred choice when a guaranteed O(n log n)
              worst-case performance is required, or when stability is
              important. It is commonly used for sorting linked lists (where its
              O(n) space overhead does not apply) and for external sorting when
              data is too large to fit in memory. Python&apos;s built-in Timsort
              algorithm is a hybrid of Merge Sort and Insertion Sort, combining
              the best properties of both approaches.
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
      'Merge Sort always divides and merges, regardless of the initial order of elements.',
  },
  {
    type: 'Average Case',
    complexity: 'O(n log n)',
    description:
      'The divide-and-merge process is consistent across all inputs.',
  },
  {
    type: 'Worst Case',
    complexity: 'O(n log n)',
    description: (
      <>
        Unlike <Link href="/sorting/QuickSort">Quick Sort</Link>, Merge Sort
        guarantees O(n log n) even in the worst case.
      </>
    ),
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description: (
      <>
        Merge Sort requires additional memory for the temporary arrays used
        during merging, making it not{' '}
        <Link href="/articles/inplace-sorting">in-place</Link>.
      </>
    ),
  },
];
