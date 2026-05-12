import { Divider, Paper, Typography } from '@mui/material';
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

export default function DeletingBstNode() {
  return (
    <Article
      title="Deleting a Node in BST"
      summary="A closer look at how Binary Search Trees remove nodes while carefully maintaining the search property that keeps the structure ordered and efficient."
    >
      <Section title="The BST Invariant">
        <Typography paragraph>
          A <Link href="/data-structures/BST">Binary Search Tree</Link> is not
          merely a collection of nodes. It is a disciplined structure governed
          by a simple invariant: for every node, values in the left subtree are
          smaller, and values in the right subtree are larger.
        </Typography>

        <Typography paragraph>
          This invariant is what makes BST operations efficient. Searching,
          inserting, and deleting all rely on this ordering to navigate the tree
          in O(h) time, where h is the height. When we delete a node, we are not
          just removing memory — we are preserving order. The structure must
          continue to behave as a valid BST after the operation.
        </Typography>
      </Section>

      <Section title="The Three Cases">
        <Typography paragraph>
          Deleting a node in a BST is not complicated. But it is precise. There
          are exactly three structural possibilities.
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
        >
          Case 1: Leaf Node (No Children)
        </Typography>

        <Typography paragraph>
          This is the simplest case. The node has no children. Removing it does
          not disturb the structure. We simply detach it from its parent by
          setting the parent&apos;s corresponding child pointer to null. The
          tree remains valid.
        </Typography>

        <Paper className="algorithm" sx={{ my: 3 }}>
          <pre style={{ margin: 0 }}>
            {`Before:          After deleting 3:
      5                5
     / \\              / \\
    3   7            ·   7
                         
Node 3 is a leaf → simply remove it`}
          </pre>
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 3 }}
        >
          Case 2: Node with One Child
        </Typography>

        <Typography paragraph>
          Here the node has either a left child or a right child, but not both.
          Deleting it means connecting its parent directly to its only child.
          The child takes its place. The BST property is preserved because the
          entire subtree under the child already satisfies the ordering
          constraint.
        </Typography>

        <Paper className="algorithm" sx={{ my: 3 }}>
          <pre style={{ margin: 0 }}>
            {`Before:          After deleting 3:
      5                5
     / \\              / \\
    3   7            2   7
   /                     
  2                      
                         
Node 3 has one child (2) → replace 3 with 2`}
          </pre>
        </Paper>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="warning.main"
          gutterBottom
          sx={{ mt: 3 }}
        >
          Case 3: Node with Two Children
        </Typography>

        <Typography paragraph>
          This is the only case that demands deeper thinking. If we simply
          remove the node, we break ordering. So instead, we replace its value
          with a carefully chosen substitute, either:
        </Typography>

        <Typography component="ul" sx={{ mb: 2, '& li': { mb: 1 } }}>
          <li>
            <strong>Inorder Predecessor:</strong> The maximum value from its
            left subtree, or
          </li>
          <li>
            <strong>Inorder Successor:</strong> The minimum value from its right
            subtree.
          </li>
        </Typography>

        <Typography paragraph>
          Why these? Because they are the closest values that preserve ordering.
          The inorder successor, for example, is the smallest value greater than
          the current node. By definition, it has at most one child (no left
          child), so after copying its value, deleting it reduces to Case 1 or
          Case 2.
        </Typography>

        <Paper sx={styles.card}>
          <img src="/delete-bst-node.gif" alt="Delete Node" width="100%" />
        </Paper>
      </Section>

      <Divider sx={{ mb: 3 }} />

      <Section title="Time Complexity">
        <Typography paragraph>
          The time complexity of deletion depends on the height of the tree:
        </Typography>

        <Paper className="algorithm" sx={{ my: 3 }}>
          <pre style={{ margin: 0 }}>
            {`Operation               Balanced BST    Skewed BST
────────────────────    ────────────    ──────────
Find the node           O(log n)        O(n)
Find successor/pred.    O(log n)        O(n)
Delete and reconnect    O(1)            O(1)

Total deletion time     O(log n)        O(n)`}
          </pre>
        </Paper>

        <Typography paragraph>
          In a balanced BST, deletion is efficient at O(log n). But if the tree
          becomes skewed (degenerated into a linked list), operations degrade to
          O(n). This is precisely why self-balancing trees like{' '}
          <Link href="/data-structures/AVL">AVL Trees</Link> and{' '}
          <Link href="/data-structures/RedBlackTree">Red-Black Trees</Link>{' '}
          exist — they guarantee O(log n) height after every insertion and
          deletion.
        </Typography>
      </Section>

      <Section title="Predecessor vs Successor">
        <Typography paragraph>
          Both approaches produce a valid BST. The choice between predecessor
          and successor is often arbitrary — most implementations use the
          inorder successor by convention. However, consistently choosing one
          over the other can cause the tree to become unbalanced over time.
        </Typography>

        <Typography paragraph>
          Some implementations alternate between predecessor and successor on
          each deletion to distribute structural changes more evenly. In
          self-balancing trees, this concern is handled automatically by the
          rebalancing mechanism.
        </Typography>
      </Section>

      <Section title="Final Reflection">
        <Typography paragraph>
          Most of the time, deletion is simple. Only when a node holds two
          subtrees do we need strategy.
        </Typography>

        <Typography paragraph>
          By selecting a successor or predecessor as a replacement, the
          complexity reduces itself into one of the easier cases of deletion.
          The tree ensures that the structure remains consistent, and the search
          property continues to hold throughout the tree.
        </Typography>
      </Section>
    </Article>
  );
}
