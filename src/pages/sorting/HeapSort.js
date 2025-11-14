import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Edge, InputNumbers, Node } from '@/components/numbers';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import binaryTree from '@/common/binaryTree';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import Timer from '@/common/timer';
import Link from 'next/link';

const sleep = (t) => Timer.sleep(t);

var arr, Tree;
var delay = 500;

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

    const heapSort = async () => {
        sound('swap');
        const n = arr.length;
        Tree.insert(arr[0]);
        for (let i = 1; i < n; i++) {
            const j = Math.floor((i + 1) / 2) - 1;
            const parent = Tree.node(j);
            Tree.insert(arr[i], parent, i % 2 === 1);
        }
        await sleep(1500);
        setCurrentStep('0,1');
        const k = Math.floor(n / 2) - 1;
        for (let i = k; i >= 0; i--) {
            await heapify(Tree.node(i), n);
        }
        await sleep(delay);
        for (let i = n - 1; i > 0; i--) {
            const first = Tree.node(0);
            const last = Tree.node(i);
            if (first.value !== last.value) {
                sound('swap');
                setCurrentStep('2,3');
                await Tree.swapNodes(first, last);
            }
            await bgcolor(`#node${last.index}`, Colors.sorted);
            await sleep(1000);
            setCurrentStep('2,4');
            await heapify(Tree.node(0), i);
            await sleep(delay);
        }
        setCurrentStep('');
        const head = Tree.node(0);
        await bgcolor(`#node${head.index}`, Colors.sorted);
        await sleep(1000);
        for (let i = 0; i < n; i++) {
            txy(`#node${Tree.node(i).index}`, i * 50, 0);
            if (i < n - 1) {
                animate(`#edge${i}`, { width: 0 }, 0);
            }
        }
    };

    const heapify = async (node, n) => {
        const { left, right, index } = node;
        let max = node;
        if (left && left.key < n) {
            if (left.value > max.value) max = left;
        }
        if (right && right.key < n) {
            if (right.value > max.value) max = right;
        }
        await bgcolor(`#node${index}`, Colors.compare);
        if (max !== node) {
            await bgcolor(`#node${max.index}`, Colors.compare);
            sound('swap');
            await Tree.swapNodes(node, max);
            await bgcolor(`#node${node.index}`, Colors.white);
            await heapify(max, n);
        } else {
            await sleep(delay);
            await bgcolor(`#node${index}`, Colors.white);
        }
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        sound('pop');
        Tree = binaryTree(animator);
        sleep(1500)
            .then(heapSort)
            .catch(() => setCurrentStep(''));
    };

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        Timer.clear();
        Tree = undefined;
    };

    useEffect(() => handleStop, []);

    return (
        <Stack spacing={3}>
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
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {heapifyAlgo}
                <Stack spacing={3}>
                    {algorithm}
                    <InputNumbers onStart={handleStart} onStop={handleStop} />
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
                                animate={{ x: i * 50 }}
                            />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
