import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  DSInput,
  ListItems,
  SavedDataList,
  Section,
} from '@/components/common';
import { useBinaryTree } from '@/hooks/data-structures';
import { useSavedData } from '@/hooks';
import splayTree from '@/helpers/splayTree';
import Link from 'next/link';

export default function SplayTree(props) {
  const { saveData, ...saveDataProps } = useSavedData();
  const { animation, summary, buttons, refresh } = useBinaryTree({
    createTree: splayTree,
    treeType: 'splay',
    saveData,
  });

  return (
    <>
      <Typography paragraph>
        A <strong>Splay Tree</strong> is a self-adjusting binary search tree
        that reshapes itself based on how it’s used. Instead of trying to stay
        balanced all the time, it aggressively moves recently accessed nodes
        closer to the root. Over time, the tree adapts to access patterns rather
        than an abstract notion of balance. Splay trees are useful for ordered
        dictionaries or lookup tables with uneven access patterns, such as
        repeatedly looking up a small working set of identifiers.
      </Typography>

      <Box display="flex" gap={4}>
        <Section variant="h6" title="How It Works">
          <Typography paragraph>
            When you search, insert, or delete a node, the tree performs a
            series of rotations called {'"splaying"'} to bring that node to the
            root. There are three types of rotations depending on the node’s
            position: <strong>Zig</strong> (single rotation),{' '}
            <strong>Zig-Zig</strong> (double rotation in same direction), and{' '}
            <strong>Zig-Zag</strong> (double rotation in opposite directions).
          </Typography>
          <Typography>
            After splaying, frequently accessed nodes stay near the root, making
            repeated operations faster. Each operation take{' '}
            <strong>O(log n) amortized time</strong> for n stored keys, with{' '}
            O(n) worst-case time for any single operation.
          </Typography>
        </Section>
        <Section variant="h6" title="Key Operations">
          <ListItems sx={{ pl: 2, mb: 0 }}>
            <li>
              <strong>Search:</strong> follow{' '}
              <Link href="/data-structures/BST">BST</Link> comparisons, then
              splay the matching node. If the key is absent, splay the last node
              visited.
            </li>
            <li>
              <strong>Insertion:</strong> place a new key as a leaf using the
              BST rule, then splay that new node to the root.
            </li>
            <li>
              <strong>Deletion:</strong> splay the key to the root and remove
              it. To join the remaining subtrees, splay the largest key in the
              left subtree and attach the right subtree as its right child. If
              the left subtree is empty, use the right subtree as the new tree.
            </li>
          </ListItems>
        </Section>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <DSInput {...props} buttons={buttons} />
          {animation}
        </Stack>
        {summary}
      </Box>

      <SavedDataList onSelect={refresh} {...saveDataProps} />
    </>
  );
}
