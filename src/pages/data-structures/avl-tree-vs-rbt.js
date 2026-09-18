import { Box, Divider, Stack, Typography } from '@mui/material';
import { muteSounds, randomKeys } from '@/common/utils';
import { useEffect } from 'react';
import { useAvlTree, useRedBlackTree } from '@/hooks/data-structures';
import { assignColors } from '@/helpers/redBlackTree';
import useTreeUrl from '@/hooks/useTreeUrl';
import DSInput from '@/components/common/ds-input';
import Link from 'next/link';

export default function AVLvsRedBlack(props) {
  const [nodes, isReady] = useTreeUrl();
  const {
    animation: avlAnimation,
    buttons: avlButtons,
    newTree: avlTree,
  } = useAvlTree({ allowRefresh: false });
  const {
    animation: rbtAnimation,
    buttons: rbtButtons,
    newTree: redBlackTree,
  } = useRedBlackTree({ allowRefresh: false });

  // remove last two buttons (Save and Share)
  avlButtons.splice(5, 2);

  useEffect(muteSounds, []);

  useEffect(() => {
    if (isReady) {
      const keys = nodes || randomKeys();
      avlTree(keys);
      redBlackTree(assignColors(keys));
    }
  }, [isReady, nodes]);

  return (
    <Stack spacing={3}>
      <Typography>
        Both <Link href="/data-structures/AVL">AVL Trees</Link> and{' '}
        <Link href="/data-structures/RedBlackTree">Red-Black Trees</Link> keep
        themselves balanced so that searching stays fast. The difference is in
        how strict they are — <strong>AVL Trees</strong> stay more tightly
        balanced, which makes lookups slightly faster but requires more work
        when adding or removing values. <strong>Red-Black Trees</strong> are a
        bit more relaxed, so insertions and deletions are quicker. Try inserting
        the same values into both and see how each one balances itself. For a
        deeper look at how and why they differ, check out{' '}
        <Link href="/articles/avl-tree-vs-red-black">this article</Link>.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4} alignItems="end">
        <Stack spacing={2}>
          <DSInput
            {...props}
            buttons={avlButtons}
            allButtons={[...avlButtons, ...rbtButtons]}
          />
          {avlAnimation}
        </Stack>
        {rbtAnimation}
      </Box>
    </Stack>
  );
}
