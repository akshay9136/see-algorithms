import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers } from '@/components/common';
import { useInsertionSort } from '@/hooks/sorting';

export default function InsertionSort() {
    const { animation, pseudocode, handleSort, handleStop } = useInsertionSort();

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Insertion Sort</strong> is a simple, comparison-based
                sorting algorithm that builds the final sorted array one element
                at a time. It takes each element from the unsorted part and
                slides it into its correct position in the sorted part. It is
                like placing a new card in the right spot of a sorted hand,
                making it intuitive and efficient for small dataset, especially
                for partially sorted lists.
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
                    <strong>Inserting into Place:</strong> Watch how each
                    element is picked from the unsorted part and slides into its
                    correct position in the sorted part on the left.
                </li>
                <li>
                    <strong>Adaptive Performance:</strong> Try visualizing a
                    nearly sorted list. You&apos;ll notice Insertion Sort runs
                    much faster because it only has to shift a few elements for
                    each insertion. This makes it very efficient for lists that
                    are already mostly sorted.
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
