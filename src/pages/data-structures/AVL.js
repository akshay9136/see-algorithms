import { Box, Divider, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import DSInput from '@/components/common/ds-input';
import useAvlTree from '@/hooks/data-structures/useAvlTree';

export default function AVL(props) {
    const { algorithm, animation, buttons, summary } = useAvlTree();

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                Named after its inventors Adelson-Velsky and Landis, an{' '}
                <strong>AVL Tree</strong> rigorously maintains balance by
                ensuring that for every node, the difference between the heights
                of its left and right subtrees is never more than 1. If an
                operation violates this condition, the tree automatically
                rebalances itself through a series of rotations. This ensures
                that operations like search, insert, and delete have a
                worst-case time complexity of O(log n).
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                <Box flex={1}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        How it Works
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Every time a node is inserted or deleted, the AVL tree
                        checks the <strong>balance factor</strong> of each
                        affected node. If a node becomes unbalanced, rotations
                        are performed to restore balance. There are four types
                        of rotations:
                    </Typography>
                    <Typography
                        component="ul"
                        variant="body1"
                        sx={{ '& li': { mb: 1 } }}
                    >
                        <li>
                            <strong>Right Rotation (LL)</strong> – Applied when
                            a left child’s left subtree causes imbalance.
                        </li>
                        <li>
                            <strong>Left Rotation (RR)</strong> – Applied when a
                            right child’s right subtree causes imbalance.
                        </li>
                        <li>
                            <strong>Left-Right Rotation (LR)</strong> – Applied
                            when a left child’s right subtree causes imbalance.
                        </li>
                        <li>
                            <strong>Right-Left Rotation (RL)</strong> – Applied
                            when a right child’s left subtree causes imbalance.
                        </li>
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box flex={1}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Step by Step
                    </Typography>
                    <Typography
                        component="ol"
                        variant="body1"
                        sx={{ '& li': { mb: 1 }, pl: 2 }}
                    >
                        <li>
                            Insert or delete a node like in a normal{' '}
                            <Link href="/data-structures/BST">BST</Link>.
                        </li>
                        <li>
                            Traverse back up to the root, updating height and
                            checking the balance factor of each ancestor.
                        </li>
                        <li>
                            If a node is unbalanced, identify the type of
                            rotation needed (LL, RR, LR, RL).
                        </li>
                        <li>
                            Perform the rotation to restore the AVL property.
                        </li>
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <Box display="flex" gap={4} flexWrap="wrap">
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        Pseudocode
                    </Typography>
                    {algorithm}
                </Stack>
                <Stack spacing={2}>
                    <DSInput {...props} buttons={buttons} />
                    {animation}
                    <br />
                    {summary}
                </Stack>
            </Box>
        </Stack>
    );
}
