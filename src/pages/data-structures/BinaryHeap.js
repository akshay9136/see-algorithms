import { Box, Divider, Stack, Typography } from '@mui/material';
import DSInput from '@/components/common/ds-input';
import Link from 'next/link';
import useAlgorithm from '@/hooks/useAlgorithm';
import useMaxHeap from '@/hooks/data-structures/useMaxHeap';

export default function BinaryHeap(props) {
    const { animation, buttons, summary } = useMaxHeap();

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
    heapify(0)
    return max
`);

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>Binary Heap</strong> is a complete binary tree
                (typically stored in an array), where each node satisfies the
                heap property: in a max-heap, parents are greater than or equal
                to their children, while in a min-heap, they are less than or
                equal. <Link href="/sorting/HeapSort">Heap Sort</Link> utilizes
                this structure by building a <strong>max-heap</strong> and
                repeatedly extracting the root element to the end of the array,
                resulting in an efficient O(n log n) sorting algorithm. Beyond
                sorting, heaps are widely used to implement priority queues.
            </Typography>
            <Typography variant="h6" component="h2">
                How it Works
            </Typography>
            <Typography
                component="ul"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <li>
                    <strong>Insertion:</strong> The new element is added to the
                    end of the heap and then {'"bubbled up"'} (heapify-up) by
                    repeatedly swapping it with its parent until the heap
                    property is restored.
                </li>
                <li>
                    <strong>Extraction:</strong> The root element is removed and
                    replaced by the last element in the heap. This element is
                    then {'"bubbled down"'} (heapify-down) by swapping it with
                    its children until the heap property is satisfied.
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Pseudocode
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {insertAlgo}
                {extractAlgo}
            </Box>
            <br />
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                <Stack spacing={2}>
                    <DSInput {...props} buttons={buttons} />
                    {animation}
                </Stack>
                <Divider orientation="vertical" flexItem />
                {summary}
            </Box>
        </Stack>
    );
}
