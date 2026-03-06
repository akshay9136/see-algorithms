import { Paper, Typography } from '@mui/material';
import { Article, Section } from '@/components/common';
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

export default function DeletingNodeInBST() {
  return (
    <Article
      title="Deleting a Node in BST"
      summary="A closer look at how Binary Search Trees remove nodes while carefully maintaining the search property that keeps the structure ordered and efficient."
    >
      <Section title="The Responsibility">
        <Typography paragraph>
          A <Link href="/data-structures/BST">Binary Search Tree</Link> is not
          merely a collection of nodes. It is a disciplined structure governed
          by a simple invariant: for every node, values in the left subtree are
          smaller, and values in the right subtree are larger.
        </Typography>

        <Typography paragraph>
          When deleting a node, we are not just removing memory. We are
          preserving order. The structure must continue to behave as a BST after
          the operation.
        </Typography>
      </Section>

      <Section title="The Three Situations">
        <Typography paragraph>
          Deleting a node in a BST is not complicated. But it is precise. There
          are exactly three structural possibilities.
        </Typography>

        <Typography variant="h6" gutterBottom>
          1. Leaf Node (No Children)
        </Typography>

        <Typography paragraph>
          This is the simplest case. The node has no children. Removing it does
          not disturb the structure. We simply detach it from its parent. The
          tree remains valid.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Node with One Child
        </Typography>

        <Typography paragraph>
          Here the node has either a left child or a right child. Deleting it
          means connecting its parent directly to its only child. The child
          takes its place. The global structure remains correct.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Node with Two Children
        </Typography>

        <Typography paragraph>
          This is the only case that demands deeper thinking. If we simply
          remove the node, we break ordering. So instead, we replace its value
          with a carefully chosen substitute, either:
        </Typography>

        <Typography component="ul" sx={{ pl: 4, mb: 2 }}>
          <li>
            The maximum value from its left subtree (inorder predecessor), or
          </li>
          <li>The minimum value from its right subtree (inorder successor).</li>
        </Typography>

        <Typography paragraph>
          Why these? Because they are the closest values that preserve ordering.
          The inorder successor, for example, is the smallest value greater than
          the current node. By definition, it has no left child.
        </Typography>

        <Typography paragraph>
          After copying the replacement value, we then delete that successor or
          predecessor node — which now falls into case 1 or case 2. Deletion
          becomes simpler.
        </Typography>

        <Paper sx={styles.card}>
          <img src="/delete-bst-node.gif" alt="Delete Node" width="100%" />
        </Paper>
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
