import React, { useState } from 'react';
import DSInput from '@/components/ds-input/ds-input';
import binaryTree from '@/common/binaryTree';
import useAnimator from '@/hooks/useAnimator';
import { Edge, Node } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { sleep } from '@/common/utils';

var arr = [], Tree;
var delay = 500;

export default function BinaryHeap(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { bgcolor } = animator;
    if (!numbers.length) arr = [];

    const insert = async (num) => {
        arr.push(num);
        setNumbers(arr.slice());
        await sleep(delay);
        if (!numbers.length) {
            Tree = binaryTree(animator);
            Tree.insert(num);
        } else {
            const size = numbers.length;
            const parent = Tree.node(Math.floor((size - 1) / 2));
            const node = Tree.insert(num, parent, size % 2 === 1);
            await sleep(delay);
            await heapify(node);
        }
    };

    const heapify = async (node) => {
        const parent = node.parent;
        if (parent && node.value > parent.value) {
            await bgcolor(`#node${node.index}`, Colors.compare);
            await bgcolor(`#node${parent.index}`, Colors.compare);
            await Tree.swapNodes(node, parent);
            await bgcolor(`#node${node.index}`, Colors.white);
            await heapify(parent);
        }
        await bgcolor(`#node${node.index}`, Colors.white);
    };

    const reset = () => setNumbers([]);

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        { text: 'Clear', onClick: reset },
    ];

    return (
        <>
            <section>
                <p>
                    A <strong>Binary Heap </strong>is like a priority queue in a
                    bustling airport, where the most important passengers
                    (highest or lowest priority) are always at the front. It is
                    a complete binary tree where each parent node is either
                    greater than or less than its child nodes, depending on
                    whether it is a max-heap (highest value at the top) or a
                    min-heap (lowest value at the top). This arrangement makes
                    it easy to quickly access and remove the highest or lowest
                    priority element.
                </p>
            </section>
            <DSInput {...props} buttons={buttons} />
            <div ref={scope} className="resizable">
                {numbers.slice(0, -1).map((_, i) => (
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
            </div>
        </>
    );
}
