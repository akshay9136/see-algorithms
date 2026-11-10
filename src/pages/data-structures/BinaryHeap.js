import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  AdUnit,
  ComplexityTable,
  DSInput,
  SavedDataList,
  Section,
} from '@/components/common';
import { useAlgorithm, useBreakpoints, useSavedData } from '@/hooks';
import { useMaxHeap } from '@/hooks/data-structures';
import Link from 'next/link';

export default function BinaryHeap(props) {
  const { saveData, ...saveDataProps } = useSavedData();
  const { animation, buttons, summary, refresh } = useMaxHeap({ saveData });
  const { xlup } = useBreakpoints();

  const [insertAlgo] = useAlgorithm(`
function insert(value):
    arr[n] = value
    i = n, n = n + 1
    while i > 0:
        parent = (i - 1) / 2
        if arr[parent] >= arr[i]:
            break
        swap(parent, i)
        i = parent
`);

  const [extractAlgo] = useAlgorithm(`
function extract():
    if n == 0: return null
    max = arr[0]
    arr[0] = arr[n - 1]
    n = n - 1
    heapifyDown(0)
    return max
`);

  return (
    <>
      <Typography paragraph>
        A <strong>Binary Heap</strong> is a complete binary tree (typically
        stored in an array), where each node satisfies the heap property: in a{' '}
        <strong>Max-Heap</strong>, parents are greater than or equal to their
        children, while in a <strong>Min-Heap</strong>, parents are less than or
        equal to their children. <Link href="/sorting/HeapSort">Heap Sort</Link>{' '}
        utilizes this structure by building a Max-Heap and repeatedly extracting
        the root element to the end of the array, resulting in an efficient O(n
        log n) in-place sorting algorithm.
      </Typography>
      <Typography paragraph>
        Because a binary heap is a{' '}
        <Link href="/articles/heap-index-math">complete binary tree</Link> (all
        levels are completely filled except possibly the lowest, which is filled
        from left to right), it requires no pointers and is compactly packed in
        an array. Beyond sorting, binary heaps are the canonical data structure
        for implementing high-performance priority queues.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          <Stack
            direction={{ xs: 'row', lg: 'column' }}
            spacing={3}
            alignItems="start"
          >
            {insertAlgo}
            {extractAlgo}
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Visualizer
          </Typography>
          <DSInput {...props} buttons={buttons} />
          {animation}
          <br />
          {summary}
        </Stack>
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section title="How It Works">
            <Typography paragraph>
              During <strong>insertion</strong>, the new value is appended to
              the end of the array (the next open leaf). It is then repeatedly
              swapped with its parent <strong>(heapify-up)</strong> as long as
              it is strictly greater than the parent (in a Max-Heap). This
              bubbling-up takes at most O(log n) steps, bounded by tree height.
            </Typography>
            <Typography paragraph>
              During <strong>extraction</strong>, the root element (the maximum)
              is removed. The last element in the array is moved to the root to
              preserve the complete tree shape, and is then sifted down{' '}
              <strong>(heapify-down)</strong> by swapping with its largest child
              until the heap invariant is restored.
            </Typography>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Binary Heaps are the industry standard for implementing{' '}
              <strong>Priority Queues</strong>, where rapid retrieval of the
              highest (or lowest) priority item is essential. They power greedy
              graph algorithms like{' '}
              <Link href="/graph/Dijkstras">Dijkstra&apos;s</Link> shortest path
              and <Link href="/graph/Prims">Prim&apos;s</Link> minimum spanning
              tree. Operating system kernels rely on heaps for timer wheels and
              process scheduling, and stream-processing engines use paired
              min/max heaps to track running medians in real time.
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>

      <SavedDataList onSelect={refresh} {...saveDataProps} />
    </>
  );
}

const complexityData = [
  {
    type: 'Insertion',
    complexity: 'O(log n)',
    description:
      'Appends to the array end and bubbles upward (heapify-up) across at most log₂ n levels.',
  },
  {
    type: 'Extract Max/Min',
    complexity: 'O(log n)',
    description:
      'Replaces the root with the last element and sifts downward (heapify-down) across at most log₂ n levels.',
  },
  {
    type: 'Build Heap',
    complexity: 'O(n)',
    description:
      'Floyd’s bottom-up construction builds a heap in linear time by sifting down non-leaf nodes.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description:
      'Stored in a contiguous array without pointer overhead, requiring O(1) auxiliary space.',
  },
];
