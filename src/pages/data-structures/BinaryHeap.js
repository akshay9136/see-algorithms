import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node, Numkey } from '@/components/common';
import binaryHeap from '@/helpers/binaryHeap';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { sound } from '@/common/utils';
import Link from 'next/link';

var arr = [], Tree;
var delay = 500;

export default function BinaryHeap(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { txy } = animator;
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
        arr.push(num);
        setNumbers(arr.slice());
        yield delay;
        sound('pop');
        if (!numbers.length) {
            Tree = binaryHeap(animator);
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
        yield delay;
        yield* Tree.extract();
        if (!Tree.root()) reset();
    }

    const reset = () => {
        setNumbers([]);
        arr = [];
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Extract',
            onClick: extract,
            validate: true,
            disabled: !arr.length,
        },
        { text: 'Clear', onClick: reset },
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
                sorting, heaps are widely used to implement{' '}
                <strong>priority queues</strong>.
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
                        <strong>Insertion:</strong> The new element is added to
                        the end of the heap and then {'"bubbled up"'}{' '}
                        (heapify-up) by repeatedly swapping it with its parent
                        until the heap property is restored.
                    </li>
                    <li>
                        <strong>Extraction:</strong> The root element is removed
                        and replaced by the last element in the heap. This
                        element is then {'"bubbled down"'} (heapify-down) by
                        swapping it with its children until the heap property is
                        satisfied.
                    </li>
                </ul>
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {insertAlgo}
                {extractAlgo}
            </Box>
            <br />
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
                {numbers.map((_, i) => (
                    <Numkey
                        key={i}
                        index={i}
                        value={i}
                        animate={{ x: -20 }}
                        transition={{ duration: 0 }}
                    />
                ))}
            </Box>
        </Stack>
    );
}
