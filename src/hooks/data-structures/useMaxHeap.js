import { Edge, Node, Numkey } from '@/components/common';
import { Redo, Save, Share, Undo } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useAnimator, useSummary, useTreeUrl, useUndoRedo } from '@/hooks';
import { copyBinaryTree, sleep, sound } from '@/common/utils';
import maxHeap from '@/helpers/maxHeap';
import Paper from '@mui/material/Paper';

var Tree;
var delay = 500;

export default function useMaxHeap({ saveData }) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const { txy } = animator;
    const history = useUndoRedo();

    async function* insert(num) {
        if (!numbers.length) {
            Tree = maxHeap(animator);
        }
        const keys = Tree.collect();
        explain({ keys, operation: 'Insert', input: num });
        history.push(keys);
        setNumbers([...numbers, num]);
        yield delay;
        sound('pop');
        if (!numbers.length) {
            const node = Tree.insert(num);
            txy(`.numkey0`, node.x + 20, node.y - 24);
        } else {
            const size = Tree.size();
            const parent = Tree.node(Math.floor((size - 1) / 2));
            const isLeft = size % 2 === 1;
            const node = Tree.insert(num, parent, isLeft);
            for (let i = 0; i <= size; i++) {
                const node = Tree.node(i);
                txy(`.numkey${i}`, node.x + 20, node.y - 24);
            }
            yield delay;
            yield* Tree.heapifyUp(node);
        }
    }

    async function* extract() {
        const keys = Tree.collect();
        explain({ keys, operation: 'Extract' });
        history.push(keys);
        yield delay;
        yield* Tree.extract();
        if (!Tree.root()) setNumbers([]);
    }

    const newTree = async (nodes) => {
        setNumbers(nodes.slice());
        Tree = maxHeap(animator);
        await sleep(100);
        nodes.forEach((num) => Tree._insert(num));
    };

    const handleUndo = async () => {
        if (history.canUndo) {
            setNumbers([]);
            await sleep(100);
            newTree(history.undo(Tree.collect()));
        }
    };

    const handleRedo = async () => {
        if (history.canRedo) {
            setNumbers([]);
            await sleep(100);
            newTree(history.redo(Tree.collect()));
        }
    };

    const refresh = async (data) => {
        reset();
        await sleep(100);
        newTree(data);
    };

    const reset = () => {
        setNumbers([]);
        history.clear();
        abort();
    };

    const saveButton = {
        text: <Save fontSize="small" />,
        onClick: () => saveData(Tree.collect()),
        disabled: !numbers.length,
        title: 'Save this tree',
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Extract',
            onClick: extract,
            animate: true,
            disabled: !numbers.length,
        },
        { text: 'Clear', onClick: reset, disabled: !numbers.length },
        {
            text: <Undo />,
            onClick: handleUndo,
            title: 'Undo',
            disabled: !history.canUndo,
        },
        {
            text: <Redo />,
            onClick: handleRedo,
            title: 'Redo',
            disabled: !history.canRedo,
        },
        ...(saveData ? [saveButton] : []),
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(Tree.collect()),
            disabled: !numbers.length,
            title: 'Share this tree',
        },
    ];

    useEffect(() => {
        if (nodes) newTree(nodes);
    }, [nodes]);

    const animation = (
        <Paper ref={scope} className="resizable">
            {numbers.slice(1).map((_, i) => (
                <Edge key={i} index={i} />
            ))}
            {numbers.map((num, i) => (
                <Node key={i} index={i} value={num} style={{ opacity: 0 }} />
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
        </Paper>
    );

    return { animation, buttons, summary, refresh };
}
