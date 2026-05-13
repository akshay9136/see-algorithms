import { Edge, Node } from '@/components/common';
import { Redo, Save, Share, Undo } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import {
    useAlgorithm,
    useAnimator,
    useSummary,
    useTreeUrl,
    useUndoRedo,
} from '@/hooks';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import avlTree from '@/helpers/avlTree';
import Paper from '@mui/material/Paper';

var Tree;
var deleted = {};

export default function useAvlTree({ saveData }) {
    const [numbers, setNumbers] = useState([]);
    const [summary, explain, abort] = useSummary();
    const [scope, animator] = useAnimator();
    const [nodes, isReady] = useTreeUrl();
    const history = useUndoRedo();

    const [algorithm, setCurrentStep] = useAlgorithm(`
function rebalance(node):
    updateHeight(node)
    nodeBf = balanceFactor(node)
    if nodeBf > 1:
        if balanceFactor(node.left) >= 0:
            rotateRight(node)
        else:
            rotateLeft(node.left)
            rotateRight(node)
    if nodeBf < -1:
        if balanceFactor(node.right) <= 0:
            rotateLeft(node)
        else:
            rotateRight(node.right)
            rotateLeft(node)
    if node.parent:
        rebalance(node.parent)
`);

    async function* insert(num) {
        if (numbers.includes(num) && !deleted[num]) {
            showError(`Node (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = avlTree(animator, setCurrentStep);
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

    async function* remove(num) {
        if (numbers.includes(num)) deleted[num] = true;
        const keys = Tree.collect();
        explain({ keys, operation: 'Delete', input: num });
        yield 500;
        const affected = yield* Tree.deleteNode(num);
        if (affected !== undefined) {
            history.push(keys);
            if (!Tree.root()) setNumbers([]);
        }
    }

    const newTree = async (nodes) => {
        setNumbers(nodes.slice());
        Tree = avlTree(animator, setCurrentStep);
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
            text: 'Delete',
            onClick: remove,
            validate: true,
            disabled: !numbers.length,
        },
        {
            text: 'Clear',
            onClick: reset,
            disabled: !numbers.length,
        },
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
        // { text: <Refresh />, onClick: refresh, title: 'New tree' },
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

    return { algorithm, animation, buttons, summary, refresh };
}
