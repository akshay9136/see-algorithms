import { Box, Divider, Stack, Typography } from '@mui/material';
import { InputNumbers, ComplexityTable, Section } from '@/components/common';
import { useSelectionSort } from '@/hooks/sorting';
import Link from 'next/link';

export default function SelectionSort() {
  const { animation, pseudocode, handleSort, handleStop } = useSelectionSort();

  return (
    <>
      <Typography paragraph>
        <strong>Selection Sort</strong> is another comparison-based algorithm
        that sorts an array by repeatedly finding the minimum element from the
        unsorted part and moving it to its correct position. It minimizes the
        number of swaps needed compared to{' '}
        <Link href="/sorting/BubbleSort">Bubble Sort</Link>, which makes it
        useful when the cost of moving items is high, but finding the smallest
        item is easy.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          {pseudocode}
        </Stack>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Visualizer
          </Typography>
          <InputNumbers onStart={handleSort} onReset={handleStop} />
          <br />
          {animation}
        </Stack>
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section title="How It Works" variant="h6">
            <Typography paragraph>
              Selection Sort divides the array into two logical parts: a sorted
              region at the beginning and an unsorted region at the end. In each
              iteration, the algorithm scans the entire unsorted region to find
              the smallest element. Once found, that element is swapped with the
              first element of the unsorted region, effectively expanding the
              sorted region by one. This process repeats until the entire array
              is sorted. Unlike Bubble Sort, which may perform multiple swaps
              per pass, Selection Sort performs a single swap only after finding
              the final minimum for that pass.
            </Typography>
          </Section>
          <Section title="When to Use" variant="h6" sx={{ mb: 0 }}>
            <Typography>
              Selection Sort is best suited for small arrays or situations where
              memory writes are significantly more expensive than reads (such as
              writing to flash memory). Due to its quadratic time complexity,
              Selection Sort is impractical for large datasets. More advanced
              divide-and-conquer algorithms are generally the industry standard
              for efficiency.
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>
    </>
  );
}

const complexityData = [
  {
    type: 'Best Case',
    complexity: 'O(n²)',
    description:
      'Even if the array is already sorted, Selection Sort still scans the entire unsorted portion in each pass to confirm the minimum.',
  },
  {
    type: 'Average Case',
    complexity: 'O(n²)',
    description: (
      <>
        The number of comparisons is always <code>n(n-1)/2</code> regardless of
        input order.
      </>
    ),
  },
  {
    type: 'Worst Case',
    complexity: 'O(n²)',
    description:
      'Same as average case — the algorithm always performs the same number of comparisons.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(1)',
    description: (
      <>
        Selection Sort is an{' '}
        <Link href="/articles/inplace-sorting">in-place</Link> algorithm
        requiring only a constant amount of extra memory for the swap variable.
      </>
    ),
  },
];
