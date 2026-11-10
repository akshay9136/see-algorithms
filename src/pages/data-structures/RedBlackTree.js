import { useState } from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  AdUnit,
  AlgoSteps,
  ComplexityTable,
  SavedDataList,
  Section,
  TreeInput,
} from '@/components/common';
import { useBreakpoints, useSavedData } from '@/hooks';
import { useBinaryTree } from '@/hooks/data-structures';
import redBlackTree from '@/helpers/redBlackTree';
import Link from 'next/link';

export default function RedBlackTree(props) {
  const [currentStep, setCurrentStep] = useState('');
  const { saveData, ...saveDataProps } = useSavedData();
  const { lgup, xldown } = useBreakpoints();
  const { animation, summary, buttons, refresh } = useBinaryTree({
    createTree: (animator) => redBlackTree(animator, setCurrentStep),
    hideButtons: ['Search'],
    treeType: 'red-black',
    saveData,
  });

  return (
    <>
      <Typography paragraph>
        A <strong>Red-Black Tree</strong> is a self-balancing binary search tree
        where each node has a color — either red or black. These colors enforce
        rules that keep the tree roughly balanced, ensuring that the longest
        path from root to a leaf is no more than twice the shortest path. This
        guarantees reliable O(log n) worst-case performance for lookups,
        insertions, and deletions.
      </Typography>
      <Typography paragraph>
        When a node is inserted or deleted, the tree may temporarily violate its
        color rules. To restore balance, the tree uses a combination of
        recoloring and rotations. It maintains balance through four key
        properties: the root is always black, all leaves (null nodes) are black,{' '}
        <strong>red nodes cannot have red children</strong>, and every path from
        a node to its descendant leaves contains the same number of black nodes.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={{ xs: 0, md: 4 }}
      >
        <Section variant="h6" title="How It Works">
          <Typography paragraph>
            When a new node is inserted into a red-black tree, it is{' '}
            <strong>colored red</strong> to avoid altering the black-height of
            existing paths. However, if its parent is also red, the red-property
            is violated (two consecutive red nodes). The tree repairs this
            violation using recoloring and rotations by inspecting the{' '}
            <strong>color of the node&apos;s uncle</strong> (the parent&apos;s
            sibling).
          </Typography>
          <Typography>
            If the uncle is red, a simple recoloring pushes the violation up the
            tree without rotations. If the uncle is black, at most 2 rotations
            resolve the conflict. Deletion follows similar principles: if a
            black node is removed, a{' '}
            <Link href="/articles/deleting-rbt-node">black-height deficit</Link>{' '}
            is resolved using recoloring and at most 3 rotations.
          </Typography>
        </Section>

        <Section variant="h6" title="Insertion Cases (Fix-up)">
          <AlgoSteps component="ul" currentStep={currentStep}>
            <li>
              <strong>Insert New Node</strong> as a red leaf using standard{' '}
              <Link href="/data-structures/BST">BST</Link> logic.
            </li>
            <li>
              <strong>Case 1 (Uncle is Red):</strong> Recolor parent and uncle
              to black, and grandparent to red. Move violation check up to the
              grandparent.
            </li>
            <li>
              <strong>Case 2 (Uncle is Black, Triangle):</strong> If the node is
              an inner child (LR or RL), rotate its parent to transform it into
              a line (Case 3).
            </li>
            <li>
              <strong>Case 3 (Uncle is Black, Line):</strong> If the node is an
              outer child (LL or RR), rotate the grandparent and swap parent and
              grandparent colors to restore balance.
            </li>
          </AlgoSteps>
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
        {lgup && xldown && <AdUnit sx={{ maxWidth: 300 }} />}
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
    type: 'Search',
    complexity: 'O(log n)',
    description:
      'Guaranteed maximum height of 2 log₂ (n + 1) provides predictable logarithmic lookups.',
  },
  {
    type: 'Insertion',
    complexity: 'O(log n)',
    description:
      'Standard BST insertion followed by recoloring and at most 2 tree rotations.',
  },
  {
    type: 'Deletion',
    complexity: 'O(log n)',
    description:
      'Removes the node followed by black-height rebalancing with at most 3 rotations.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description:
      'Requires one color bit per node in addition to standard BST pointers.',
  },
];
