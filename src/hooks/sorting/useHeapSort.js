import { useState } from 'react';
import { useAlgorithm, useAnimator } from '@/hooks';
import { Edge, Node, Numkey } from '@/components/common';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import { Box } from '@mui/material';
import binaryHeap from '@/helpers/binaryHeap';

var arr, Tree;
var delay = 1000;

export default function useHeapSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { txy, bgcolor, animate } = animator;
    const [pseudocode, setCurrentStep] = useAlgorithm(`
for i = (n / 2 - 1) down to 0:
    heapify(i)
for i = n - 1 down to 1:
    swap(0, i)
    heapify(0)
`);

    async function* buildHeap(n) {
        Tree.insert(arr[0]);
        for (let i = 1; i < n; i++) {
            const j = Math.floor((i + 1) / 2) - 1;
            const parent = Tree.node(j);
            Tree.insert(arr[i], parent, i % 2 === 1);
        }
        for (let i = 0; i < n; i++) {
            const node = Tree.node(i);
            txy(`#key${i}`, node.x + 20, node.y - 24);
        }
        yield 1500;
        setCurrentStep('0,1');
        const k = Math.floor(n / 2) - 1;
        const { heapify } = Tree;
        for (let i = k; i >= 0; i--) {
            yield* heapify(Tree.node(i), n);
        }
    }

    async function* handleSort(values) {
        setNumbers(values);
        sound('pop');
        arr = values.slice();
        Tree = binaryHeap(animator);
        const { heapify, swapNodes } = Tree;
        const n = arr.length;
        yield 1500;
        sound('swap');
        yield* buildHeap(n);
        yield delay;
        for (let i = n - 1; i > 0; i--) {
            const first = Tree.node(0);
            const last = Tree.node(i);
            if (first.value !== last.value) {
                sound('swap');
                setCurrentStep('2,3');
                await swapNodes(first, last);
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
            txy(`#key${i}`, i * 56 + 20, -22);
            if (i < n - 1) {
                animate(`#edge${i}`, { opacity: 0 });
            }
        }
    }

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        arr = undefined;
    };

    const animation = (
        <Box
            className="heapSort"
            id="binaryTree"
            sx={{ minWidth: numbers.length * 60, pt: 3 }}
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
            {numbers.map((_, i) => (
                <Numkey
                    key={i}
                    index={i}
                    value={i}
                    animate={{ x: i * 56 + 20, y: -24 }}
                />
            ))}
        </Box>
    );

    return { animation, pseudocode, handleSort, handleStop };
}
