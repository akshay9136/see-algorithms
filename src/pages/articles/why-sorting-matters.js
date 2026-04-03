import { Article, Section } from '@/components/common';
import { Typography } from '@mui/material';

export default function WhySortingMatters() {
  return (
    <Article
      title="Why Sorting is Important"
      summary="Understanding why sorting matters is more important than memorizing how sorting works."
    >
      <Section title="Order Brings Clarity">
        <Typography variant="body1" paragraph>
          Sorting is fundamentally about creating order. In computer science,
          disorder is expensive. When data is unstructured, every operation
          becomes harder. Searching takes longer. Comparisons become
          inefficient. Patterns remain hidden.
        </Typography>

        <Typography variant="body1" paragraph>
          When data is sorted, structure emerges. The system becomes
          predictable. And predictability is the foundation of efficient
          algorithms.
        </Typography>
      </Section>

      <Section title="Faster Searching">
        <Typography variant="body1" paragraph>
          One of the strongest reasons sorting is important is that it enables
          faster searching. A sorted list allows algorithms to eliminate large
          portions of data instantly.
        </Typography>

        <Typography variant="body1" paragraph>
          For example, binary search only works on sorted data. Instead of
          checking every element one by one, it repeatedly divides the search
          space in half. That shift from linear scanning to intelligent
          elimination changes the scale of performance entirely.
        </Typography>

        <Typography variant="body1" paragraph>
          Sorting is often a one-time cost that enables faster operations
          forever after.
        </Typography>
      </Section>

      <Section title="Efficient Data Processing">
        <Typography variant="body1" paragraph>
          Modern systems process enormous volumes of data — logs, transactions,
          analytics, search indexes. Sorting enables efficient grouping,
          filtering, and aggregation.
        </Typography>

        <Typography variant="body1" paragraph>
          Databases internally rely on sorted structures like B-trees and
          indexes. Even if you never manually call a sorting function, the
          systems you use are constantly organizing data behind the scenes.
        </Typography>
      </Section>

      <Section title="Teaches Algorithmic Thinking">
        <Typography variant="body1" paragraph>
          Sorting algorithms are often the first algorithms students study. This
          is not accidental. They teach fundamental ideas: comparison, swapping,
          recursion, divide-and-conquer, and incremental improvement.
        </Typography>

        <Typography variant="body1">
          When you study sorting, you are not just learning how to arrange
          numbers. You are learning how to reason about efficiency, trade-offs,
          and problem decomposition.
        </Typography>
      </Section>

      <Section title="Real-World Applications">
        <Typography variant="body1" paragraph>
          Sorting is everywhere — search engines ranking results, e-commerce
          platforms ordering products by price, operating systems scheduling
          tasks, and analytics tools organizing metrics.
        </Typography>

        <Typography variant="body1" paragraph>
          Many advanced algorithms assume sorted input. Whether it is merging
          datasets, detecting duplicates, computing medians, or solving
          interval-based problems, sorted data simplifies logic.
        </Typography>
      </Section>

      <Section title="The Deeper Lesson">
        <Typography variant="body1" paragraph>
          Sorting is important because it transforms chaos into order. It
          represents a deeper idea in computer science: structure reduces
          effort. When data is structured, algorithms become simpler. When
          algorithms become simpler, systems become reliable. And when systems
          are reliable, scale becomes possible.
        </Typography>
      </Section>
    </Article>
  );
}
