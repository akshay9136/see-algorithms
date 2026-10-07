import { Article, ListItems, Section } from '@/components/common';
import { Box, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function HeapIndexMath() {
  return (
    <Article
      title="Complete Binary Trees in Flat Arrays"
      summary="Discover how complete binary trees map directly into flat arrays — eliminating pointer overhead, maximizing CPU cache locality, and simplifying heap traversal."
    >
      <Section title="The Problem with Pointers">
        <Typography paragraph>
          Traditional{' '}
          <Link href="/data-structures/BST">Binary Search Trees</Link> rely on
          node objects connected by left and right pointers. While flexible,
          this approach incurs substantial overhead. Each node requires extra
          memory to store pointers, and chasing these pointers across memory can
          lead to poor cache locality, slowing down traversal.
        </Typography>

        <Typography paragraph>
          What if we could represent a tree without any pointers at all? For a
          special class of trees known as <strong>Complete Binary Trees</strong>
          , the answer is a resounding yes. We can map the entire structure into
          a single, flat array.
        </Typography>

        <Typography paragraph>
          A binary tree is considered {'"complete"'} if every level, except
          possibly the last, is fully filled, and all nodes in the last level
          are as far left as possible. This rigid structure means there are no
          gaps or holes in the tree. You can read the nodes level by level, from
          left to right, and they will form a contiguous sequence.
        </Typography>

        <Typography paragraph>
          This predictability is the foundation of an elegant optimization.
        </Typography>
      </Section>

      <Section title="Discarding Pointers">
        <Typography paragraph>
          Normally, building a tree requires nodes. Each node stores a value and
          references (pointers) to its left child, right child, and sometimes
          its parent. While flexible, this approach scatters memory across the
          heap and introduces overhead—each pointer consumes extra memory, and
          following those pointers disrupts cache locality.
        </Typography>

        <Typography paragraph>
          However, because a complete binary tree has no structural gaps, we do
          not need explicit pointers to know where a child or parent resides. We
          can implicitly define the tree structure entirely through mathematics
          and map it directly onto a flat array. This is the foundation of{' '}
          <Link href="/data-structures/BinaryHeap">Binary Heaps</Link>.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="The Index Math">
        <Typography paragraph>
          In a complete binary tree, every level is fully filled except possibly
          the last, which is filled from left to right. This strict structural
          property allows us to map tree nodes to array indices predictably. If
          we place the root at index 0, the math for any node at index{' '}
          <code>i</code> becomes remarkably simple:
        </Typography>

        <ListItems>
          <li>
            <strong>Left Child:</strong> <code>2 * i + 1</code>
          </li>
          <li>
            <strong>Right Child:</strong> <code>2 * i + 2</code>
          </li>
          <li>
            <strong>Parent:</strong> <code>Math.floor((i - 1) / 2)</code>
          </li>
        </ListItems>

        <Paper className="pseudoCode" sx={{ my: 3 }}>
          <pre>
            {`Complete Binary Tree (Valid for Flat Array):

Level 0:                 [10]           (idx: 0)
                       /      \\
Level 1:           [25]        [17]     (idx: 1, 2)
                  /    \\      /    \\
Level 2:       [30]    [40] [19]   [28] (idx: 3, 4, 5, 6)
               /  \\
Level 3:     [35] [50]                  (idx: 7, 8)

Index:   0    1    2    3    4    5    6    7    8
Value: [ 10 | 25 | 17 | 30 | 40 | 19 | 28 | 35 | 50 ]`}
          </pre>
        </Paper>

        <Typography paragraph>
          This index math is incredibly fast. Modern CPUs can calculate these
          offsets in a single cycle, often utilizing bitwise operations (like
          shifting left by one to multiply by two).
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Why Flat Arrays Matter">
        <Typography paragraph>
          Representing a tree implicitly in an array offers massive performance
          benefits. First, it eliminates the memory overhead of storing explicit
          pointers. Every byte in the array is dedicated purely to the data
          itself.
        </Typography>

        <Typography paragraph>
          Second, and perhaps more importantly, flat arrays provide excellent{' '}
          <strong>cache locality</strong>. When a CPU reads an element from an
          array, it pulls neighboring elements into its high-speed cache.
          Because parent-child traversal often involves jumping to nearby
          indices (especially near the root), accessing the tree in an array
          minimizes slow memory lookups compared to chasing pointers across
          fragmented memory.
        </Typography>
      </Section>

      <Section title="Simplifying Heap Operations">
        <Typography paragraph>
          The <strong>Binary Heap</strong> — the data structure behind{' '}
          <Link href="/sorting/HeapSort">Heap Sort</Link> and Priority Queues —
          relies entirely on this implicit complete tree representation,
          transforming a complex, pointer-heavy graph into a sleek,
          arithmetic-driven array.
        </Typography>

        <Typography paragraph>
          When inserting a new element or extracting the maximum value, the heap
          must reorganize itself by {'"sifting"'} values up or down. Because the
          tree is stored in an array, this traversal simply involves swapping
          values at calculated indices. The logic is concise, the memory
          footprint is minimal, and the execution is blindingly fast.
        </Typography>
      </Section>
    </Article>
  );
}
