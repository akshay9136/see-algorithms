import { Container, Typography, Box, Divider, Paper } from '@mui/material';

export default function StableSorting() {
  return (
    <Container maxWidth="md" sx={{ p: 0 }} className="article">
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Stable Sorting
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Understand the importance of maintaining original order when sorting
        data with duplicate keys.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          What Does &quot;Stable&quot; Mean?
        </Typography>

        <Typography paragraph>
          A sorting algorithm is <strong>stable</strong> if it preserves the
          relative order of elements that compare equal.
        </Typography>

        <Typography paragraph>
          Suppose two elements have the same key. If one appears before the
          other in the input, a stable sort guarantees that this order remains
          unchanged in the output. Stability is not visible when elements are
          simple numbers. It becomes meaningful when elements carry identity
          beyond their sorting key.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Why Stability Matters
        </Typography>

        <Typography paragraph>
          In real systems, we rarely sort primitive values. We sort objects —
          users, transactions, logs, records.
        </Typography>

        <Typography paragraph>
          Stability allows sorting to become composable. You can sort by one
          attribute, then another, and rely on predictable behavior. This is not
          convenience — it is structural integrity.
        </Typography>
      </Box>

      <Paper
        sx={{ px: 3, py: 2, bgcolor: 'grey.100', mb: 4, width: 'fit-content' }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          A Small Illustration
        </Typography>

        <Typography variant="body1" component="pre">
          {`Input:
[ (A, 2), (B, 1), (C, 2) ]

Stable Result:
[ (B, 1), (A, 2), (C, 2) ]

Unstable Result:
[ (B, 1), (C, 2), (A, 2) ]`}
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Which Algorithms Are Stable?
        </Typography>

        <Typography component="ul" sx={{ my: 2, '& li': { mb: 1 } }}>
          <li>
            <strong>Bubble Sort</strong> – Stable
          </li>
          <li>
            <strong>Insertion Sort</strong> – Stable
          </li>
          <li>
            <strong>Selection Sort</strong> – Typically Unstable
          </li>
          <li>
            <strong>Quick Sort</strong> – Typically Unstable
          </li>
          <li>
            <strong>Heap Sort</strong> – Unstable
          </li>
        </Typography>

        <Typography paragraph>
          Notice something subtle: many simple, incremental algorithms are
          naturally stable. Algorithms built around swapping distant elements
          often are not.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          A Practical Perspective
        </Typography>

        <Typography paragraph>
          If you are sorting user-facing data, logs, reports, or layered
          attributes — stability is usually desirable.
        </Typography>

        <Typography paragraph>
          If you are sorting raw numeric data where equal values have no
          identity — stability may not matter.
        </Typography>

        <Typography paragraph>
          Sorting is not merely rearrangement. It is transformation under
          constraints. Stability defines one such constraint — preserving
          meaning while imposing order. And in engineering, preserving meaning
          is often more important than achieving speed.
        </Typography>
      </Box>
    </Container>
  );
}
