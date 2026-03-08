import { useEffect, useState } from 'react';
import { DSInput, Edge, Node } from '@/components/common';
import { Paper, Stack, Typography } from '@mui/material';
import { Redo, Refresh, Share, Undo } from '@mui/icons-material';
import { copyBinaryTree, randomNodes, sleep } from '@/common/utils';
import binarySearchTree from '@/helpers/binarySearchTree';
import useAnimator from '@/hooks/useAnimator';
import useTreeUrl from '@/hooks/useTreeUrl';
import useUndoRedo from '@/hooks/useUndoRedo';

var arr = [], Tree;

export default function BST(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const history = useUndoRedo();

    async function* insert(num) {
        if (!numbers.length) {
            Tree = binarySearchTree(animator);
            arr = [];
        }
        history.push(Tree.collect());
        arr.push(num);
        setNumbers(arr.slice());
        yield 500;
        yield* Tree.insert(num);
    }

    async function* remove(num) {
        yield 500;
        const prevNodes = Tree.collect();
        const affected = yield* Tree.deleteNode(num);
        if (affected !== undefined) {
            history.push(prevNodes);
            if (!Tree.root()) setNumbers([]);
        }
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

    const reset = () => {
        setNumbers([]);
        history.clear();
    };

    const refresh = async () => {
        setNumbers([]);
        history.clear();
        await sleep(100);
        newTree(randomNodes());
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Delete',
            onClick: remove,
            validate: true,
            disabled: !numbers.length,
        },
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
        { text: <Refresh />, onClick: refresh, title: 'New tree' },
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(Tree.collect()),
            disabled: !numbers.length,
            title: 'Share this tree',
        },
    ];

    const newTree = async (nodes) => {
        arr = nodes.slice();
        setNumbers(arr.slice());
        Tree = binarySearchTree(animator);
        await sleep(100);
        nodes.forEach((num) => Tree._insert(num));
    };

    useEffect(() => {
        if (isReady) newTree(nodes || randomNodes());
    }, [nodes, isReady]);

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>Binary Search Tree</strong> (BST) is like a
                well-organized library where each book (node) has a clear place
                based on its value. In a BST, each node has up to two children:
                the left child holds smaller values, and the right child holds
                larger values. This structure allows for efficient searching,
                adding, and removing of books, as you can quickly navigate left
                or right to find or insert a book in its proper place.
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
                    <strong>Insertion</strong> walks down the tree by repeatedly
                    choosing left or right based on comparison, stopping only
                    when it finds an empty spot. The new node is attached as a
                    leaf.
                </li>
                <li>
                    <strong>Deletion</strong> first locates the target node,
                    then carefully reconnects its children so the BST rule still
                    holds. If the node has no children, it is simply removed. If
                    it has one child, that child takes its place. If the node
                    has two children, the tree replaces it with a nearby node
                    that preserves ordering.
                </li>
            </Typography>
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
    );
}
