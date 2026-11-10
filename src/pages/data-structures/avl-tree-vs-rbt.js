import { AdUnit, TreeInput } from '@/components/common';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useBinaryTree } from '@/hooks/data-structures';
import { useBreakpoints } from '@/hooks';
import { muteSounds, randomKeys } from '@/common/utils';
import avlTree from '@/helpers/avlTree';
import redBlackTree from '@/helpers/redBlackTree';
import Link from 'next/link';

export default function AVLvsRedBlack(props) {
  const randomNodes = randomKeys();
  const { lgup, xxldown } = useBreakpoints();

  const { animation: avlAnimation, buttons: avlButtons } = useBinaryTree({
    createTree: (animator) => avlTree(animator, () => {}),
    hideButtons: ['Search'],
    treeType: 'avl',
    randomNodes,
  });

  const { animation: rbtAnimation, buttons: rbtButtons } = useBinaryTree({
    createTree: (animator) => redBlackTree(animator),
    hideButtons: ['Search'],
    treeType: 'red-black',
    randomNodes,
  });

  // remove last 2 buttons (Save and Share)
  avlButtons.splice(6, 2);

  useEffect(muteSounds, []);

  return (
    <>
      <Typography paragraph>
        Both <Link href="/data-structures/AVL">AVL Trees</Link> and{' '}
        <Link href="/data-structures/RedBlackTree">Red-Black Trees</Link> keep
        themselves balanced so that searching stays fast. The difference is in
        how strict they are — <strong>AVL Trees</strong> stay more tightly
        balanced, which makes lookups slightly faster but requires more work
        when adding or removing values. <strong>Red-Black Trees</strong> are a
        bit more relaxed, so insertions and deletions are quicker. Try inserting
        the same values into both and see how each one balances itself.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" gap={3}>
        <Box display="flex" flexWrap="wrap" gap={4} alignItems="end">
          <Stack spacing={2}>
            <TreeInput
              {...props}
              buttons={avlButtons}
              allButtons={[...avlButtons, ...rbtButtons]}
            />
            {avlAnimation}
          </Stack>
          {rbtAnimation}
        </Box>
        {lgup && xxldown && <AdUnit fullWidth="true" />}
      </Box>
    </>
  );
}
