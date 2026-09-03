import { Box, Divider, Stack, Typography } from '@mui/material';
import { useBPlusTree, useBTree } from '@/hooks/data-structures';
import { useEffect } from 'react';
import { muteSounds } from '@/common/utils';
import DSInput from '@/components/common/ds-input';
import Link from 'next/link';

export default function BTreeVsBPlusTree(props) {
  const { animation: bTreeAnimation, buttons: bTreeButtons } = useBTree({
    allowRefresh: false,
  });
  const { animation: bPlusAnimation, buttons: bPlusButtons } = useBPlusTree({
    allowRefresh: false,
  });

  // Remove Save and Share buttons (last 2) for both trees
  bTreeButtons.splice(5, 2);
  bPlusButtons.splice(5, 2);

  useEffect(muteSounds, []);

  return (
    <Stack spacing={3}>
      <Typography>
        Both <strong>B-Trees</strong> and <strong>B+ Trees</strong> are
        self-balancing multi-way search trees used in databases and file
        systems, but they differ in <em>where data lives</em> and{' '}
        <em>how splits work</em>. In a{' '}
        <Link href="/data-structures/BTree">B-Tree</Link>, every node — internal
        and leaf — stores data, and when a node splits the median key is{' '}
        <strong>moved up</strong> to the parent. In a{' '}
        <Link href="/data-structures/B+Tree">B+ Tree</Link>, data lives only in
        the leaf nodes; internal nodes are purely routing guides, and the median
        key is <strong>copied up</strong> during a leaf split, so it remains in
        the leaf. Leaf nodes in a B+ Tree are also linked together, making range
        queries much more efficient. Try inserting the same values into both to
        see how the structures diverge.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4} alignItems="end">
        <Stack spacing={2}>
          <DSInput
            {...props}
            buttons={bTreeButtons}
            allButtons={[...bTreeButtons, ...bPlusButtons]}
          />
          {bTreeAnimation}
        </Stack>
        {bPlusAnimation}
      </Box>
    </Stack>
  );
}
