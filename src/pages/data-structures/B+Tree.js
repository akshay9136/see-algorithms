import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedDataList } from '@/components/common';
import useSavedData from '@/hooks/useSavedData';
import useBPlusTree from '@/hooks/data-structures/useBPlusTree';
import Link from 'next/link';

export default function BPlusTree(props) {
  const { saveData, ...rest } = useSavedData();
  const { animation, buttons, summary, refresh } = useBPlusTree({ saveData });

  return (
    <>
      <Typography paragraph>
        A <strong>B+ Tree</strong> is a self-balancing search tree and a variant
        of the <Link href="/data-structures/BTree">B-Tree</Link>. Like a B-Tree,
        each internal node can hold multiple keys and have more than two
        children. The key difference is that in a B+ Tree{' '}
        <strong>all data records are stored only in the leaf nodes</strong>,
        while internal nodes act purely as routing guides. Leaf nodes are also
        connected in a <strong>linked list</strong> (shown by the dashed green
        arrows), enabling efficient range queries without traversing the tree.
      </Typography>

      <Typography>
        When inserting a new key, it is placed into the appropriate leaf node.
        If the leaf overflows, it <strong>splits</strong> — the smallest key of
        the right half is <strong>copied</strong> (not moved) up to the parent
        as a separator, so the key remains in the leaf. This copying behaviour
        is what distinguishes a B+ Tree from a B-Tree. Internal nodes split
        using the traditional median-push approach. The splitting process can
        propagate upward and may create a new root, always keeping all leaves at
        the same depth.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <DSInput {...props} buttons={buttons} />
          {animation}
          <Typography variant="body2" color="text.secondary" mt={1}>
            For simplicity, the order of this B+ Tree visualizer is fixed to 3.
          </Typography>
        </Stack>
        {summary}
      </Box>
      <SavedDataList onSelect={refresh} {...rest} />
    </>
  );
}
