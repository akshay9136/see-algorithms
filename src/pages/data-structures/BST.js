import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedDataList } from '@/components/common';
import useSavedData from '@/hooks/useSavedData';
import useSearchTree from '@/hooks/data-structures/useSearchTree';
import Link from 'next/link';

export default function BST(props) {
  const { saveData, ...rest } = useSavedData();
  const { animation, buttons, summary, refresh } = useSearchTree({ saveData });

  return (
    <>
      <Typography paragraph>
        A <strong>Binary Search Tree</strong> (BST) is like a well-organized
        library where each book (node) has a clear place based on its value. In
        a BST, each node has up to two children: the left child holds smaller
        values, and the right child holds larger values. This structure allows
        for efficient searching, adding, and removing of books, as you can
        quickly navigate left or right to find or insert a book in its proper
        place.
      </Typography>

      <Typography paragraph>
        <strong>Insertion</strong> walks down the tree by repeatedly choosing
        left or right based on comparison, stopping only when it finds an empty
        spot. The new node is attached as a leaf. <strong>Deletion</strong>{' '}
        first locates the target node, then carefully reconnects its children so
        the BST rule still holds. If the node has no children, it is simply
        removed. If it has one child, that child takes its place. If the node
        has two children, the tree replaces it with a nearby node that preserves
        ordering. Learn the full strategy in our{' '}
        <Link href="/articles/deleting-bst-node">BST deletion</Link> guide.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <DSInput {...props} buttons={buttons} />
          {animation}
        </Stack>
        {summary}
      </Box>
      <SavedDataList onSelect={refresh} {...rest} />
    </>
  );
}
