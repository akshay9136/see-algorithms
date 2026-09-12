import { Draggable, Edge, Node, Numkey } from '@/components/common';
import { useEffect, useState } from 'react';
import { useAnimator, useSummary, useTreeControls, useTreeUrl } from '@/hooks';
import { sleep, sound } from '@/common/utils';
import maxHeap from '@/helpers/maxHeap';
import Paper from '@mui/material/Paper';

var Tree, delay = 500;

export default function useMaxHeap({ saveData }) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const { txy, animate } = animator;

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
            animate(`.numkey0`, { opacity: 1 });
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
            animate(`.numkey${size}`, { opacity: 1 });
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

    const { history, controls } = useTreeControls({
        numbers,
        setNumbers,
        newTree,
        collect: () => Tree.collect(),
        onClear: abort,
    });

    const saveButton = {
        ...controls.SAVE,
        onClick: () => saveData(Tree.collect()),
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Extract',
            onClick: extract,
            animate: true,
            disabled: !numbers.length,
        },
        controls.CLEAR,
        controls.UNDO,
        controls.REDO,
        ...(saveData ? [saveButton] : []),
        controls.SHARE,
    ];

    useEffect(() => {
        if (nodes) newTree(nodes);
    }, [nodes]);

    const animation = (
      <Paper ref={scope} className="resizable">
        <Draggable>
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
                initial={{ opacity: 0 }}
            />
          ))}
        </Draggable>
      </Paper>
    );

    const refresh = controls.REFRESH.onClick;

    return { animation, buttons, summary, refresh };
}
