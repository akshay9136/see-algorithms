import { Draggable, Edge, Node, SavedDataList } from '@/components/common';
import {
    useAnimator,
    useSavedData,
    useSummary,
    useTreeControls,
    useTreeUrl,
} from '@/hooks';
import { useEffect, useState, useRef } from 'react';
import { randomKeys, showError, sleep } from '@/common/utils';
import { assignColors } from '@/helpers/redBlackTree';
import Paper from '@mui/material/Paper';

export default function useBinaryTree({
    createTree,
    hideButtons = [],
    treeType = 'search',
    randomNodes = randomKeys()
}) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const { saveData, ...saveDataProps } = useSavedData();
    const treeRef = useRef(null);
    const deletedRef = useRef({});
    const Tree = () => treeRef.current;
    const isRedBlack = treeType === 'red-black';

    const collect = isRedBlack
        ? () => Tree().collect((a) => [a.value, a.color])
        : () => Tree().collect();

    async function* insert(num) {
        if (numbers.includes(num) && !deletedRef.current[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            treeRef.current = createTree(animator);
            deletedRef.current = {};
        }
        const keys = collect();
        explain({ keys, operation: 'Insert', input: num });
        history.push(keys);
        deletedRef.current[num] = false;
        setNumbers((prev) => [...prev, num]);
        yield 500;
        yield* Tree().insert(num);
    }

    async function* remove(num) {
        if (numbers.includes(num)) {
            deletedRef.current[num] = true;
        }
        const keys = collect();
        explain({ keys, operation: 'Delete', input: num });
        yield 500;
        const affected = yield* Tree().deleteNode(num);
        if (affected !== undefined) {
            history.push(keys);
            if (!Tree().root()) setNumbers([]);
        }
    }

    async function* splaySearch(num) {
        const keys = collect();
        if (treeType === 'splay') history.push(keys);
        explain({ keys, operation: 'Search', input: num });
        yield 500;
        yield* Tree().search(num);
    }

    const newTree = async (keys) => {
        if (isRedBlack) {
            keys = keys || assignColors(randomNodes);
            setNumbers(keys.map((a) => a[0]));
        } else {
            keys = keys || randomNodes;
            setNumbers(keys);
        }
        treeRef.current = createTree(animator);
        deletedRef.current = {};
        await sleep(100);
        keys.forEach((a) => Tree()._insert(a));
    };

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

    const allButtons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Search',
            onClick: splaySearch,
            validate: true,
            disabled: !numbers.length,
        },
        {
            text: 'Delete',
            onClick: remove,
            validate: true,
            disabled: !numbers.length,
        },
        controls.CLEAR,
        controls.UNDO,
        controls.REDO,
        controls.REFRESH,
        ...(saveData ? [saveButton] : []),
        controls.SHARE,
    ];

    useEffect(() => {
        if (isReady) newTree(nodes);
    }, [nodes, isReady]);

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
              initial={{ opacity: 0 }}
              showBf={['avl', 'red-black'].includes(treeType)}
            />
          ))}
        </Draggable>
      </Paper>
    );

    const refresh = controls.REFRESH.onClick;

    return {
        animation,
        summary,
        savedData: <SavedDataList onSelect={refresh} {...saveDataProps} />,
        buttons: allButtons.filter((btn) => !hideButtons.includes(btn.text)),
        newTree,
    };
}
