import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedDataList } from '@/components/common';
import { useAlgorithm, useSavedData } from '@/hooks';
import useMaxHeap from '@/hooks/data-structures/useMaxHeap';
import Link from 'next/link';

export default function BinaryHeap(props) {
  const { saveData, ...rest } = useSavedData();
  const { animation, buttons, summary, refresh } = useMaxHeap({ saveData });

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

  return (
    <>
      <Typography paragraph>
        A <strong>Binary Heap</strong> is a complete binary tree (typically
        stored in an array), where each node satisfies the heap property: in a
        max-heap, parents are greater than or equal to their children, while in
        a min-heap, they are less than or equal.{' '}
        <Link href="/sorting/HeapSort">Heap Sort</Link> utilizes this structure
        by building a <strong>max-heap</strong> and repeatedly extracting the
        root element to the end of the array, resulting in an efficient O(n log
        n) sorting algorithm. Beyond sorting, heaps are widely used to implement
        priority queues.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          {insertAlgo}
        </Stack>
        <Stack spacing={2}>
          <DSInput {...props} buttons={buttons} />
          {animation}
          <br />
          {summary}
        </Stack>
      </Box>
      <SavedDataList onSelect={refresh} {...rest} />
    </>
  );
}
