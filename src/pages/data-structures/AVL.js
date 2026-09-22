import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, Section } from '@/components/common';
import { useBinaryTree } from '@/hooks/data-structures';
import { useAlgorithm } from '@/hooks';
import avlTree from '@/helpers/avlTree';
import Link from 'next/link';

export default function AVL(props) {
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

  const { animation, buttons, summary, savedData } = useBinaryTree({
    createTree: (animator) => avlTree(animator, setCurrentStep),
    hideButtons: ['Search'],
    treeType: 'avl',
  });

  return (
    <>
      <Typography paragraph>
        Named after its inventors Adelson-Velsky and Landis, an{' '}
        <strong>AVL Tree</strong> rigorously maintains balance by ensuring that
        for every node, the difference between the heights of its left and right
        subtrees is never more than 1. If an operation violates this condition,
        the tree automatically rebalances itself through a series of rotations.
        This ensures that operations like search, insert, and delete have a
        worst-case time complexity of O(log n).
      </Typography>

      <Box display="flex" gap={4}>
        <Section variant="h6" title="How It Works">
          <Typography paragraph>
            Every time a node is inserted or deleted, the AVL tree checks the{' '}
            <strong>balance factor</strong> of each affected node. If a node
            becomes unbalanced, rotations are performed to restore balance.
            There are four types of rotations:
          </Typography>
          <Typography component="ul" sx={{ '& li': { mb: 1 } }}>
            <li><strong>Right Rotation (LL)</strong> – Left-Left Imbalance</li>
            <li><strong>Left Rotation (RR)</strong> – Right-Right Imbalance</li>
            <li><strong>Left-Right Rotation (LR)</strong> – Left-Right Imbalance</li>
            <li><strong>Right-Left Rotation (RL)</strong> – Right-Left Imbalance</li>
          </Typography>
        </Section>

        <Section variant="h6" title="Step by Step">
          <Typography component="ol" sx={{ '& li': { mb: 1 }, pl: 2 }}>
            <li>
              Insert or delete a node like in a normal{' '}
              <Link href="/data-structures/BST">BST</Link>.
            </li>
            <li>
              Traverse back up to the root, updating height and checking the
              balance factor of each ancestor.
            </li>
            <li>
              If a node is unbalanced, identify the type of rotation needed (LL,
              RR, LR, RL).
            </li>
            <li>Perform the rotation to restore the AVL property.</li>
          </Typography>
        </Section>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Pseudocode
          </Typography>
          {algorithm}
        </Stack>
        <Stack spacing={2}>
          <DSInput {...props} buttons={buttons} />
          {animation}
          <br />
          {summary}
        </Stack>
      </Box>

      {savedData}
    </>
  );
}
