import { Edge, Node } from '@/components/common';
import { Redo, Save, Share, Undo } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useAnimator, useSummary, useTreeUrl, useUndoRedo } from '@/hooks';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import redBlackTree from '@/helpers/redBlackTree';
import Paper from '@mui/material/Paper';

var Tree;
var deleted = {};

export default function useRedBlackTree({ saveData }) {
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
            Tree = redBlackTree(animator);
            deleted = {};
        }
        const keys = Tree.collect((a) => [a.value, a.color]);
        explain({ keys, operation: 'Insert', input: num });
        history.push(keys);
        deleted[num] = false;
        setNumbers([...numbers, num]);
        yield 500;
        yield* Tree.insert(num);
    }

    const newTree = async (nodes) => {
        setNumbers(nodes.map((x) => x[0]));
        Tree = redBlackTree(animator);
        deleted = {};
        await sleep(100);
        nodes.forEach((x) => Tree._insert(...x));
    };

    const handleUndo = async () => {
        if (history.canUndo) {
            setNumbers([]);
            await sleep(100);
            const nodes = Tree.collect((a) => [a.value, a.color]);
            newTree(history.undo(nodes));
        }
    };

    const handleRedo = async () => {
        if (history.canRedo) {
            setNumbers([]);
            await sleep(100);
            const nodes = Tree.collect((a) => [a.value, a.color]);
            newTree(history.redo(nodes));
        }
    };

    const handleCopy = () => {
        const nodes = Tree.collect((a) => [a.value, a.color]);
        copyBinaryTree(nodes);
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
        onClick: () => {
            const nodes = Tree.collect((a) => [a.value, a.color]);
            saveData(nodes);
        },
        disabled: !numbers.length,
        title: 'Save this tree',
    };

    const buttons = [
        { text: 'Insert', onClick: insert, validate: true },
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
            onClick: handleCopy,
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
                <Node
                    key={i}
                    index={i}
                    value={num}
                    style={{ opacity: 0 }}
                    showBf
                />
            ))}
        </Paper>
    );

    return { animation, buttons, summary, refresh };
}
