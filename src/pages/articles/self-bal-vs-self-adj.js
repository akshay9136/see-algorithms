import { Typography, Divider, Paper } from '@mui/material';
import { Article, Section } from '@/components/common';
import Link from 'next/link';

const styles = {
  card: {
    maxWidth: 600,
    maxHeight: { xs: 200, sm: 400 },
    overflow: 'hidden',
    border: 1,
    borderColor: 'divider',
    mt: 3,
  },
};

export default function HowTreesStayEfficient() {
  return (
    <Article
      title="How Trees Stay Efficient"
      summary="An exploration of two different strategies used by binary search trees to maintain efficiency — structural balance enforced by rules versus continuous adaptation driven by access patterns."
    >
      <Section title="The Question of Order">
        <Typography paragraph>
          A <Link href="/data-structures/BST">Binary Search Tree</Link> is
          simple in spirit: smaller values go left, larger values go right.
          But simplicity is fragile. Insert sorted data and the tree quietly
          collapses into a linked list. Performance is lost because of
          structure.
        </Typography>

        <Typography paragraph>
          Two philosophies emerged to protect this structure:{' '}
          <em>self-balancing trees</em> and <em>self-adjusting trees</em>. Both
          aim to maintain efficiency, but they approach the problem differently.
          One enforces discipline at all times. The other learns from usage.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Enforced Symmetry">
        <Typography paragraph>
          A <strong>self-balancing tree</strong> maintains strict height
          constraints after every insertion and deletion. The tree constantly
          measures itself and performs rotations when imbalance crosses a
          defined threshold.
        </Typography>

        <Typography paragraph>
          Examples include <Link href="/data-structures/AVL">AVL Trees</Link>{' '}
          and <Link href="/data-structures/RedBlackTree">Red-Black Trees</Link>.
          Though their rules differ, their promise is consistent: the height
          remains logarithmic, regardless of input order. The key idea is{' '}
          <strong>prevention of imbalance</strong>.
        </Typography>

        <Typography paragraph>
          This makes self-balancing trees predictable. Worst-case scenarios are
          tightly controlled. For systems where guarantees matter — databases,
          indexing engines, compilers — this predictability is valuable.
        </Typography>

        <Paper sx={styles.card}>
          <img src="/avl-tree.gif" alt="AVL Tree" width="100%" />
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Adaptation On Access">
        <Typography paragraph>
          A <strong>self-adjusting tree</strong> does not strictly maintain
          balance after every update. Instead, it reorganizes itself based on
          access patterns. The most well-known example is the{' '}
          <Link href="/data-structures/SplayTree">Splay Tree</Link>. Whenever a
          node is accessed, it is rotated toward the root. Frequently accessed
          elements naturally migrate upward.
        </Typography>

        <Typography paragraph>
          The philosophy here is different. Instead of enforcing perfect
          balance, the tree optimizes for <strong>locality of reference</strong>
          . If certain elements are used repeatedly, the structure adapts to
          make those accesses faster.
        </Typography>

        <Typography paragraph>
          The tree may not always appear balanced. In fact, at any given moment,
          it might look skewed. Yet over a sequence of operations, its amortized
          performance remains efficient.
        </Typography>

        <Paper sx={styles.card}>
          <img src="/splay-tree.gif" alt="Splay Tree" width="100%" />
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Rotation Philosophy">
        <Typography paragraph>
          Both rely on rotations, but their triggers differ. In self-balancing
          trees, rotations occur when structural invariants are violated — for
          example, when the height difference between left and right subtrees
          exceeds a threshold.
        </Typography>

        <Typography paragraph>
          In self-adjusting trees, rotations occur simply because a node was
          accessed. As a result, the structure continuously evolves based on
          usage. Nodes that are rarely accessed slowly drift deeper in the tree,
          while frequently used nodes rise toward the top.
        </Typography>
      </Section>

      <Section title="When to Choose Which?">
        <Typography paragraph>
          If you require strict worst-case guarantees, choose a self-balancing
          tree. It offers structural discipline and predictable height. If your
          workload has strong locality — where some elements are accessed far
          more frequently than others — a self-adjusting tree may outperform in
          practice.
        </Typography>

        <Typography paragraph>
          One protects against chaos. The other benefits from patterns. The
          choice depends on whether you value guaranteed symmetry or intelligent
          adaptation.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Final Reflection">
        <Typography paragraph>
          Self-balancing trees protect performance through strict discipline.
          They prevent structural decay before it becomes dangerous.
          Self-adjusting trees accept temporary disorder but trust that repeated
          operations will naturally guide the structure toward efficiency.
        </Typography>

        <Typography paragraph>
          They are strategies. The wisdom lies in knowing which one your problem
          demands.
        </Typography>
      </Section>
    </Article>
  );
}
