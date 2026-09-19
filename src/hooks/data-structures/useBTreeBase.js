import { useEffect, useState, useRef } from 'react';
import {
    useAnimator,
    useSavedData,
    useSummary,
    useTreeControls,
    useTreeUrl,
} from '@/hooks';
import { randomKeys, showError, sleep } from '@/common/utils';
import { SavedDataList } from '@/components/common';

export default function useBTreeBase({
  createTree,
  randomNodes = randomKeys(),
}) {
    const [treeData, setTreeData] = useState(null);
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const [summary, explain, abort] = useSummary();
    const [nodes, isReady] = useTreeUrl();
    const { saveData, ...saveDataProps } = useSavedData();
    const treeRef = useRef(null);
    const Tree = () => treeRef.current;

    async function* insert(num) {
        if (numbers.includes(num)) {
            showError(`Key (${num}) already exists.`);
            return;
        }
        if (!numbers.length) treeRef.current = createTree(animator);
        const keys = Tree().collect();
        explain({ keys, operation: 'Insert', input: num });
        history.push(numbers.slice());
        yield 500;
        setNumbers((prev) => [...prev, num]);
        yield* Tree().insert(num, setTreeData);
    }

    async function* search(num) {
        const keys = Tree().collect();
        explain({ keys, operation: 'Search', input: num });
        yield 500;
        const found = yield* Tree().search(num);
        if (!found) showError(`Key (${num}) not found.`);
    }

    const newTree = async (keys) => {
        keys = keys || randomNodes;
        setNumbers(keys.slice());
        treeRef.current = createTree(animator);
        await sleep(100);
        keys.forEach((num) => Tree()._insert(num));
        setTreeData(Tree().getSnapshot());
    };

    const { history, controls } = useTreeControls({
        numbers,
        setNumbers,
        newTree,
        collect: () => numbers.slice(),
        onClear: () => {
            setTreeData(null);
            abort();
        },
    });

    const saveButton = {
        ...controls.SAVE,
        onClick: () => saveData(numbers),
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
        {
            text: 'Search',
            onClick: search,
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

    const refresh = controls.REFRESH.onClick;

    return {
        scope,
        treeData,
        summary,
        savedData: <SavedDataList onSelect={refresh} {...saveDataProps} />,
        buttons,
        newTree,
    };
}
