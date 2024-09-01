import React, { useState } from 'react';
import DSInput from '@/components/ds-input/ds-input';
import useAnimator from '@/hooks/useAnimator';
import binaryTree from '@/common/binaryTree';
import { Edge, Node } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { wait } from '@/common/utils';

var arr = [], Tree;
var delay = 500;

export default function BinaryHeap(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const { bgcolor } = animator;
    if (!numbers.length) arr = [];

    const input = async (num) => {
        arr.push(num);
        setNumbers(arr.slice());
        await wait(delay);
        if (!numbers.length) {
            Tree = binaryTree(animator);
            Tree.insert(num);
        } else {
            await search(Tree.root(), num);
        }
    };

    const search = async (node, num) => {
        await bgcolor(`#node${node.index}`, Colors.compare);
        await wait(delay);
        const isLeft = num <= node.value;
        const next = isLeft ? 'left' : 'right';
        if (!node[next]) {
            Tree.insert(num, node, isLeft);
            await wait(delay);
            await bgcolor(`#node${node.index}`, Colors.white);
        } else {
            await bgcolor(`#node${node.index}`, Colors.white);
            await search(node[next], num);
        }
    };

    const reset = () => setNumbers([]);

    const buttons = [
        { text: 'Insert', onClick: input, validate: true },
        { text: 'Clear', onClick: reset },
    ];

    return (
        <>
            <section>
                <p>
                    A <strong>Binary Search Tree</strong> (BST) is like a
                    well-organized library where each book (node) has a clear
                    place based on its value. In a BST, each node has up to two
                    children: the left child holds smaller values, and the right
                    child holds larger values. This structure allows for
                    efficient searching, adding, and removing of books, as you
                    can quickly navigate left or right to find or insert a book
                    in its proper place.
                </p>
            </section>
            <DSInput {...props} buttons={buttons} />
            <div ref={scope} style={{ position: 'relative' }}>
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
