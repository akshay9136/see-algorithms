import Article, { Section } from '@/components/article';
import { Typography } from '@mui/material';
import Link from 'next/link';

export default function InplaceSorting() {
  return (
    <Article
      title="In-Place Sorting Algorithms"
      summary="Understand how in-place sorting algorithms minimize extra space while reorganizing data."
    >

      <Section title='What Does "In-Place" Mean?'>
        <Typography variant="body1" paragraph>
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
      </Section>

      <Section title="Why In-Place Matters">
        <Typography paragraph>
          Memory is not infinite. Even when machines grow more powerful, memory
          efficiency remains relevant. Large datasets, embedded systems, and
          performance-critical applications all benefit from algorithms that
          avoid unnecessary allocations.
        </Typography>
      </Section>

      <Section title="Classic Examples">
        <Typography paragraph>
          Several foundational algorithms are naturally in-place. Each of these
          algorithms rearranges elements inside the same array. No auxiliary
          array is required for the final result.
        </Typography>

        <Typography component="ul" sx={{ '& li': { mb: 1 }, pl: 2 }}>
          <li>
            <strong>Bubble Sort</strong>{' '}
            – Repeatedly swaps adjacent elements.
          </li>
          <li>
            <strong>Insertion Sort</strong>{' '}
            – Shifts elements to insert each item into its correct position.
          </li>
          <li>
            <strong>Selection Sort</strong>{' '}
            – Selects the minimum element and swaps it into place.
          </li>
          <li>
            <Link href="/sorting/HeapSort">
              <strong>Heap Sort</strong>
            </Link>{' '}
            – Uses the array itself to represent the heap structure.
          </li>
        </Typography>
      </Section>

      <Section title="When Sorting Is Not In-Place">
        <Typography paragraph>
          Not all sorting algorithms follow this principle. For example,{' '}
          <Link href="/sorting/Merge">Merge Sort</Link> traditionally uses an
          additional array to merge sorted halves. That extra storage makes it
          not strictly in-place in its common implementation.
        </Typography>

        <Typography paragraph>
          Similarly, functional programming approaches often create new arrays
          instead of mutating the original. This improves clarity and
          immutability but increases space usage.
        </Typography>
      </Section>

      <Section title="Trade-offs and Nuances">
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
      </Section>

      <Section title="Final Reflection">
        <Typography paragraph>
          For beginners who already understand basic sorting techniques,
          mastering the concept of {'"in-place"'} deepens algorithmic maturity.
          It shifts focus from simply getting a sorted result to understanding
          how that result is achieved.
        </Typography>

        <Typography paragraph>
          And in computer science — as in life — how we achieve something often
          matters more than the result itself.
        </Typography>
      </Section>
    </Article>
  );
}
