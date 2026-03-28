import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers } from '@/components/common';
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
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Heap Sort</strong> is an efficient sorting algorithm
                that leverages a data structure called{' '}
                <Link href="/data-structures/BinaryHeap">Binary Heap</Link> to
                organize and sort data. It works by first building a heap from
                the data and then repeatedly extracting the largest (or
                smallest) element from the heap and rebuilding the heap until
                all elements are sorted. This method is known for its reliable
                performance and in-place sorting capabilities, making it a
                strong choice for handling large datasets without requiring
                extra memory.
            </Typography>
            <Typography variant="h6" component="h2">
                Things to Observe
            </Typography>
            <Typography
                component="ul"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <li>
                    <strong>Building the Heap:</strong> The first phase of the
                    algorithm rearranges the array into a Max Heap, where the
                    element at the root of any sub-tree is the largest.
                </li>
                <li>
                    <strong>Extracting the Max:</strong> In the second phase,
                    watch how the largest element (at the root) is repeatedly
                    swapped with the last element of the heap, and the heap is
                    rebuilt. This process gradually builds the sorted array from
                    the end.
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Pseudocode
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {heapifyAlgo}
                <Stack spacing={3}>
                    {pseudocode}
                    <InputNumbers onStart={handleSort} onReset={handleStop} />
                    {animation}
                </Stack>
            </Box>
        </Stack>
    );
}
