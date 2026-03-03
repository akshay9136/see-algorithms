import { Article, Section } from '@/components/common';
import { Paper, Typography } from '@mui/material';

export default function StableSorting() {
  return (
    <Article
      title="Stable Sorting Algorithms"
      summary="Understand the importance of maintaining original order when sorting data with duplicate keys."
    >
      <Section title='What Does "Stable" Mean?'>
        <Typography variant="body1" paragraph>
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
      </Section>

      <Section title="Why Stability Matters">
        <Typography paragraph>
          In real systems, we rarely sort primitive values. We sort objects —
          users, transactions, logs, records.
        </Typography>

        <Typography paragraph>
          Stability allows sorting to become composable. You can sort by one
          attribute, then another, and rely on predictable behavior. This is not
          convenience — it is structural integrity.
        </Typography>
      </Section>

      <Section title="A Small Illustration">
        <Paper className='algorithm' sx={{ mt: 2 }}>
          <pre>
            {`Input Array:
[ (A, 2), (B, 1), (C, 2) ]

Stable Result:
[ (B, 1), (A, 2), (C, 2) ]

Unstable Result:
[ (B, 1), (C, 2), (A, 2) ]`}
          </pre>
        </Paper>
      </Section>

      <Section title="Which Algorithms Are Stable?">
        <Typography component="ul" sx={{ '& li': { mb: 1 }, my: 2, pl: 2 }}>
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
      </Section>

      <Section title="A Practical Perspective">
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
      </Section>
    </Article>
  );
}
