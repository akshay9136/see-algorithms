import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers } from '@/components/common';
import { useMergeSort } from '@/hooks/sorting';

export default function MergeSort() {
    const { animation, pseudocode, handleSort, handleStop } = useMergeSort();

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Merge Sort</strong> is more advanced, divide-and-conquer
                algorithm that recursively splits an unsorted list into smaller
                sublists until each contains a single element. These sublists
                are then merged back together in a sorted manner. With a time
                complexity of O(n log n), Merge Sort is efficient and stable,
                making it suitable for handling large datasets.
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
                    <strong>Divide Recursively:</strong> Watch how the
                    algorithm first breaks the array down recursively into
                    single-element sub-arrays.
                </li>
                <li>
                    <strong>Conquer (Merge):</strong> These sub-arrays are
                    then merged back together in sorted order. This merging
                    step is where the core sorting logic happens, comparing
                    elements from the sub-arrays and placing them into a
                    temporary array before updating the main one.
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Pseudocode
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {pseudocode}
                <Stack spacing={3}>
                    <InputNumbers onStart={handleSort} onReset={handleStop} />
                    {animation}
                </Stack>
            </Box>
        </Stack>
    );
}
