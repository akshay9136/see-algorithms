import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Edge, InputNumbers, Node } from '@/components/common';
import binaryTree from '@/common/binaryTree';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import Iterator from '@/common/iterator';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import Link from 'next/link';

var arr, Tree;
var it, delay = 1000;

export default function HeapSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { txy, bgcolor, animate } = animator;
    const [algorithm, setCurrentStep] = useAlgorithm(`
for i = (n / 2 - 1) down to 0:
    heapify(i)
for i = n - 1 down to 1:
    swap(0, i)
    heapify(0)
`);
    const [heapifyAlgo] = useAlgorithm(`
function heapify(i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n:
        if arr[left] > arr[largest]:
            largest = left
    if right < n:
        if arr[right] > arr[largest]:
            largest = right
    if largest != i:
        swap(i, largest)
        heapify(largest)
`);

    async function* heapSort() {
        yield 1500;
        const n = arr.length;
        sound('swap');
        Tree.insert(arr[0]);
        for (let i = 1; i < n; i++) {
            const j = Math.floor((i + 1) / 2) - 1;
            const parent = Tree.node(j);
            Tree.insert(arr[i], parent, i % 2 === 1);
        }
        yield 1500;
        setCurrentStep('0,1');
        const k = Math.floor(n / 2) - 1;
        for (let i = k; i >= 0; i--) {
            yield* heapify(Tree.node(i), n);
        }
        yield delay;
        for (let i = n - 1; i > 0; i--) {
            const first = Tree.node(0);
            const last = Tree.node(i);
            if (first.value !== last.value) {
                sound('swap');
                setCurrentStep('2,3');
                await Tree.swapNodes(first, last);
            }
            await bgcolor(last.id, Colors.sorted);
            yield delay;
            setCurrentStep('2,4');
            yield* heapify(Tree.node(0), i);
        }
        setCurrentStep('');
        const head = Tree.node(0);
        await bgcolor(head.id, Colors.sorted);
        yield delay;
        for (let i = 0; i < n; i++) {
            txy(Tree.node(i).id, i * 56, 0);
            if (i < n - 1) {
                animate(`#edge${i}`, { opacity: 0 });
            }
        }
    }

    const getLargest = (node, n) => {
        const { left, right } = node;
        if (left && left.key < n) {
            if (left.value > node.value) node = left;
        }
        if (right && right.key < n) {
            if (right.value > node.value) node = right;
        }
        return node;
    };

    async function* heapify(node, n) {
        await bgcolor(node.id, Colors.compare);
        yield delay / 2;
        const max = getLargest(node, n);
        if (max !== node) {
            await bgcolor(max.id, Colors.compare);
            sound('swap');
            await Tree.swapNodes(node, max);
            await bgcolor(node.id, Colors.white);
            yield* heapify(max, n);
        } else {
            await bgcolor(node.id, Colors.white);
        }
    }

    const handleStart = (values) => {
        if (arr) return it.start();
        arr = values.slice();
        sound('pop');
        setNumbers(values);
        Tree = binaryTree(animator);
        it = Iterator.new(heapSort);
        return it.start();
    };

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        it?.exit();
        arr = undefined;
    };

    useEffect(() => handleStop, []);

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Heap Sort</strong> is an efficient sorting algorithm
                that leverages a data structure called{' '}
                <Link href="/data-structures/BinaryHeap">Binary Heap</Link> to
                organize and sort data. It works by first building a heap from
                the data and then repeatedly extracting the largest (or
                smallest) element from the heap and rebuilding the heap until
                all elements are sorted. This method is known for its reliable
                performance and in-place sorting capabilities, making it a
                strong choice for handling large datasets without requiring
                extra memory.
            </Typography>
            <Typography variant="h6" component="h2">
                Things to Observe
            </Typography>
            <Typography
                component="div"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <ul>
                    <li>
                        <strong>Building the Heap:</strong> The first phase of
                        the algorithm rearranges the array into a Max Heap,
                        where the element at the root of any sub-tree is the
                        largest.
                    </li>
                    <li>
                        <strong>Extracting the Max:</strong> In the second
                        phase, watch how the largest element (at the root) is
                        repeatedly swapped with the last element of the heap,
                        and the heap is rebuilt. This process gradually builds
                        the sorted array from the end.
                    </li>
                </ul>
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {heapifyAlgo}
                <Stack spacing={3}>
                    {algorithm}
                    <InputNumbers
                        onStart={handleStart}
                        onReset={handleStop}
                        onStop={() => it?.stop()}
                    />
                    <Box
                        className="heapSort"
                        id="binaryTree"
                        sx={{ width: 600, pt: 1 }}
                        ref={scope}
                    >
                        {numbers.slice(1).map((_, i) => (
                            <Edge key={i} index={i} />
                        ))}
                        {numbers.map((num, i) => (
                            <Node
                                key={i}
                                index={i}
                                value={num}
                                animate={{ x: i * 56 }}
                            />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
