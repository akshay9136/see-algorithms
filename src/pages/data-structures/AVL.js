import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Edge, Node } from '@/components/numbers';
import DSInput from '@/components/ds-input';
import avlTree from '@/helpers/avlTree';
import useAlgorithm from '@/hooks/useAlgorithm';
import useAnimator from '@/hooks/useAnimator';
import { copyBST, sleep } from '@/common/utils';
import { showToast } from '@/components/toast';
import { useRouter } from 'next/router';
import { Share } from '@mui/icons-material';

var arr = [], Tree;
var deleted = {};

export default function AVL(props) {
    const router = useRouter();
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

    if (!numbers.length) {
        arr = [];
        deleted = {};
    }

    const insert = async (num) => {
        if (arr.includes(num) && !deleted[num]) {
            showToast({
                message: 'Duplicates are not allowed.',
                variant: 'error',
            });
            return;
        }
        deleted[num] = false;
        arr.push(num);
        setNumbers(arr.slice());
        await sleep(500);
        if (!numbers.length) {
            Tree = avlTree(animator, setCurrentStep);
        }
        await Tree.insert(num);
    };

    const remove = async (num) => {
        if (arr.includes(num)) deleted[num] = true;
        await sleep(500);
        await Tree.deleteNode(num);
        if (!Tree.root()) reset();
    };

    const reset = () => setNumbers([]);

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
            onClick: () => copyBST(Tree.root()),
            disabled: !arr.length,
        },
    ];

    useEffect(() => {
        if (router.isReady && !arr.length) {
            const { nodes } = router.query;
            try {
                if (nodes) {
                    arr = JSON.parse(atob(nodes));
                    insertAll();
                }
            } catch {}
        }
    }, [router]);

    const insertAll = async () => {
        setNumbers(arr.slice());
        Tree = avlTree(animator, setCurrentStep);
        await sleep(100);
        arr.forEach((num) => Tree._insert(num));
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
                        {numbers.slice(0, -1).map((_, i) => (
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
