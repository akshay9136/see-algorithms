import { Box, Divider, Stack, Typography } from '@mui/material';
import { InputNumbers, ComplexityTable, Section } from '@/components/common';
import { useAlgorithm } from '@/hooks';
import { useHeapSort } from '@/hooks/sorting';
import Link from 'next/link';

export default function HeapSort() {
  const { animation, pseudocode, handleSort, handleStop } = useHeapSort();
  const [heapifyAlgo] = useAlgorithm(`
function heapify(i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n:
        if arr[left] > arr[largest]:
            largest = left
    if right < n:
        if arr[right] > arr[largest]:
            largest = right
    if largest != i:
        swap(i, largest)
        heapify(largest)
`);

  return (
    <>
      <Typography paragraph>
        <strong>Heap Sort</strong> is an efficient sorting algorithm that
        leverages a data structure called{' '}
        <Link href="/data-structures/BinaryHeap">Binary Heap</Link> to organize
        and sort data. It works by first building a heap from the data and then
        repeatedly extracting the largest (or smallest) element from the heap
        and rebuilding the heap until all elements are sorted. This method is
        known for its reliable performance and in-place sorting capabilities,
        making it a strong choice for handling large datasets without requiring
        extra memory.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          {heapifyAlgo}
        </Stack>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Visualizer
          </Typography>
          {pseudocode}
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
              Heap Sort operates in two main phases. First, it transforms the
              input array into a Max Heap — a complete binary tree where every
              parent node is greater than or equal to its children. This is done
              by calling a &quot;heapify&quot; procedure on each non-leaf node,
              starting from the bottom of the tree and moving upward. Once the
              Max Heap is built, the largest element is guaranteed to be at the
              root. The algorithm then swaps the root with the last element of
              the heap, reduces the heap size by one, and calls heapify on the
              new root to restore the heap property. This process repeats until
              only one element remains, producing a fully sorted array.
            </Typography>
          </Section>
          <Section title="When to Use" variant="h6" sx={{ mb: 0 }}>
            <Typography>
              Heap Sort is ideal when you need guaranteed O(n log n) worst-case
              performance with O(1) extra space — a combination that neither{' '}
              <strong>Quick Sort</strong> (O(n²) worst case) nor{' '}
              <strong>Merge Sort</strong> (O(n) extra space) can offer. It is
              commonly used in systems with strict memory constraints. However,
              Heap Sort is not{' '}
              <Link href="/articles/stable-sorting">stable</Link> and tends to
              have worse cache performance than Quick Sort due to its
              non-sequential memory access patterns.
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
      'Heap Sort always builds the heap and extracts elements, regardless of input order.',
  },
  {
    type: 'Average Case',
    complexity: 'O(n log n)',
    description:
      'The heap operations are consistent across all input distributions.',
  },
  {
    type: 'Worst Case',
    complexity: 'O(n log n)',
    description: (
      <>
        Like <Link href="/sorting/MergeSort">Merge Sort</Link>, Heap Sort
        guarantees O(n log n) performance in all cases.
      </>
    ),
  },
  {
    type: 'Space Complexity',
    complexity: 'O(1)',
    description: (
      <>
        Heap Sort is an <Link href="/articles/inplace-sorting">in-place</Link>{' '}
        algorithm — it sorts within the original array using only a constant
        amount of extra memory.
      </>
    ),
  },
];
