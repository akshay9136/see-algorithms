import { Article, Section } from '@/components/common';
import { Typography, Divider, Paper } from '@mui/material';
import Link from 'next/link';

const styles = {
  card: {
    maxWidth: 600,
    maxHeight: { xs: 200, sm: 400 },
    overflow: 'hidden',
    borderRadius: 0,
    mt: 3,
  },
};

export default function AVLTreeVsRedBlackTree() {
  return (
    <Article
      title="AVL Tree vs Red-Black Tree"
      summary="AVL Trees and Red-Black Trees both protect the Binary Search Tree from degeneration — but they do so with different temperaments."
    >
      <Section title="The Problem They Solve">
        <Typography paragraph>
          A Binary Search Tree is elegant when balanced. But if insertions
          happen in sorted order, it slowly collapses into a linked list. The
          structure still works, but its spirit is lost.
        </Typography>

        <Typography paragraph>
          Both AVL and Red-Black Trees exist to preserve structure
          automatically. They reorganize themselves after insertions and
          deletions so that height remains controlled. The difference lies in
          how strictly they enforce balance.
        </Typography>
      </Section>

      <Section title="Shared Mechanism">
        <Typography paragraph>
          Both trees rely on rotations — small, local restructuring operations
          that preserve the BST invariant.
        </Typography>

        <Typography paragraph>
          A rotation does not change the sorted order. It only rearranges
          parent-child relationships to restore balance. The difference is not
          in the mechanism, but in how often and how strictly it is invoked.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Strict Discipline">
        <Typography paragraph>
          An <Link href="/data-structures/AVL">AVL Tree</Link> maintains a
          simple rule: for every node, the height difference between its left
          and right subtree must not exceed one. This constraint is strict.
          After every insertion or deletion, the tree checks balance factors and
          performs rotations immediately if needed.
        </Typography>

        <Typography paragraph>
          The result is a tightly balanced tree. Search operations feel
          predictably stable because the height is kept minimal. But discipline
          has a cost. Insertions and deletions may trigger multiple rotations.
          The tree is precise, but it works harder to remain so.
        </Typography>

        <Paper sx={styles.card}>
          <img src="/avl-tree.gif" alt="AVL Tree" width="100%" />
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Controlled Flexibility">
        <Typography paragraph>
          A <Link href="/data-structures/RedBlackTree">Red-Black Tree</Link>{' '}
          relaxes the idea of perfect balance. Instead of tracking exact height
          differences, it colors each node red or black and enforces a set of
          coloring rules. These rules ensure that no path from root to leaf
          becomes excessively long.
        </Typography>

        <Typography paragraph>
          However, the tree does not insist on minimal height — only reasonable
          balance. Because the constraints are softer, insertions and deletions
          typically require fewer rotations compared to AVL Trees. The structure
          accepts slight imbalance in exchange for smoother updates.
        </Typography>

        <Paper
          sx={{
            ...styles.card,
            border: 1,
            borderColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <img src="/red-black-tree.gif" alt="Red-Black Tree" width="100%" />
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="When Searches Dominate">
        <Typography paragraph>
          If your system performs frequent lookups and relatively fewer
          structural updates, AVL Trees often feel sharper. Their stricter
          balance produces slightly shorter paths on average. Databases or
          in-memory indexing structures that emphasize retrieval may benefit
          from this rigidity.
        </Typography>
      </Section>

      <Section title="When Updates Are Frequent">
        <Typography paragraph>
          If insertions and deletions are constant, the Red-Black Tree usually
          behaves more gracefully. Because it tolerates small imbalances,
          restructuring is less aggressive. Many standard libraries prefer
          Red-Black Trees for this reason. They provide reliable balance without
          excessive rotation overhead.
        </Typography>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Practical Insight">
        <Typography paragraph>
          AVL Trees represent precision. Red-Black Trees represent resilience.
        </Typography>

        <Typography paragraph>
          If you value tighter height guarantees and primarily read-heavy usage,
          AVL aligns with that mindset. If you value smoother structural updates
          and broad practicality, Red-Black is often preferred.
        </Typography>

        <Typography paragraph>
          In the end, both protect the Binary Search Tree from chaos. They
          simply embody different philosophies of control. Understanding that
          difference is more important than memorizing rules.
        </Typography>
      </Section>
    </Article>
  );
}
