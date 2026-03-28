import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers } from '@/components/common';
import { useBubbleSort } from '@/hooks/sorting';

export default function BubbleSort() {
    const { animation, pseudocode, handleSort, handleStop } = useBubbleSort();

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Bubble Sort</strong> is a simple sorting algorithm that
                works by repeatedly swapping adjacent elements if they are in
                the wrong order. This process continues until the list is fully
                sorted. While it’s easy to understand, Bubble Sort is not very
                efficient for large datasets due to its quadratic time
                complexity. It’s often used for educational purposes or as a
                baseline for comparison with other sorting algorithms.
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
                    <strong>Bubbling Up:</strong> In each pass through the list,
                    notice how the largest unsorted element gradually{' '}
                    {'"bubbles up"'} to its correct position at the end of the
                    array. This is why the sorted portion of the array grows
                    from right to left.
                </li>
                <li>
                    <strong>Early Termination:</strong> If a full pass is
                    completed with no swaps, the algorithm knows the list is
                    already sorted and stops early. Try a nearly-sorted list to
                    see this in action!
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Pseudocode
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                {pseudocode}
                <Stack spacing={3}>
                    <InputNumbers onStart={handleSort} onReset={handleStop} />
                    {animation}
                </Stack>
            </Box>
        </Stack>
    );
}
