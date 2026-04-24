import { Box, Divider, Stack, Typography } from '@mui/material';
import DSInput from '@/components/common/ds-input';
import useBTree from '@/hooks/data-structures/useBTree';

export default function BTree(props) {
  const { animation, buttons, summary } = useBTree();

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>B-Tree</strong> is a self-balancing search tree
                designed to maintain sorted data and allow efficient insertion,
                deletion, and search operations. Unlike binary trees, each node
                can hold multiple keys and have more than two children. B-Trees
                are widely used in databases and file systems where large blocks
                of data must be read and written efficiently.
            </Typography>
            <Typography variant="h6" component="h2">
                How it Works
            </Typography>
            <Typography
                component="ul"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <li>
                    <strong>Insertion:</strong> A new key is inserted into the
                    appropriate leaf node. If the node overflows (exceeds the
                    maximum number of keys), it splits: the median key is pushed
                    up to the parent, and the remaining keys form two child
                    nodes. This process may propagate upward, potentially
                    creating a new root.
                </li>
                <li>
                    <strong>Splitting:</strong> Observe how existing keys are
                    pushed down while the median key rises to the parent. This
                    keeps the tree balanced — all leaves always remain at the
                    same depth.
                </li>
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={3}>
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        Visualizer
                    </Typography>
                    <DSInput {...props} buttons={buttons} />
                    {animation}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        For simplicity, the order of this B-Tree visualizer is
                        fixed to 3.
                    </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem />
                {summary}
            </Box>
        </Stack>
    );
}
