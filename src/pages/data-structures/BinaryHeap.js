import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { DSInput, Edge, Node } from '@/components/common';
import binaryTree from '@/common/binaryTree';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { Colors } from '@/common/constants';
import { sound } from '@/common/utils';

var arr = [], Tree;
var delay = 400;

export default function BinaryHeap(props) {
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const [algorithm] = useAlgorithm(`
function heapify(node):
    parent = node.parent
    if parent and node.value > parent.value:
        swap(node, parent)
        heapify(parent)
`);

    async function* insert(num) {
        arr.push(num);
        setNumbers(arr.slice());
        yield delay;
        sound('pop');
        if (!numbers.length) {
            Tree = binaryTree(animator);
            Tree.insert(num);
        } else {
            const size = numbers.length;
            const parent = Tree.node(Math.floor((size - 1) / 2));
            const isLeft = size % 2 === 1;
            const node = Tree.insert(num, parent, isLeft);
            yield delay * 2;
            yield* heapify(node);
        }
    };

    async function* heapify(node) {
        const parent = node.parent;
        const { bgcolor } = animator;
        if (parent && node.value > parent.value) {
            await bgcolor(node.id, Colors.compare);
            yield delay;
            await bgcolor(parent.id, Colors.compare);
            yield delay / 2;
            sound('swap');
            await Tree.swapNodes(node, parent);
            yield delay / 2;
            await bgcolor(node.id, Colors.white);
            yield* heapify(parent);
        }
        yield delay / 2;
        await bgcolor(node.id, Colors.white);
    };

    const reset = () => setNumbers([]);
    if (!numbers.length) arr = [];

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        { text: 'Clear', onClick: reset },
    ];

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                A Binary Heap is like a <strong>priority queue</strong> in a
                bustling airport, where the most important passengers (highest
                or lowest priority) are always at the front. It is a complete
                binary tree where each parent node is either greater than or
                less than its child nodes, depending on whether it is a max-heap
                (highest value at the top) or a min-heap (lowest value at the
                top). This arrangement makes it easy to quickly access and
                remove the highest or lowest priority element.
            </Typography>
            {algorithm}
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
