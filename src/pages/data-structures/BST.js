import { useEffect, useState } from 'react';
import { DSInput, Edge, Node } from '@/components/common';
import { Redo, Refresh, Share, Undo } from '@mui/icons-material';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { useAnimator, useSummary, useTreeUrl, useUndoRedo } from '@/hooks';
import { copyBinaryTree, randomNodes, showError, sleep } from '@/common/utils';
import { bstPrompt } from '@/common/prompts';
import binarySearchTree from '@/helpers/binarySearchTree';

const getPrompt = bstPrompt('Binary Search Tree');

var Tree;
var deleted = {};

export default function BST(props) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const history = useUndoRedo();

    async function* insert(num) {
        if (numbers.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = binarySearchTree(animator);
            deleted = {};
        }
        const prevNodes = Tree.collect();
        explain(getPrompt(prevNodes, 'Insert', num));
        history.push(prevNodes);
        deleted[num] = false;
        setNumbers([...numbers, num]);
        yield 500;
        yield* Tree.insert(num);
    }

    async function* remove(num) {
        if (numbers.includes(num)) deleted[num] = true;
        const prevNodes = Tree.collect();
        explain(getPrompt(prevNodes, 'Delete', num));
        yield 500;
        const affected = yield* Tree.deleteNode(num);
        if (affected !== undefined) {
            history.push(prevNodes);
            if (!Tree.root()) setNumbers([]);
        }
    }

    const newTree = async (nodes) => {
        setNumbers(nodes.slice());
        Tree = binarySearchTree(animator);
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

    const refresh = async () => {
        reset();
        await sleep(100);
        newTree(randomNodes());
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
