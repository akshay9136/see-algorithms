import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedDataList, Section } from '@/components/common';
import useSavedData from '@/hooks/useSavedData';
import useRedBlackTree from '@/hooks/data-structures/useRedBlackTree';
import Link from 'next/link';

export default function RedBlackTree(props) {
  const { saveData, ...rest } = useSavedData();
  const { animation, buttons, summary, refresh } = useRedBlackTree({
    saveData,
  });

  return (
    <>
      <Typography paragraph>
        A <strong>Red-Black Tree</strong> is a self-balancing binary search tree
        where each node has a color – either red or black. These colors enforce
        rules that keep the tree roughly balanced, ensuring that the longest
        path from root to a leaf is no more than twice the shortest path. This
        guarantees predictable performance for searches, insertions, and
        deletions.
      </Typography>

      <Box display="flex" gap={4}>
        <Section variant="h6" title="How It Works">
          <Typography>
            When a node is inserted or deleted, the tree may temporarily violate
            its color rules. To restore balance, the tree uses a combination of
            recoloring and rotations. It maintains balance through four key
            properties: the root is always black, all leaves (null nodes) are
            black, <strong>red nodes cannot have red children</strong>, and
            every path from a node to its descendant leaves contains the same
            number of black nodes.
          </Typography>
        </Section>
        <Section variant="h6" title="Step by Step">
          <Typography component="ol" sx={{ '& li': { mb: 1 }, pl: 2 }}>
            <li>
              Insert a node like in a normal{' '}
              <Link href="/data-structures/BST">BST</Link> and color it red.
            </li>
            <li>Check the tree for violations of Red-Black rules.</li>
            <li>
              If there’s a violation, apply rotations (left or right) and
              recoloring to restore properties.
            </li>
            <li>
              Repeat until all rules are satisfied from the modified node to the
              root.
            </li>
          </Typography>
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

      <SavedDataList onSelect={refresh} {...rest} />
    </>
  );
}
