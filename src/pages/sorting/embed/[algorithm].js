import { Box } from '@mui/material';
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

export default function EmbedAlgorithm() {
  const router = useRouter();
  if (!router.isReady) return <div>Loading...</div>;

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

  if (!hooks[algorithm]) {
    return <div>Algorithm not found</div>;
  }

  return <Visualizer useHook={hooks[algorithm]} />;
}

function Visualizer({ useHook }) {
  const { visualizer } = useHook();

  return (
    <Box position="relative">
      {visualizer}
      <a
        href={window.location.href.replace('/embed', '')}
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Box>
  );
}
