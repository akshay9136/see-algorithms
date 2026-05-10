import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedItems, Section } from '@/components/common';
import useSavedData from '@/hooks/useSavedData';
import useAvlTree from '@/hooks/data-structures/useAvlTree';
import Link from 'next/link';

export default function AVL(props) {
  const { saveData, ...rest } = useSavedData();
  const { algorithm, animation, buttons, summary, refresh } = useAvlTree({
    saveData,
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
            <li>
              <strong>Right Rotation (LL)</strong> – Applied when a left child’s
              left subtree causes imbalance.
            </li>
            <li>
              <strong>Left Rotation (RR)</strong> – Applied when a right child’s
              right subtree causes imbalance.
            </li>
            <li>
              <strong>Left-Right Rotation (LR)</strong> – Applied when a left
              child’s right subtree causes imbalance.
            </li>
            <li>
              <strong>Right-Left Rotation (RL)</strong> – Applied when a right
              child’s left subtree causes imbalance.
            </li>
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
          <Typography variant="h6" component="h2">
            Visualizer
          </Typography>
          <DSInput {...props} buttons={buttons} />
          {animation}
          <br />
          {summary}
        </Stack>
      </Box>
      <SavedItems onSelect={refresh} {...rest} />
    </>
  );
}
