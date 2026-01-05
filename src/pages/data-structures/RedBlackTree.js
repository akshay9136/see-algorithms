import { useEffect, useState } from 'react';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import { Box, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node } from '@/components/common';
import { Share } from '@mui/icons-material';
import redBlackTree from '@/helpers/redBlackTree';
import useAnimator from '@/hooks/useAnimator';
import useTreeUrl from '@/hooks/useTreeUrl';

var arr = [], Tree;
var deleted = {};

export default function RedBlackTree(props) {
    const [nodes] = useTreeUrl();
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();

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
            Tree = redBlackTree(animator);
        }
        yield* Tree.insert(num);
    }

    // async function* remove(num) {
    //     if (arr.includes(num)) deleted[num] = true;
    //     yield 500;
    //     yield* Tree.deleteNode(num);
    //     if (!Tree.root()) setNumbers([]);
    // }

    const reset = () => setNumbers([]);

    if (!numbers.length) {
        arr = [];
        deleted = {};
    }

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        { text: 'Clear', onClick: reset, disabled: !arr.length },
        {
            text: <Share fontSize="small" />,
            onClick: () =>
                copyBinaryTree(Tree.root(), (x) => [x.value, x.color]),
            disabled: !arr.length,
        },
    ];

    useEffect(() => {
        if (nodes) insertAll(nodes);
    }, [nodes]);

    const insertAll = async (nodes) => {
        arr = nodes.map((x) => x[0]);
        setNumbers(arr.slice());
        Tree = redBlackTree(animator);
        await sleep(100);
        nodes.forEach((x) => Tree._insert(...x));
    };

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                A <strong>Red-Black Tree</strong> is a self-balancing binary
                search tree where each node has an additional color property
                (red or black). The tree maintains balance through five key
                properties: the root is always black, all leaves (null nodes)
                are black, <strong>red nodes cannot have red children</strong>,
                and every path from a node to its descendant leaves contains the
                same number of black nodes. These rules ensure that the tree
                remains approximately balanced, guaranteeing O(log n) time
                complexity for search, insert, and delete operations.
            </Typography>
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
        </Stack>
    );
}
