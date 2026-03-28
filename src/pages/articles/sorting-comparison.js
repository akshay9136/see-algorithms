import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { InputNumbers } from '@/components/common';
import {
  useBubbleSort,
  useSelectionSort,
  useInsertionSort,
  useMergeSort,
  useQuickSort,
  useHeapSort,
} from '@/hooks/sorting';

const ALGORITHMS = [
  { id: 'BubbleSort', name: 'Bubble Sort' },
  { id: 'InsertionSort', name: 'Insertion Sort' },
  { id: 'SelectionSort', name: 'Selection Sort' },
  { id: 'QuickSort', name: 'Quick Sort' },
  { id: 'HeapSort', name: 'Heap Sort' },
  { id: 'MergeSort', name: 'Merge Sort' },
];

export default function SortingComparison() {
  const [selected, setSelected] = useState(['BubbleSort', 'InsertionSort']);

  const hooks = {
    BubbleSort: useBubbleSort(),
    SelectionSort: useSelectionSort(),
    InsertionSort: useInsertionSort(),
    MergeSort: useMergeSort(),
    QuickSort: useQuickSort(),
    HeapSort: useHeapSort(),
  };

  const startHandlers = selected.map((id) => hooks[id].handleSort);
  const resetHandlers = selected.map((id) => hooks[id].handleStop);

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const sound1 = document.getElementById('popSound');
    const sound2 = document.getElementById('swapSound');
    sound1.muted = true;
    sound2.muted = true;
    return () => {
      sound1.muted = false;
      sound2.muted = false;
    };
  }, []);

  return (
    <Stack spacing={3}>
      <Typography
        variant="h5"
        component="h1"
        fontWeight={600}
        color="warning.main"
      >
        Compare Sorting Algorithms
      </Typography>

      <Typography variant="body1">
        Select multiple algorithms below to compare their execution in
        real-time. Watch how different approaches sort the exact same list of
        numbers simultaneously. Please note that the animation speed is adjusted
        for visual clarity and does not represent the actual performance or
        efficiency of the algorithms.
      </Typography>

      <FormGroup row>
        {ALGORITHMS.map((algo) => (
          <FormControlLabel
            key={algo.id}
            label={algo.name}
            control={
              <Checkbox
                checked={selected.includes(algo.id)}
                onChange={() => handleToggle(algo.id)}
                disabled={selected.length === 1 && selected.includes(algo.id)}
              />
            }
          />
        ))}
      </FormGroup>

      <InputNumbers
        startHandlers={startHandlers}
        resetHandlers={resetHandlers}
      />
      <br />
      <Box display="flex" flexWrap="wrap" gap={3}>
        {selected.map((id) => (
          <Box
            key={id}
            minWidth={600}
            padding={2}
            border="1px solid #e0e0e0"
            borderRadius={2}
          >
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
              {ALGORITHMS.find((a) => a.id === id).name}
            </Typography>

            {hooks[id].animation}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
