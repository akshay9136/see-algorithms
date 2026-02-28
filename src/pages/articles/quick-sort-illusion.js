import Article, { Section } from '@/components/article';
import { Divider, Typography } from '@mui/material';
import Link from 'next/link';

export default function QuickSortIllusion() {
  return (
    <Article
      title="When Quicksort Slows Down"
      summary="Speed in algorithms is rarely magic — it is the consequence of structural balance and careful decisions."
    >
      <Section title="The Illusion of Speed">
        <Typography paragraph>
          <Link href="/sorting/QuickSort">Quicksort</Link> is often introduced
          as one of the fastest sorting algorithms in practice.
        </Typography>

        <Typography paragraph>
          But its speed is not guaranteed. Quicksort is fast only when its
          partitions are balanced. When that balance disappears, the algorithm
          quietly loses its strength.
        </Typography>
      </Section>

      <Section title="1. Pivot Selection">
        <Typography paragraph>
          Quicksort works by choosing a pivot and dividing the array into two
          parts. If the pivot splits the array roughly in half, recursion depth
          stays small. Work is distributed evenly. The algorithm moves with
          confidence.
        </Typography>

        <Typography paragraph>
          But if the pivot is consistently the smallest or largest element, one
          partition becomes nearly empty while the other contains almost
          everything. The recursion becomes deep. The work becomes repetitive.
        </Typography>

        <Typography paragraph>
          A careless pivot turns a divide-and-conquer strategy into a slow
          grind.
        </Typography>
      </Section>

      <Section title="2. Already Sorted Data">
        <Typography paragraph>
          Many beginner implementations select the first element or the last
          element as the pivot. On sorted data (ascending or descending), this
          choice guarantees extreme imbalance. The pivot becomes either the
          smallest or the largest element. The recursion depth becomes
          proportional to the size of the array.
        </Typography>

        <Typography paragraph>
          Instead of shallow recursion, we get a long chain of calls. What
          should feel like logarithmic depth becomes linear depth. The total
          work approaches quadratic behavior.
        </Typography>

        <Typography paragraph>
        Ironically, data that looks {'"sorted"'} becomes the worst-case input.
        </Typography>
      </Section>

      <Section title="3. Many Duplicates">
        <Typography paragraph>
          Traditional two-way partitioning struggles when many elements are
          equal to the pivot. The algorithm keeps redistributing equal values
          across recursive calls, creating unnecessary work.
        </Typography>

        <Typography paragraph>
          In such cases, three-way partitioning (less than, equal to, greater
          than) performs significantly better. The structure of the data demands
          a more refined strategy.
        </Typography>
      </Section>

      <Section title="4. Stack Pressure">
        <Typography paragraph>
          Balanced partitioning gives Quicksort its strength. Each recursive
          step significantly reduces the problem size. When partitions are
          highly unbalanced, recursion depth grows. Deep recursion increases
          stack usage and can even lead to stack overflow in extreme cases.
        </Typography>
      </Section>

      <Divider sx={{ my: 4 }} />

      <Section title="Warning Signs">
        <Typography component="ul" sx={{ '& li': { mb: 1 }, my: 2, pl: 2 }}>
          <li>Consistently uneven partition sizes</li>
          <li>Recursion depth approaching input size</li>
          <li>Performance degradation on sorted inputs</li>
          <li>High number of repeated values in data</li>
        </Typography>

        <Typography paragraph>
          These are structural signals telling you that the strategy must adapt.
        </Typography>
      </Section>

      <Section title="The Deeper Lesson">
        <Typography paragraph>
          Quicksort does not lose its speed randomly. It loses it when balance
          is lost. Randomized pivot selection, median-of-three strategies, and
          hybrid approaches like introspective sorting exist for one reason: to
          protect balance.
        </Typography>

        <Typography paragraph>
          Speed is a consequence of structure. And structure comes from
          thoughtful decisions.
        </Typography>
      </Section>
    </Article>
  );
}
