import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  AdUnit,
  ComplexityTable,
  ListItems,
  SavedDataList,
  Section,
  TreeInput,
} from '@/components/common';
import { useAlgorithm, useBreakpoints, useSavedData } from '@/hooks';
import { useBinaryTree } from '@/hooks/data-structures';
import avlTree from '@/helpers/avlTree';
import Link from 'next/link';

export default function AVL(props) {
  const { saveData, ...saveDataProps } = useSavedData();
  const { lgdown, xxlup } = useBreakpoints();
  const { animation, summary, buttons, examplePicker, inputRef, refresh } =
    useBinaryTree({
      createTree: (animator) => avlTree(animator, setCurrentStep),
      hideButtons: ['Search'],
      treeType: 'avl',
      saveData,
    });

  const [algorithm, setCurrentStep] = useAlgorithm(`
function rebalance(node):
    updateHeight(node)
    nodeBf = balanceFactor(node)
    if nodeBf > 1:
        if balanceFactor(node.left) >= 0:
            rotateRight(node)
        else:
            rotateLeft(node.left)
            rotateRight(node)
    if nodeBf < -1:
        if balanceFactor(node.right) <= 0:
            rotateLeft(node)
        else:
            rotateRight(node.right)
            rotateLeft(node)
    if node.parent:
        rebalance(node.parent)
`);

  return (
    <>
      <Typography paragraph>
        Named after its inventors Adelson-Velsky and Landis, an{' '}
        <strong>AVL Tree</strong> rigorously maintains balance by ensuring that
        for every node, the difference between the heights of its left and right
        subtrees is never more than 1. If an operation violates this condition,
        the tree automatically rebalances itself through a{' '}
        <Link href="/articles/avl-tree-rotations">series of rotations</Link>.
        This ensures that operations like search, insert, and delete have a
        worst-case time complexity of O(log n).
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={{ xs: 0, md: 4 }}
      >
        <Section variant="h6" title="Types of Rotations">
          <Typography paragraph>
            Every time a node is inserted or deleted, the AVL tree checks the{' '}
            <strong>balance factor</strong> of each affected node. If a node
            becomes unbalanced, rotations are performed to restore balance.
            There are four types of rotations:
          </Typography>
          <ListItems sx={{ mb: 0, textAlign: 'left' }}>
            <li>
              <strong>Right Rotation (LL)</strong> – Left-Left Imbalance
            </li>
            <li>
              <strong>Left Rotation (RR)</strong> – Right-Right Imbalance
            </li>
            <li>
              <strong>Left-Right Rotation (LR)</strong> – Left-Right Imbalance
            </li>
            <li>
              <strong>Right-Left Rotation (RL)</strong> – Right-Left Imbalance
            </li>
          </ListItems>
        </Section>
        <Section variant="h6" title="Step by Step">
          <ListItems component="ol" sx={{ pl: 2 }}>
            <li>
              Insert or delete a node using standard{' '}
              <Link href="/data-structures/BST">BST</Link> rules.
            </li>
            <li>
              Traverse back up to the root, updating height of each ancestor.
            </li>
            <li>
              Compute balance factor to check if it falls outside{' '}
              <code>[&minus;1,0,1]</code>.
            </li>
            <li>
              If a node is unbalanced, identify the type of rotation needed (LL,
              RR, LR, RL).
            </li>
            <li>Perform the rotation to restore the AVL property.</li>
          </ListItems>
        </Section>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        flexWrap="wrap"
        gap={4}
      >
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          <Box display="flex" gap={3}>
            {algorithm}
            {lgdown && <AdUnit sx={{ maxWidth: 200 }} />}
          </Box>
        </Stack>
        <Stack spacing={2}>
          <Box display="flex" gap={2}>
            <Typography variant="h6" component="h2">
              Visualizer
            </Typography>
            {examplePicker}
          </Box>
          <TreeInput ref={inputRef} buttons={buttons} />
          {animation}
          <br />
          {summary}
        </Stack>
        {xxlup && <AdUnit sx={{ maxWidth: 200 }} />}
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section title="How It Works">
            <Typography>
              Whenever a node is inserted or removed, the AVL tree recalculates
              the <strong>balance factor</strong> (left subtree height &minus;
              right subtree height) of each ancestor node on the return path to
              the root. If the balance factor deviates outside the range{' '}
              <code>[-1, 1]</code>, local rotations restore balance immediately.
              For an insertion, at most one single or double rotation is needed
              to restore the global AVL property. For deletion, however,
              rebalancing one node can reduce the height of its subtree, which
              may propagate an imbalance to its parent, potentially triggering
              up to O(log n) rotations along the entire ancestry to the root.
            </Typography>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              AVL Trees are the optimal choice for <strong>read-heavy</strong>{' '}
              workloads where lookups far outnumber insertions and deletions.
              Because AVL trees enforce a tighter height bound than{' '}
              <Link href="/data-structures/RedBlackTree">Red-Black Trees</Link>,
              average search paths are approximately 12% shorter, delivering
              measurably faster lookup latency. Common applications include
              in-memory language dictionaries, routing table lookups, and static
              search indexes where the dataset is constructed once and queried
              repeatedly.
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>

      <SavedDataList onSelect={refresh} {...saveDataProps} />
    </>
  );
}

const complexityData = [
  {
    type: 'Search',
    complexity: 'O(log n)',
    description:
      'Strictly bounded height (≤ 1.44 log₂ n) ensures faster lookups than red-black trees.',
  },
  {
    type: 'Insertion',
    complexity: 'O(log n)',
    description:
      'Standard BST insertion followed by at most 1 single or double rotation to restore balance.',
  },
  {
    type: 'Deletion',
    complexity: 'O(log n)',
    description:
      'Standard BST deletion; height changes can trigger up to O(log n) cascading rotations to the root.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description:
      'Stores n nodes with child pointers plus an integer height or balance factor per node.',
  },
];
