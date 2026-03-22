import { useState } from 'react';
import { Redo, Refresh, Undo } from '@mui/icons-material';
import { DSInput, Edge, Node, Numkey } from '@/components/common';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { useAlgorithm, useAnimator, useSummary, useUndoRedo } from '@/hooks';
import { sleep, sound } from '@/common/utils';
import binaryHeap from '@/helpers/binaryHeap';
import Link from 'next/link';

var arr = [], Tree;
var delay = 500;

const getPrompt = (operation, value) => {
    const json = JSON.stringify(Tree.collect());
    return `
You are explaining the steps to someone observing a visualization of Binary Heap.

Context:
- A max-heap is represented by the values in this array: ${json}.
- Operation being performed: ${operation}, ${operation === 'Insert' ? `with value: ${value}` : ''}

Instructions:
- Explain how this operation will be performed.
- Keep the explaination short and step wise. Use past tense.
- Highlight important actions.`;
};

export default function BinaryHeap(props) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const { txy } = animator;
    const history = useUndoRedo();

    const [insertAlgo] = useAlgorithm(`
function insert(value):
    arr[n] = value
    i = n, n = n + 1
    while i > 0:
        parent = (i - 1) / 2
        if arr[parent] >= arr[i]:
            break
        swap(parent, i)
        i = parent
`);
    const [extractAlgo] = useAlgorithm(`
function extract():
    if n == 0: return null
    max = arr[0]
    arr[0] = arr[n - 1]
    n = n - 1
    heapify(0)
    return max
`);

    async function* insert(num) {
        if (!numbers.length) {
            Tree = binaryHeap(animator);
            arr = [];
        }
        explain(getPrompt('Insert', num));
        history.push(Tree.collect());
        arr.push(num);
        setNumbers(arr.slice());
        yield delay;
        sound('pop');
        if (!numbers.length) {
            const node = Tree.insert(num);
            txy(`#key0`, node.x + 20, node.y - 24);
        } else {
            const size = Tree.size();
            const parent = Tree.node(Math.floor((size - 1) / 2));
            const isLeft = size % 2 === 1;
            const node = Tree.insert(num, parent, isLeft);
            for (let i = 0; i <= size; i++) {
                const node = Tree.node(i);
                txy(`#key${i}`, node.x + 20, node.y - 24);
            }
            yield delay;
            yield* Tree.heapifyUp(node);
        }
    }

    async function* extract() {
        explain(getPrompt('Extract'));
        history.push(Tree.collect());
        yield delay;
        yield* Tree.extract();
        if (!Tree.root()) setNumbers([]);
    }

    const newTree = async (nodes) => {
        arr = nodes.slice();
        setNumbers(arr.slice());
        Tree = binaryHeap(animator);
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

    const reset = () => {
        setNumbers([]);
        history.clear();
        abort();
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Extract',
            onClick: extract,
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
    ];

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>Binary Heap</strong> is a complete binary tree
                (typically stored in an array), where each node satisfies the
                heap property: in a max-heap, parents are greater than or equal
                to their children, while in a min-heap, they are less than or
                equal. <Link href="/sorting/HeapSort">Heap Sort</Link> utilizes
                this structure by building a <strong>max-heap</strong> and
                repeatedly extracting the root element to the end of the array,
                resulting in an efficient O(n log n) sorting algorithm. Beyond
                sorting, heaps are widely used to implement priority queues.
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
                    <strong>Insertion:</strong> The new element is added to the
                    end of the heap and then {'"bubbled up"'} (heapify-up) by
                    repeatedly swapping it with its parent until the heap
                    property is restored.
                </li>
                <li>
                    <strong>Extraction:</strong> The root element is removed and
                    replaced by the last element in the heap. This element is
                    then {'"bubbled down"'} (heapify-down) by swapping it with
                    its children until the heap property is satisfied.
                </li>
            </Typography>
            <Typography variant="h6" component="h2">
                Pseudocode
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {insertAlgo}
                {extractAlgo}
            </Box>
            <br />
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
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
                            />
                        ))}
                        {numbers.map((_, i) => (
                            <Numkey
                                key={i}
                                index={i}
                                value={i}
                                animate={{ x: -20 }}
                                transition={{ duration: 0 }}
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
