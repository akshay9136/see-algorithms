import { InputNumbers } from '@/components/common';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import {
    useBubbleSort,
    useHeapSort,
    useInsertionSort,
    useMergeSort,
    useQuickSort,
    useRadixSort,
    useSelectionSort,
} from '@/hooks/sorting';

export default function SortingEmbed() {
    const router = useRouter();
    const { algorithm } = router.query;

    const hooks = {
        BubbleSort: useBubbleSort,
        HeapSort: useHeapSort,
        SelectionSort: useSelectionSort,
        InsertionSort: useInsertionSort,
        MergeSort: useMergeSort,
        QuickSort: useQuickSort,
        RadixSort: useRadixSort,
    };

    const useHook = hooks[algorithm];

    if (!useHook) {
        return <div>Algorithm not found</div>;
    }

    return <Visualizer useHook={useHook} />;
}

function Visualizer({ useHook }) {
    const { animation, handleSort, handleStop } = useHook();

    return (
        <Stack spacing={3} position="relative">
            <InputNumbers onStart={handleSort} onReset={handleStop} />
            {animation}
            <a
                href="https://see-algorithms.com"
                target="_blank"
                rel="noopener noreferrer"
                className="watermark"
            >
                See Algorithms
            </a>
        </Stack>
    );
}
