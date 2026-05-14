import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedDataList } from '@/components/common';
import useSavedData from '@/hooks/useSavedData';
import useSplayTree from '@/hooks/data-structures/useSplayTree';
import Link from 'next/link';

export default function SplayTree(props) {
  const { saveData, ...rest } = useSavedData();
  const { animation, buttons, summary, refresh } = useSplayTree({ saveData });

  return (
    <>
      <Typography paragraph>
        A <strong>Splay Tree</strong> is a self-adjusting binary search tree
        that reshapes itself based on how it’s used. Instead of trying to stay
        balanced all the time, it aggressively moves recently accessed nodes
        closer to the root. The idea is simple: if you touched it, you’ll
        probably touch it again. Over time, the tree adapts to access patterns
        rather than an abstract notion of balance. While{' '}
        <Link href="/data-structures/AVL">AVL Trees</Link> follow strict rules
        to stay perfectly balanced, Splay Trees focus on being fast over time.
      </Typography>

      <Typography paragraph>
        When you search, insert, or delete a node, the tree performs a series of
        rotations called <strong>splaying</strong> to bring that node to the
        root. There are three types of rotations depending on the node’s
        position: <strong>zig</strong> (single rotation),{' '}
        <strong>zig-zig</strong> (double rotation in same direction), and{' '}
        <strong>zig-zag</strong> (double rotation in opposite directions). After
        splaying, frequently accessed nodes stay near the root, making repeated
        operations faster.
      </Typography>
      <Divider sx={{ my: 3 }} />

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
