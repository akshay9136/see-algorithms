import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedDataList } from '@/components/common';
import { useBinaryTree } from '@/hooks/data-structures';
import { useSavedData } from '@/hooks';
import splayTree from '@/helpers/splayTree';

export default function SplayTree(props) {
  const { saveData, ...saveDataProps } = useSavedData();
  const { animation, summary, buttons, refresh } = useBinaryTree({
    createTree: splayTree,
    hideButtons: ['Delete'],
    treeType: 'splay',
    saveData,
  });

  return (
    <>
      <Typography paragraph>
        A <strong>Splay Tree</strong> is a self-adjusting binary search tree
        that reshapes itself based on how it’s used. Instead of trying to stay
        balanced all the time, it aggressively moves recently accessed nodes
        closer to the root. The idea is simple: if you touched it, you’ll
        probably touch it again. Over time, the tree adapts to access patterns
        rather than an abstract notion of balance.
      </Typography>

      <Typography paragraph>
        When you search, insert, or delete a node, the tree performs a series of
        rotations called {'"splaying"'} to bring that node to the root. There
        are three types of rotations depending on the node’s position:{' '}
        <strong>Zig</strong> (single rotation), <strong>Zig-Zig</strong> (double
        rotation in same direction), and <strong>Zig-Zag</strong> (double
        rotation in opposite directions). After splaying, frequently accessed
        nodes stay near the root, making repeated operations faster.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <DSInput {...props} buttons={buttons} />
          {animation}
        </Stack>
        {summary}
      </Box>

      <SavedDataList onSelect={refresh} {...saveDataProps} />
    </>
  );
}
