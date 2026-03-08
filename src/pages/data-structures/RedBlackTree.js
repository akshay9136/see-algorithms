import { useEffect, useState } from 'react';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import { Paper, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node } from '@/components/common';
import { Redo, Share, Undo } from '@mui/icons-material';
import useAnimator from '@/hooks/useAnimator';
import useTreeUrl from '@/hooks/useTreeUrl';
import useUndoRedo from '@/hooks/useUndoRedo';
import redBlackTree from '@/helpers/redBlackTree';
import Link from 'next/link';

var arr = [], Tree;
var deleted = {};

export default function RBT(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const history = useUndoRedo();

    async function* insert(num) {
        if (arr.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = redBlackTree(animator);
            deleted = {};
            arr = [];
        }
        history.push(Tree.collect((a) => [a.value, a.color]));
        deleted[num] = false;
        arr.push(num);
        setNumbers(arr.slice());
        yield 500;
        yield* Tree.insert(num);
    }

    const handleUndo = async () => {
        if (history.canUndo) {
            setNumbers([]);
            await sleep(100);
            const nodes = Tree.collect((a) => [a.value, a.color]);
            newTree(history.undo(nodes));
        }
    };

    const handleRedo = async () => {
        if (history.canRedo) {
            setNumbers([]);
            await sleep(100);
            const nodes = Tree.collect((a) => [a.value, a.color]);
            newTree(history.redo(nodes));
        }
    };

    const handleCopy = () => {
        const nodes = Tree.collect((a) => [a.value, a.color]);
        copyBinaryTree(nodes);
    };

    const reset = () => {
        setNumbers([]);
        history.clear();
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        { text: 'Clear', onClick: reset, disabled: !numbers.length },
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
            onClick: handleCopy,
            disabled: !numbers.length,
            title: 'Share this tree',
        },
    ];

    const newTree = async (nodes) => {
        arr = nodes.map((x) => x[0]);
        setNumbers(arr.slice());
        Tree = redBlackTree(animator);
        await sleep(100);
        nodes.forEach((x) => Tree._insert(...x));
    };

    useEffect(() => {
        if (nodes) newTree(nodes);
    }, [nodes]);

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>Red-Black Tree</strong> is a self-balancing binary
                search tree where each node has a color – either red or black.
                These colors enforce rules that keep the tree roughly balanced,
                ensuring that the longest path from root to a leaf is no more
                than twice the shortest path. This guarantees predictable
                performance for searches, insertions, and deletions.
            </Typography>
            <Typography variant="h6" component="h2">
                How it Works
            </Typography>
            <Typography>
                When a node is inserted or deleted, the tree may temporarily
                violate its color rules. To restore balance, the tree uses a
                combination of recoloring and rotations. It maintains balance
                through four key properties: the root is always black, all
                leaves (null nodes) are black,{' '}
                <strong>red nodes cannot have red children</strong>, and every
                path from a node to its descendant leaves contains the same
                number of black nodes.
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
                    Insert a node like in a normal{' '}
                    <Link href="/data-structures/BST">BST</Link> and color it
                    red.
                </li>
                <li>Check the tree for violations of Red-Black rules.</li>
                <li>
                    If there’s a violation, apply rotations (left or right) and
                    recoloring to restore properties.
                </li>
                <li>
                    Repeat until all rules are satisfied from the modified node
                    to the root.
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Visualizer
            </Typography>
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
            </Stack>
        </Stack>
    );
}
