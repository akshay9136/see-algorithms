import React, { useState } from 'react';
import { Edge, Node, SortNumbers } from '../../components/numbers';
import useAnimator from '../../hooks/useAnimator';
import binaryTree from '../../common/binaryTree';
import { Colors } from '../../common/constants';
import { try_, wait } from '../../common/utils';

var arr, Tree, delay = 500;

export default function HeapSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { txy, bgcolor, animate } = animator;

    const heapSort = try_(async () => {
        const n = arr.length;
        Tree.insert(arr[0]);
        for (let i = 1; i < n; i++) {
            const j = Math.floor((i + 1) / 2) - 1;
            const parent = Tree.node(j);
            Tree.insert(arr[i], parent, i % 2 === 1);
        }
        await wait(1000);
        const k = Math.floor(n / 2) - 1;
        for (let i = k; i >= 0; i--) {
            await heapify(Tree.node(i));
        }
        await wait(delay);
        for (let i = n - 1; i > 0; i--) {
            const first = Tree.node(0);
            const last = Tree.node(i);
            if (first.value !== last.value) {
                await Tree.swapNodes(first, last);
            }
            await bgcolor(`#node${last.index}`, Colors.sorted);
            await wait(delay);
            await heapify(Tree.node(0), i);
            await wait(delay);
        }
        const head = Tree.node(0);
        await bgcolor(`#node${head.index}`, Colors.sorted);
        await wait(1000);
        for (let i = 0; i < n; i++) {
            txy(`#node${Tree.node(i).index}`, i * 50, 0);
            if (i < n - 1) {
                animate(`#edge${i}`, { width: 0 }, 0);
            }
        }
    });

    const heapify = async (node, _n) => {
        const n = _n ? _n : arr.length;
        const { left, right } = node;
        let max = node;
        if (left && left.key < n) {
            if (left.value > max.value) max = left;
        }
        if (right && right.key < n) {
            if (right.value > max.value) max = right;
        }
        await bgcolor(`#node${node.index}`, Colors.compare);
        if (max !== node) {
            await bgcolor(`#node${max.index}`, Colors.compare);
            await Tree.swapNodes(node, max);
            await bgcolor(`#node${node.index}`, Colors.white);
            await heapify(max, n);
        } else {
            if (!_n) await wait(delay);
            await bgcolor(`#node${node.index}`, Colors.white);
        }
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        Tree = binaryTree(animator);
        setTimeout(heapSort, 1000);
    };

    const handleStop = () => {
        setNumbers([]);
        Tree = undefined;
    };

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="heapSort" ref={scope}>
                {numbers.slice(0, -1).map((_, i) => (
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
            </div>
        </SortNumbers>
    );
}
