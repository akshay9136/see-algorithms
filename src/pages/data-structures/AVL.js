import { useEffect, useState } from 'react';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import { Box, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node } from '@/components/common';
import { Refresh, Share } from '@mui/icons-material';
import useAlgorithm from '@/hooks/useAlgorithm';
import useAnimator from '@/hooks/useAnimator';
import useTreeUrl from '@/hooks/useTreeUrl';
import binaryAvlTree from '@/helpers/binaryAvlTree';
import Link from 'next/link';

var arr = [], Tree;
var deleted = {};

export default function AVL(props) {
    const [nodes, isReady] = useTreeUrl();
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
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
        if (arr.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        deleted[num] = false;
        arr.push(num);
        setNumbers(arr.slice());
        yield 500;
        if (!numbers.length) {
            Tree = binaryAvlTree(animator, setCurrentStep);
        }
        yield* Tree.insert(num);
    }

    async function* remove(num) {
        if (arr.includes(num)) deleted[num] = true;
        yield 500;
        yield* Tree.deleteNode(num);
        if (!Tree.root()) reset();
    }

    const reset = () => {
        setNumbers([]);
        arr = [];
        deleted = {};
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Delete',
            onClick: remove,
            validate: true,
            disabled: !arr.length,
        },
        { text: 'Clear', onClick: reset, disabled: !arr.length },
        // { text: <Refresh />, onClick: refresh, title: 'New tree' },
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(Tree.root()),
            disabled: !arr.length,
            title: 'Share this tree',
        },
    ];

    const newTree = async (nodes) => {
        arr = nodes.slice();
        setNumbers(arr.slice());
        Tree = binaryAvlTree(animator, setCurrentStep);
        await sleep(100);
        nodes.forEach((num) => Tree._insert(num));
    };

    useEffect(() => {
        if (nodes) newTree(nodes);
    }, [nodes]);

    return (
        <Stack spacing={2}>
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
            <Typography variant="h6" component="h2">
                How it Works
            </Typography>
            <Typography variant="body1">
                Every time a node is inserted or deleted, the AVL tree checks
                the <strong>balance factor</strong> of each affected node. If a
                node becomes unbalanced, rotations are performed to restore
                balance. There are four types of rotations:
            </Typography>
            <Typography
                component="ul"
                variant="body1"
                sx={{ '& li': { mb: 1 }, mb: 0 }}
            >
                <li>
                    <strong>Right Rotation (LL)</strong> – Applied when a left
                    child’s left subtree causes imbalance.
                </li>
                <li>
                    <strong>Left Rotation (RR)</strong> – Applied when a right
                    child’s right subtree causes imbalance.
                </li>
                <li>
                    <strong>Left-Right Rotation (LR)</strong> – Applied when a
                    left child’s right subtree causes imbalance.
                </li>
                <li>
                    <strong>Right-Left Rotation (RL)</strong> – Applied when a
                    right child’s left subtree causes imbalance.
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Step by Step
            </Typography>
            <Typography
                component="ol"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <li>
                    Insert or delete a node like in a normal{' '}
                    <Link href="/data-structures/BST">
                        <strong>BST</strong>.
                    </Link>
                </li>
                <li>
                    Traverse back up to the root, updating height and checking
                    the balance factor of each ancestor.
                </li>
                <li>
                    If a node is unbalanced, identify the type of rotation
                    needed (LL, RR, LR, RL).
                </li>
                <li>Perform the rotation to restore the AVL property.</li>
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                {algorithm}
                <Stack spacing={2}>
                    <DSInput {...props} buttons={buttons} />
                    <Box ref={scope} className="resizable" id="binaryTree">
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
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
