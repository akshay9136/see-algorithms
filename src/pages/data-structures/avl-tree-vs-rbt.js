import { Box, Stack, Typography } from '@mui/material';
import { useAvlTree, useRedBlackTree } from '@/hooks/data-structures';
import { useEffect } from 'react';
import { muteSounds } from '@/common/utils';
import DSInput from '@/components/common/ds-input';
import Link from 'next/link';

export default function AVLvsRedBlack(props) {
  const { animation: avlAnimation, buttons: avlButtons } = useAvlTree();
  const { animation: rbtAnimation, buttons: rbtButtons } = useRedBlackTree();

  avlButtons.splice(5, 1);
  avlButtons.splice(1, 1);

  useEffect(muteSounds, []);

  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        Both <strong>AVL Trees</strong> and <strong>Red-Black Trees</strong>{' '}
        keep themselves balanced so that searching stays fast. The difference is
        in how strict they are — <strong>AVL Trees</strong> stay more tightly
        balanced, which makes lookups slightly faster but requires more work when
        adding or removing values. <strong>Red-Black Trees</strong> are a bit
        more relaxed, so insertions and deletions are quicker. Try inserting the
        same values into both and see how each one balances itself. For a deeper
        look at how and why they differ, check out{' '}
        <Link href="/articles/avl-tree-vs-red-black">this article</Link>.
      </Typography>

      <Box display="flex" gap={4} flexWrap="wrap" alignItems="end">
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
