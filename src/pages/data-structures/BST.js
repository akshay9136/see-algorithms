import { Box, Divider, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import DSInput from '@/components/common/ds-input';
import useSearchTree from '@/hooks/data-structures/useSearchTree';

export default function BST(props) {
  const { animation, buttons, summary } = useSearchTree();

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        A <strong>Binary Search Tree</strong> (BST) is like a well-organized
        library where each book (node) has a clear place based on its value. In
        a BST, each node has up to two children: the left child holds smaller
        values, and the right child holds larger values. This structure allows
        for efficient searching, adding, and removing of books, as you can
        quickly navigate left or right to find or insert a book in its proper
        place.
      </Typography>
      <Typography variant="h6" component="h2">
        How it Works
      </Typography>
      <Typography component="ul" variant="body1" sx={{ '& li': { mb: 1 } }}>
        <li>
          <strong>Insertion</strong> walks down the tree by repeatedly choosing
          left or right based on comparison, stopping only when it finds an
          empty spot. The new node is attached as a leaf.
        </li>
        <li>
          <strong>Deletion</strong> first locates the target node, then
          carefully reconnects its children so the BST rule still holds. If the
          node has no children, it is simply removed. If it has one child, that
          child takes its place. If the node has two children, the tree replaces
          it with a nearby node that preserves ordering. Learn the full strategy
          in our <Link href="/articles/deleting-bst-node">BST deletion</Link>{' '}
          guide.
        </li>
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Visualizer
          </Typography>
          <DSInput {...props} buttons={buttons} />
          {animation}
        </Stack>
        <Divider orientation="vertical" flexItem />
        {summary}
      </Box>
    </Stack>
  );
}
