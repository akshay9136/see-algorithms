import { Container, Typography, Box, Divider } from '@mui/material';

export default function InplaceSorting() {
  return (
    <Container maxWidth="md" sx={{ p: 0 }} className="article">
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        In-Place Sorting
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Understand how algorithms manage space — and why restraint often leads
        to elegance.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          What Does {'"In-Place"'} Really Mean?
        </Typography>

        <Typography paragraph>
          An in-place sorting algorithm rearranges elements within the original
          data structure without allocating significant additional memory. It
          modifies the input directly instead of creating a separate array to
          store the result.
        </Typography>

        <Typography paragraph>
          In practical terms, this means the algorithm uses only a constant
          amount of extra space — typically a few variables for indexing,
          swapping, or temporary storage.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Why In-Place Matters
        </Typography>

        <Typography paragraph>
          Memory is not infinite. Even when machines grow more powerful, memory
          efficiency remains relevant. Large datasets, embedded systems, and
          performance-critical applications all benefit from algorithms that
          avoid unnecessary allocations.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Classic Examples
        </Typography>

        <Typography paragraph>
          Several foundational algorithms are naturally in-place. Each of these
          algorithms rearranges elements inside the same array. No auxiliary
          array is required for the final result.
        </Typography>

        <Typography component="ul" sx={{ '& li': { mb: 1 } }}>
          <li>
            <strong>Bubble Sort</strong> – Repeatedly swaps adjacent elements.
          </li>
          <li>
            <strong>Insertion Sort</strong> – Shifts elements to insert each
            item into its correct position.
          </li>
          <li>
            <strong>Selection Sort</strong> – Selects the minimum element and
            swaps it into place.
          </li>
          <li>
            <strong>Heap Sort</strong> – Uses the array itself to represent the
            heap structure.
          </li>
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          When Sorting Is Not In-Place
        </Typography>

        <Typography paragraph>
          Not all sorting algorithms follow this principle. For example,{' '}
          <strong>Merge Sort</strong> traditionally uses an additional array to
          merge sorted halves. That extra storage makes it not strictly in-place
          in its common implementation.
        </Typography>

        <Typography paragraph>
          Similarly, functional programming approaches often create new arrays
          instead of mutating the original. This improves clarity and
          immutability but increases space usage.
        </Typography>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Trade-offs and Nuances
        </Typography>

        <Typography paragraph>
          In-place does not automatically mean optimal. Some in-place algorithms
          have poor performance characteristics. For instance, bubble sort is
          in-place but inefficient for large datasets.
        </Typography>

        <Typography paragraph>
          Additionally, certain in-place algorithms rely heavily on swaps, which
          can be expensive for large objects. In some contexts, allocating
          temporary storage and reducing swaps may actually improve performance.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Final Reflection
        </Typography>

        <Typography paragraph>
          For beginners who already understand basic sorting techniques,
          mastering the concept of “in-place” deepens algorithmic maturity. It
          shifts focus from simply getting a sorted result to understanding how
          that result is achieved.
        </Typography>

        <Typography paragraph>
          And in computer science — as in life — how we achieve something often
          matters more than the result itself.
        </Typography>
      </Box>
    </Container>
  );
}
