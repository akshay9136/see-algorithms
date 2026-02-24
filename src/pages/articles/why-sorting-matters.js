import { Container, Typography, Box, Divider } from '@mui/material';

export default function WhySortingMatters() {
  return (
    <Container maxWidth="md" sx={{ p: 0 }} className="article">
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Why Sorting is Important
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Understanding why sorting matters is more important than memorizing how
        sorting works.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Order Brings Clarity
        </Typography>
        <Typography variant="body1" paragraph>
          Sorting is fundamentally about creating order. In computer science,
          disorder is expensive. When data is unstructured, every operation
          becomes harder. Searching takes longer. Comparisons become
          inefficient. Patterns remain hidden.
        </Typography>
        <Typography variant="body1">
          When data is sorted, structure emerges. The system becomes
          predictable. And predictability is the foundation of efficient
          algorithms.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Faster Searching
        </Typography>
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
        <Typography variant="body1">
          Sorting is often a one-time cost that enables faster operations
          forever after.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Efficient Data Processing
        </Typography>
        <Typography variant="body1" paragraph>
          Modern systems process enormous volumes of data — logs, transactions,
          analytics, search indexes. Sorting enables efficient grouping,
          filtering, and aggregation.
        </Typography>
        <Typography variant="body1">
          Databases internally rely on sorted structures like B-trees and
          indexes. Even if you never manually call a sorting function, the
          systems you use are constantly organizing data behind the scenes.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Teaches Algorithmic Thinking
        </Typography>
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
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Real-World Applications
        </Typography>
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
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          The Deeper Lesson
        </Typography>
        <Typography variant="body1" paragraph>
          Sorting is important because it transforms chaos into order. It
          represents a deeper idea in computer science: structure reduces
          effort. When data is structured, algorithms become simpler. When
          algorithms become simpler, systems become reliable. And when systems
          are reliable, scale becomes possible.
        </Typography>
      </Box>
    </Container>
  );
}
