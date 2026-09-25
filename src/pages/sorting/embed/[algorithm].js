import InputNumbers from '@/components/common/input-numbers';
import Box from '@mui/material/Box';
import { SITE_URL } from '@/utils/constants';
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
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      position="relative"
    >
      <InputNumbers onStart={handleSort} onReset={handleStop} />
      {animation}
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Box>
  );
}
