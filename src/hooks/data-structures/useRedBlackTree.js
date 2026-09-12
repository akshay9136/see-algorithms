import { Draggable, Edge, Node } from '@/components/common';
import { useEffect, useState } from 'react';
import { useAnimator, useSummary, useTreeControls, useTreeUrl } from '@/hooks';
import { showError, sleep } from '@/common/utils';
import redBlackTree from '@/helpers/redBlackTree';
import Paper from '@mui/material/Paper';

var Tree, deleted = {};

export default function useRedBlackTree({ saveData }) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();

    async function* insert(num) {
        if (numbers.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = redBlackTree(animator);
            deleted = {};
        }
        const keys = collect();
        explain({ keys, operation: 'Insert', input: num });
        history.push(keys);
        deleted[num] = false;
        setNumbers([...numbers, num]);
        yield 500;
        yield* Tree.insert(num);
    }

    async function* remove(num) {
        if (numbers.includes(num)) deleted[num] = true;
        const keys = collect();
        explain({ keys, operation: 'Delete', input: num });
        yield 500;
        const affected = yield* Tree.deleteNode(num);
        if (affected !== undefined) {
            history.push(keys);
            if (!Tree.root()) setNumbers([]);
        }
    }

    const newTree = async (keys) => {
        setNumbers(keys.map((a) => a[0]));
        Tree = redBlackTree(animator);
        deleted = {};
        await sleep(100);
        keys.forEach((a) => Tree._insert(...a));
    };

    const collect = () => Tree.collect((a) => [a.value, a.color]);

    const { history, controls } = useTreeControls({
        numbers,
        setNumbers,
        newTree,
        collect,
        onClear: abort,
    });

    const saveButton = {
        ...controls.SAVE,
        onClick: () => saveData(collect()),
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        // {
        //     text: 'Delete',
        //     onClick: remove,
        //     validate: true,
        //     disabled: !numbers.length,
        // },
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
            <Node
              key={i}
              index={i}
              value={num}
              style={{ opacity: 0 }}
              showBf
            />
          ))}
        </Draggable>
      </Paper>
    );

    const refresh = controls.REFRESH.onClick;

    return { animation, buttons, summary, refresh };
}
