import { useEffect, useState } from 'react';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import { Box, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node } from '@/components/common';
import { Share } from '@mui/icons-material';
import binaryAvlTree from '@/helpers/binaryAvlTree';
import useAlgorithm from '@/hooks/useAlgorithm';
import useAnimator from '@/hooks/useAnimator';
import useTreeUrl from '@/hooks/useTreeUrl';

var arr = [], Tree;
var deleted = {};

export default function AVL(props) {
    const [nodes] = useTreeUrl();
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
            showError('Duplicates are not allowed.');
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
    };

    async function* remove(num) {
        if (arr.includes(num)) deleted[num] = true;
        yield 500;
        yield* Tree.deleteNode(num);
        if (!Tree.root()) setNumbers([]);
    };

    const reset = () => setNumbers([]);

    if (!numbers.length) {
        arr = [];
        deleted = {};
    }

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Delete',
            onClick: remove,
            validate: true,
            disabled: !arr.length,
        },
        { text: 'Clear', onClick: reset, disabled: !arr.length },
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(Tree.root()),
            disabled: !arr.length,
        },
    ];

    useEffect(() => {
        if (nodes) insertAll(nodes);
    }, [nodes]);

    const insertAll = async (nodes) => {
        arr = nodes.slice();
        setNumbers(arr.slice());
        Tree = binaryAvlTree(animator, setCurrentStep);
        await sleep(100);
        nodes.forEach((num) => Tree._insert(num));
    };

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                Named after its inventors Adelson-Velsky and Landis, an{' '}
                <strong>AVL Tree</strong> rigorously maintains balance by
                ensuring that for every node, the difference between the heights
                of its left and right subtrees (known as the &quot;balance
                factor&quot;) is never more than 1 or less than -1. If an
                operation violates this condition, the tree automatically
                rebalances itself through a series of rotations. This ensures
                that operations like search, insert, and delete have a
                worst-case time complexity of O(log n).
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
