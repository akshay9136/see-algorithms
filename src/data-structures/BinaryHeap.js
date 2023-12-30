import React, { useState } from 'react';
import DSInput from '../components/ds-input/ds-input';
import useAnimator from '../hooks/useAnimator';
import binaryTree from '../common/binaryTree';
import { Edge, Node } from '../components/numbers';
import { Colors } from '../common/constants';
import { wait } from '../common/utils';

var arr = [], Tree;
var delay = 500;

export default function BinaryHeap(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { bgcolor } = animator;

    const input = async (num) => {
        if (!numbers.length) {
            arr = [num];
            setNumbers(arr);
            await wait(delay);
            Tree = binaryTree(animator);
            Tree.insert(num);
        } else {
            arr.push(num);
            setNumbers(arr.slice());
            await wait(delay);
            const size = Tree.size();
            const parent = Tree.node(Math.floor((size - 1) / 2));
            const node = Tree.insert(num, parent, size % 2 === 1);
            await wait(delay);
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
        { text: 'Insert', onClick: input, validate: true },
        { text: 'Clear', onClick: reset },
    ];

    return (
        <div className="dsInput">
            <DSInput {...props} buttons={buttons} />
            <div ref={scope}>
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
        </div>
    );
}
