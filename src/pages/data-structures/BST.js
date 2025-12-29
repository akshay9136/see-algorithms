import { useEffect, useState } from 'react';
import { copyBinaryTree, randomInt, sleep } from '@/common/utils';
import { Box, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node } from '@/components/common';
import { Refresh, Share } from '@mui/icons-material';
import { useRouter } from 'next/router';
import binarySearchTree from '@/helpers/binarySearchTree';
import useAnimator from '@/hooks/useAnimator';

var arr = [], Tree;

const randomNodes = () => [
    randomInt(),
    randomInt(),
    randomInt(),
    randomInt(),
    randomInt(),
    randomInt(),
];

export default function BST(props) {
    const router = useRouter();
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    if (!numbers.length) arr = [];

    async function* insert(num) {
        arr.push(num);
        setNumbers(arr.slice());
        yield 500;
        if (!numbers.length) {
            Tree = binarySearchTree(animator);
        }
        yield* Tree.insert(num);
    };

    async function* remove(num) {
        yield 500;
        yield* Tree.deleteNode(num);
        if (!Tree.root()) reset();
    };

    const reset = () => setNumbers([]);

    const randomTree = async () => {
        if (arr.length) reset();
        await sleep(100);
        arr = randomNodes();
        insertAll();
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
        { text: <Refresh />, onClick: randomTree, title: 'New binary tree' },
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(Tree.root()),
            title: 'Share this binary tree',
            disabled: !arr.length,
        },
    ];

    useEffect(() => {
        if (router.isReady && !arr.length) {
            arr = randomNodes();
            const { nodes } = router.query;
            try {
                if (nodes) {
                    arr = JSON.parse(atob(nodes));
                }
                insertAll();
            } catch {
                console.log('Error parsing nodes');
            }
        }
    }, [router]);

    const insertAll = async () => {
        setNumbers(arr.slice());
        Tree = binarySearchTree(animator);
        await sleep(100);
        arr.forEach((num) => Tree._insert(num));
    };

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                A <strong>Binary Search Tree</strong> (BST) is like a
                well-organized library where each book (node) has a clear place
                based on its value. In a BST, each node has up to two children:
                the left child holds smaller values, and the right child holds
                larger values. This structure allows for efficient searching,
                adding, and removing of books, as you can quickly navigate left
                or right to find or insert a book in its proper place.
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
