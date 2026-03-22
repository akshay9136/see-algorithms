import { useEffect, useState } from 'react';
import { DSInput, Edge, Node } from '@/components/common';
import { Redo, Refresh, Share, Undo } from '@mui/icons-material';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { useAnimator, useSummary, useTreeUrl, useUndoRedo } from '@/hooks';
import { copyBinaryTree, randomNodes, showError, sleep } from '@/common/utils';
import { bstPrompt } from '@/common/prompts';
import splayTree from '@/helpers/splayTree';

const getPrompt = bstPrompt('Splay Tree');

var arr = [], Tree;
var deleted = {};

export default function SplayTree(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const [summary, explain] = useSummary();
    const history = useUndoRedo();

    async function* insert(num) {
        if (arr.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = splayTree(animator);
            deleted = {};
            arr = [];
        }
        const prevNodes = Tree.collect();
        explain(getPrompt(prevNodes, 'Insert', num));
        history.push(Tree.collect());
        deleted[num] = false;
        arr.push(num);
        setNumbers(arr.slice());
        yield 500;
        yield* Tree.insert(num);
    }

    async function* search(num) {
        const prevNodes = Tree.collect();
        explain(getPrompt(prevNodes, 'Search', num));
        history.push(prevNodes);
        yield 500;
        yield* Tree.search(num);
    }

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

    const refresh = async () => {
        setNumbers([]);
        history.clear();
        await sleep(100);
        newTree(randomNodes());
    };

    const reset = () => {
        setNumbers([]);
        history.clear();
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
                    position:
                    <Typography
                        component="ul"
                        variant="body1"
                        sx={{ mt: 2, mb: 2.5, pl: 3 }}
                    >
                        <li>
                            <strong>zig</strong> rotation occurs when the node
                            is a child of the root (single rotation).
                        </li>
                        <li>
                            <strong>zig-zig</strong> rotation occurs when the
                            node and its parent are on the same side (double
                            rotation in same direction).
                        </li>
                        <li>
                            <strong>zig-zag</strong> rotation occurs when the
                            node and its parent are on opposite sides (double
                            rotation in opposite directions).
                        </li>
                    </Typography>
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
                            />
                        ))}
                    </Paper>
                </Stack>
                <Divider orientation="vertical" flexItem />
                {summary}
            </Box>
        </Stack>
    );
}
