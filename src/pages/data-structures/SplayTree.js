import { useEffect, useState } from 'react';
import { copyBinaryTree, randomNodes, showError, sleep } from '@/common/utils';
import { Box, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node } from '@/components/common';
import { Refresh, Share } from '@mui/icons-material';
import useAnimator from '@/hooks/useAnimator';
import useTreeUrl from '@/hooks/useTreeUrl';
import splayTree from '@/helpers/splayTree';

var arr = [], Tree;
var deleted = {};

export default function SplayTree(props) {
    const [nodes, isReady] = useTreeUrl();
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();

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
            Tree = splayTree(animator);
        }
        yield* Tree.insert(num);
    };

    async function* search(num) {
        yield 500;
        yield* Tree.search(num);
    };

    // async function* remove(num) {
    //     if (arr.includes(num)) deleted[num] = true;
    //     yield 500;
    //     yield* Tree.deleteNode(num);
    //     if (!Tree.root()) reset();
    // };

    const reset = () => {
        setNumbers([]);
        arr = [];
        deleted = {};
    };

    const refresh = async () => {
        reset();
        await sleep(100);
        newTree(randomNodes());
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Search',
            onClick: search,
            validate: true,
            disabled: !arr.length,
        },
        { text: 'Clear', onClick: reset, disabled: !arr.length },
        { text: <Refresh />, onClick: refresh, title: 'New tree' },
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
        Tree = splayTree(animator);
        await sleep(100);
        nodes.forEach((num) => Tree._insert(num));
    };

    useEffect(() => {
        if (isReady) newTree(nodes || randomNodes());
    }, [nodes, isReady]);

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                A <strong>Splay Tree</strong> is a self-balancing binary search
                tree that always moves the most recently accessed element to the
                root. This ensures that the most frequently accessed elements are
                quickly accessible, making it an efficient data structure for
                applications where frequent access to recently used elements is
                common.
            </Typography>
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
                    />
                ))}
            </Box>
        </Stack>
    );
}
