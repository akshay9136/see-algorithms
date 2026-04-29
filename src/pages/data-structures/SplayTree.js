import { Box, Divider, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import DSInput from '@/components/common/ds-input';
import useSplayTree from '@/hooks/data-structures/useSplayTree';

export default function SplayTree(props) {
    const { animation, buttons, summary } = useSplayTree();

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>Splay Tree</strong> is a self-adjusting binary search
                tree that reshapes itself based on how it’s used. Instead of
                trying to stay balanced all the time, it aggressively moves
                recently accessed nodes closer to the root. The idea is simple:
                if you touched it, you’ll probably touch it again. Over time,
                the tree adapts to access patterns rather than an abstract
                notion of balance. While <Link href="/data-structures/AVL">AVL Trees</Link> follow
                strict rules to stay perfectly balanced, Splay Trees focus on
                being fast over time.
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
                    When you search, insert, or delete a node, the tree performs
                    a series of rotations called <strong>splaying</strong> to
                    bring that node to the root.
                </li>
                <li>
                    There are three types of rotations depending on the node’s
                    position: <strong>zig</strong> (single rotation),{' '}
                    <strong>zig-zig</strong> (double rotation in same
                    direction), and <strong>zig-zag</strong> (double rotation in
                    opposite directions).
                </li>
                <li>
                    After splaying, frequently accessed nodes stay near the
                    root, making repeated operations faster.
                </li>
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={3}>
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        Visualizer
                    </Typography>
                    <DSInput {...props} buttons={buttons} />
                    {animation}
                </Stack>
                <Divider orientation="vertical" flexItem />
                {summary}
            </Box>
        </Stack>
    );
}
