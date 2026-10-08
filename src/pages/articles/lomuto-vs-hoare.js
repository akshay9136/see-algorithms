import { Article, Section } from '@/components/common';
import { Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function LomutoVsHoare() {
  return (
    <Article
      title="Lomuto vs Hoare Partitioning"
      summary="Quicksort's performance lives in its partition scheme. Lomuto offers simplicity and clarity, while Hoare provides efficiency and resilience against duplicates."
    >
      <Section title="The Heart of Quicksort">
        <Typography paragraph>
          Every time <Link href="/sorting/QuickSort">Quicksort</Link> runs, it
          relies on a subroutine called <strong>partitioning</strong>. This step
          chooses a pivot and rearranges the array so that smaller elements fall
          to the left, and larger elements to the right.
        </Typography>

        <Typography paragraph>
          How we partition dictates the algorithm&apos;s efficiency. The two
          most common strategies are <strong>Lomuto</strong> and{' '}
          <strong>Hoare</strong> partitioning. They achieve the same goal, but
          their paths are very different.
        </Typography>
      </Section>

      <Section title="Lomuto Partitioning">
        <Typography paragraph>
          Lomuto partitioning is the standard textbook approach. It is favored
          for its simplicity and brevity.
        </Typography>

        <Typography paragraph>
          It chooses the last element as the pivot and uses two pointers moving
          in the same direction from left to right. One pointer scans forward,
          while the other tracks the boundary of elements smaller than or equal
          to the pivot. Whenever a smaller element is found, it is swapped into
          the boundary region.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`function partition(low, high):
    pivot = arr[high]
    i = low - 1

    for j = low to high - 1:
        if arr[j] <= pivot:
            i = i + 1
            swap(i, j)

    swap(i + 1, high)
    return i + 1`}
          </pre>
        </Paper>
      </Section>

      <Section title="Hoare Partitioning">
        <Typography paragraph>
          Introduced by Tony Hoare in his original Quicksort design, this scheme
          uses two converging pointers starting from opposite ends of the array.
        </Typography>

        <Typography paragraph>
          The left pointer advances until it finds an element larger than or
          equal to the pivot. The right pointer advances backwards until it
          finds an element smaller than or equal to the pivot. When both
          pointers stop, their elements are swapped, and the pointers continue
          inward until they cross.
        </Typography>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`function partition(low, high):
    pivot = arr[low]
    i = low - 1, j = high + 1

    while true:
        do i = i + 1 while arr[i] < pivot
        do j = j - 1 while arr[j] > pivot
        if i >= j: return j
        swap(i, j)
`}
          </pre>
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Key Differences">
        <Typography paragraph>
          While both schemes partition an array in O(n) time, their practical
          characteristics diverge in three major ways:
        </Typography>

        <Typography component="ul" sx={{ '& li': { mb: 2 }, pl: 2 }}>
          <li>
            <strong>Fewer Swaps in Practice:</strong> Lomuto swaps on almost
            every element smaller than the pivot, even if it is already in the
            left partition. Hoare only swaps when both ends have misplaced
            elements, resulting in roughly three times fewer swaps on average.
          </li>
          <li>
            <strong>Handling Duplicate Keys:</strong> On arrays where all
            elements are equal, Lomuto puts every element into one partition,
            causing the recursion to degrade to O(n²). Hoare stops both pointers
            on equal elements and swaps them inward, naturally keeping the
            partitions balanced in O(n log n).
          </li>
          <li>
            <strong>Implementation Clarity:</strong> Lomuto has fewer edge cases
            and is easier to teach and implement without bugs. Hoare has subtler
            boundary conditions and requires careful handling of recursion
            limits to avoid infinite loops.
          </li>
        </Typography>
      </Section>

      <Section title="Practical Perspective">
        <Typography paragraph>
          Lomuto is ideal for conceptual clarity and learning. It is also the
          standard basis for selection algorithms like Quickselect, where
          placing the pivot into its final position simplifies indexing.
        </Typography>

        <Typography paragraph>
          Hoare is the workhorse behind production libraries. Its reduced swap
          overhead and natural resilience to repeated values make it
          significantly faster on real-world hardware.
        </Typography>

        <Typography paragraph>
          Understanding both helps you see the balance between simplicity and
          raw efficiency.
        </Typography>
      </Section>
    </Article>
  );
}
