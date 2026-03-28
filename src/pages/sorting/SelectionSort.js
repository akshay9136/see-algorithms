import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers } from '@/components/common';
import { useSelectionSort } from '@/hooks/sorting';
import Link from 'next/link';

export default function SelectionSort() {
    const { animation, pseudocode, handleSort, handleStop } = useSelectionSort();

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Selection Sort</strong> is another comparison-based
                algorithm that sorts an array by repeatedly finding the minimum
                element from the unsorted part and moving it to its correct
                position. It minimizes the number of swaps needed compared to{' '}
                <Link href="/sorting/BubbleSort">Bubble Sort</Link>, which makes
                it useful when the cost of moving items is high, but finding the
                smallest item is easy.
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
                    <strong>Finding the Minimum:</strong> In each pass, watch
                    how the algorithm scans the entire unsorted portion of the
                    array to find the single smallest element.
                </li>
                <li>
                    <strong>One Swap Per Pass:</strong> Notice that there is
                    only one swap at the very end of each pass. This is a key
                    difference from Bubble Sort and is the reason why Selection
                    Sort is preferred when write operations are expensive.
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
