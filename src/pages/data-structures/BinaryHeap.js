import { useState } from 'react';
import DSInput from '@/components/ds-input';
import { Box, Stack, Typography } from '@mui/material';
import { Edge, Node } from '@/components/numbers';
import binaryTree from '@/common/binaryTree';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { sleep, sound } from '@/common/utils';
import { Colors } from '@/common/constants';

var arr = [], Tree;
var delay = 500;

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
    const { bgcolor } = animator;
    if (!numbers.length) arr = [];

    const insert = async (num) => {
        arr.push(num);
        setNumbers(arr.slice());
        await sleep(delay);
        sound('pop');
        if (Tree === undefined) {
            Tree = binaryTree(animator);
            Tree.insert(num);
        } else {
            const size = numbers.length;
            const parent = Tree.node(Math.floor((size - 1) / 2));
            const node = Tree.insert(num, parent, size % 2 === 1);
            await sleep(delay * 2);
            await heapify(node);
        }
    };

    const heapify = async (node) => {
        const parent = node.parent;
        if (parent && node.value > parent.value) {
            await bgcolor(`#node${node.index}`, Colors.compare);
            await sleep(delay);
            await bgcolor(`#node${parent.index}`, Colors.compare);
            sound('swap');
            await Tree.swapNodes(node, parent);
            await sleep(delay / 2);
            await bgcolor(`#node${node.index}`, Colors.white);
            await heapify(parent);
        }
        await sleep(delay / 2);
        await bgcolor(`#node${node.index}`, Colors.white);
    };

    const reset = () => setNumbers([]);

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
