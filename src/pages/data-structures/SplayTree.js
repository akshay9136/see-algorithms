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
    }

    async function* search(num) {
        yield 500;
        yield* Tree.search(num);
    }

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
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>Splay Tree</strong> is a self-adjusting binary search
                tree that reshapes itself based on how it’s used. Instead of
                trying to stay balanced all the time, it aggressively moves
                recently accessed nodes closer to the root. The idea is simple:
                if you touched it, you’ll probably touch it again. Over time,
                the tree adapts to access patterns rather than an abstract
                notion of balance.
            </Typography>
            <Typography variant="h6" component="h2">
                How it Works
            </Typography>
            <Typography
                component="div"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <ul>
                    <li>
                        When you search, insert, or delete a node, the tree
                        performs a series of rotations called{' '}
                        <strong>splaying</strong> to bring that node to the
                        root.
                    </li>
                    <li>
                        There are three types of rotations depending on the
                        node’s position: <strong>zig</strong> (single rotation),{' '}
                        <strong>zig-zig</strong> (double rotation in same
                        direction), and <strong>zig-zag</strong> (double
                        rotation in opposite directions).
                    </li>
                    <li>
                        After splaying, frequently accessed nodes stay near the
                        root, making repeated operations faster.
                    </li>
                </ul>
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
