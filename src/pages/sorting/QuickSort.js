import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers } from '@/components/common';
import { useAlgorithm } from '@/hooks';
import { useQuickSort } from '@/hooks/sorting';

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
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Quick Sort</strong> is the speedster of sorting
                algorithms. It picks a <strong>pivot</strong> element and then
                arranges the rest of the elements into two groups: those less
                than the pivot and those greater. By recursively sorting these
                groups, Quick Sort efficiently sorts even the largest datasets.
                It is perfect blend of strategy and speed, making it one of the
                most popular sorting techniques.
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
                    <strong>Pivot and Partition:</strong> In each step,
                    notice how a {'"pivot"'} element is chosen (in this
                    visualization, it&apos;s the last element of the
                    segment) and the other elements are partitioned into two
                    groups: those smaller and those larger than the pivot.
                </li>
                <li>
                    <strong>Divide and Conquer:</strong> Watch how the
                    algorithm recursively breaks the array down into smaller
                    sub-arrays around the pivots, sorting each one
                    independently.
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Pseudocode
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {pseudocode}
                <Stack spacing={3}>
                    {algorithm}
                    <InputNumbers onStart={handleSort} onReset={handleStop} />
                    {animation}
                </Stack>
            </Box>
        </Stack>
    );
}
