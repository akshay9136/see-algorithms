import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  AdUnit,
  ComplexityTable,
  ListItems,
  SavedDataList,
  Section,
  TreeInput,
} from '@/components/common';
import { useBreakpoints, useSavedData } from '@/hooks';
import { useBinaryTree } from '@/hooks/data-structures';
import splayTree from '@/helpers/splayTree';
import Link from 'next/link';

export default function SplayTree(props) {
  const { saveData, ...saveDataProps } = useSavedData();
  const { lgup } = useBreakpoints();
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
      <Divider sx={{ my: 3 }} />

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={{ xs: 0, md: 4 }}
      >
        <Section variant="h6" title="How It Works">
          <Typography paragraph>
            When you search, insert, or delete a node, the tree performs a{' '}
            <Link href="/articles/splay-tree-rotations">
              series of rotations
            </Link>{' '}
            called {'"splaying"'} to bring that node to the root. There are 3
            types of rotations depending on the node’s position:{' '}
            <strong>Zig</strong> (single rotation), <strong>Zig-Zig</strong>{' '}
            (double rotation in same direction), and <strong>Zig-Zag</strong>{' '}
            (double rotation in opposite directions).
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
              <strong>Search:</strong> Follows standard{' '}
              <Link href="/data-structures/BST">BST</Link> comparisons, then
              splays the matching node (or last visited node if absent) to the
              root.
            </li>
            <li>
              <strong>Insertion:</strong> Inserts the new key as a leaf using
              the BST rule, then immediately splays that new node to the root.
            </li>
            <li>
              <strong>Deletion:</strong> Splays the target key to the root and
              removes it. To reconnect the remaining subtrees, splays the
              maximum key in the left subtree to its root and attaches the right
              subtree.
            </li>
          </ListItems>
        </Section>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h6">
            Visualizer
          </Typography>
          <TreeInput {...props} buttons={buttons} />
          {animation}
        </Stack>
        {summary}
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" gap={4}>
        <ComplexityTable data={complexityData} />
        {lgup && <AdUnit sx={{ maxWidth: 500 }} />}
      </Box>

      <SavedDataList onSelect={refresh} {...saveDataProps} />
    </>
  );
}

const complexityData = [
  {
    type: 'Search (Amortized)',
    complexity: 'O(log n)',
    description:
      'Recently accessed items sit near the root; amortized O(log n) across any operation sequence.',
  },
  {
    type: 'Insertion (Amortized)',
    complexity: 'O(log n)',
    description:
      'Inserts as a leaf and splays the new node to the root, restructuring the tree.',
  },
  {
    type: 'Deletion (Amortized)',
    complexity: 'O(log n)',
    description:
      'Splays the target to the root, removes it, and splays the left subtree maximum to join.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description:
      'Zero extra memory stored in nodes for heights, balance factors, or color bits.',
  },
];
