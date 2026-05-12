import { Edge, Node } from '@/components/common';
import { Redo, Refresh, Save, Share, Undo } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useAnimator, useSummary, useTreeUrl, useUndoRedo } from '@/hooks';
import { copyBinaryTree, randomNodes, showError, sleep } from '@/common/utils';
import splayTree from '@/helpers/splayTree';
import Paper from '@mui/material/Paper';

var Tree;
var deleted = {};

export default function useSplayTree({ saveData }) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const history = useUndoRedo();

    async function* insert(num) {
        if (numbers.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = splayTree(animator);
            deleted = {};
        }
        const keys = Tree.collect();
        explain({ keys, operation: 'Insert', input: num });
        history.push(keys);
        deleted[num] = false;
        setNumbers([...numbers, num]);
        yield 500;
        yield* Tree.insert(num);
    }

    async function* search(num) {
        const keys = Tree.collect();
        explain({ keys, operation: 'Search', input: num });
        history.push(keys);
        yield 500;
        yield* Tree.search(num);
    }

    const newTree = async (nodes) => {
        setNumbers(nodes.slice());
        Tree = splayTree(animator);
        deleted = {};
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
        newTree(data || randomNodes());
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
            text: 'Search',
            onClick: search,
            validate: true,
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
        { text: <Refresh />, onClick: () => refresh(), title: 'New tree' },
        ...(saveData ? [saveButton] : []),
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(Tree.root()),
            disabled: !numbers.length,
            title: 'Share this tree',
        },
    ];

    useEffect(() => {
        if (isReady) newTree(nodes || randomNodes());
    }, [nodes, isReady]);

    const animation = (
        <Paper ref={scope} className="resizable">
            {numbers.slice(1).map((_, i) => (
                <Edge key={i} index={i} />
            ))}
            {numbers.map((num, i) => (
                <Node key={i} index={i} value={num} style={{ opacity: 0 }} />
            ))}
        </Paper>
    );

    return { animation, buttons, summary, refresh };
}
