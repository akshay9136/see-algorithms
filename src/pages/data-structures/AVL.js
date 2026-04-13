import { useEffect, useState } from 'react';
import { DSInput, Edge, Node } from '@/components/common';
import { Redo, Refresh, Share, Undo } from '@mui/icons-material';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import {
    useAlgorithm,
    useAnimator,
    useSummary,
    useTreeUrl,
    useUndoRedo,
} from '@/hooks';
import avlTree from '@/helpers/avlTree';
import Link from 'next/link';

var Tree;
var deleted = {};

export default function AVL(props) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const history = useUndoRedo();
    const [algorithm, setCurrentStep] = useAlgorithm(`
function rebalance(node):
    updateHeight(node)
    nodeBf = balanceFactor(node)
    if nodeBf > 1:
        if balanceFactor(node.left) > 0:
            rotateRight(node)
        else:
            rotateLeft(node.left)
            rotateRight(node)
    if nodeBf < -1:
        if balanceFactor(node.right) < 0:
            rotateLeft(node)
        else:
            rotateRight(node.right)
            rotateLeft(node)
    if node.parent:
        rebalance(node.parent)
`);

    async function* insert(num) {
        if (numbers.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = avlTree(animator, setCurrentStep);
            deleted = {};
        }
        const keys = Tree.collect();
        explain({ keys, operation: 'Insert', input: num });
        history.push(keys);
        deleted[num] = false;
        setNumbers([...numbers, num]);
        yield 500;
        yield* Tree.insert(num);
    }

    async function* remove(num) {
        if (numbers.includes(num)) deleted[num] = true;
        const keys = Tree.collect();
        explain({ keys, operation: 'Delete', input: num });
        yield 500;
        const affected = yield* Tree.deleteNode(num);
        if (affected !== undefined) {
            history.push(keys);
            if (!Tree.root()) setNumbers([]);
        }
    }

    const newTree = async (nodes) => {
        setNumbers(nodes.slice());
        Tree = avlTree(animator, setCurrentStep);
        deleted = {};
        await sleep(100);
        nodes.forEach((num) => Tree._insert(num));
    };

    const handleUndo = async () => {
        if (history.canUndo) {
            setNumbers([]);
            await sleep(100);
            newTree(history.undo(Tree.collect()));
        }
    };

    const handleRedo = async () => {
        if (history.canRedo) {
            setNumbers([]);
            await sleep(100);
            newTree(history.redo(Tree.collect()));
        }
    };

    const reset = () => {
        setNumbers([]);
        history.clear();
        abort();
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Delete',
            onClick: remove,
            validate: true,
            disabled: !numbers.length,
        },
        {
            text: 'Clear',
            onClick: reset,
            disabled: !numbers.length,
        },
        {
            text: <Undo />,
            onClick: handleUndo,
            title: 'Undo',
            disabled: !history.canUndo,
        },
        {
            text: <Redo />,
            onClick: handleRedo,
            title: 'Redo',
            disabled: !history.canRedo,
        },
        // { text: <Refresh />, onClick: refresh, title: 'New tree' },
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(Tree.collect()),
            disabled: !numbers.length,
            title: 'Share this tree',
        },
    ];

    useEffect(() => {
        if (nodes) newTree(nodes);
    }, [nodes]);

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
            <Box display="flex" gap={4} flexWrap="wrap">
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

                    <Paper ref={scope} className="resizable" id="binaryTree">
                        {numbers.slice(1).map((_, i) => (
                            <Edge key={i} index={i} />
                        ))}
                        {numbers.map((num, i) => (
                            <Node
                                key={i}
                                index={i}
                                value={num}
                                style={{ opacity: 0 }}
                                showBf
                            />
                        ))}
                    </Paper>
                    <br />
                    {summary}
                </Stack>
            </Box>
        </Stack>
    );
}
