import { Box, Divider, Stack, Typography } from '@mui/material';
import { DSInput, SavedItems, Section } from '@/components/common';
import useSavedData from '@/hooks/useSavedData';
import useBTree from '@/hooks/data-structures/useBTree';
import Link from 'next/link';

export default function BTree(props) {
  const { saveData, ...rest } = useSavedData();
  const { animation, buttons, summary, refresh } = useBTree({ saveData });

  return (
    <>
      <Typography paragraph>
        A <strong>B-Tree</strong> is a self-balancing search tree designed to
        maintain sorted data and allow efficient insertion, deletion, and search
        operations. Unlike <Link href="/data-structures/BST">binary trees</Link>
        , each node can hold multiple keys and have more than two children.
        B-Trees are widely used in databases and file systems where large blocks
        of data must be read and written efficiently.
      </Typography>

      <Typography variant="body1">
        When inserting a new key, it is placed into the appropriate leaf node.
        If the node overflows by exceeding the maximum number of keys, it{' '}
        <strong>splits</strong> — the median key is pushed up to the parent,
        while the remaining keys form two child nodes. This process can
        propagate upward and may even create a new root. This splitting
        mechanism is essential for keeping the tree balanced, ensuring that all
        leaves always remain at the same depth as keys are redistributed.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Stack spacing={2}>
          <DSInput {...props} buttons={buttons} />
          {animation}
          <Typography variant="body2" sx={{ mt: 1 }}>
            For simplicity, the order of this B-Tree visualizer is fixed to 3.
          </Typography>
        </Stack>
        {summary}
      </Box>
      <SavedItems onSelect={refresh} {...rest} />
    </>
  );
}
