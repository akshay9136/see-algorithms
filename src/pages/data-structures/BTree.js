import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { Redo, Share, Undo } from '@mui/icons-material';
import { copyBinaryTree, showError, sleep } from '@/common/utils';
import { useAnimator, useSummary, useTreeUrl, useUndoRedo } from '@/hooks';
import { bTreePrompt } from '@/common/prompts';
import { DSInput } from '@/components/common';
import bTreeHelper from '@/helpers/bTree';

var Tree;

export default function BTree(props) {
    const [treeData, setTreeData] = useState(null);
    const [numbers, setNumbers] = useState([]);
    const [scope, animator] = useAnimator();
    const [summary, explain, abort] = useSummary();
    const [nodes, isReady] = useTreeUrl();
    const history = useUndoRedo();

    async function* insert(num) {
        if (numbers.includes(num)) {
            showError(`Key (${num}) already exists.`);
            return;
        }
        if (!numbers.length) {
            Tree = bTreeHelper(animator);
        }
        explain(bTreePrompt(Tree.collect(), num));
        history.push(numbers.slice());
        yield 500;
        setNumbers([...numbers, num]);
        yield* Tree.insert(num, setTreeData);
    }

    const newTree = async (nums) => {
        setNumbers(nums.slice());
        Tree = bTreeHelper(animator);
        await sleep(100);
        nums.forEach((num) => Tree._insert(num));
        setTreeData(Tree.getSnapshot());
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

    const reset = () => {
        setTreeData(null);
        setNumbers([]);
        history.clear();
        abort();
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
        {
            text: <Share fontSize="small" />,
            onClick: () => copyBinaryTree(numbers),
            disabled: !numbers.length,
            title: 'Share this tree',
        },
    ];

    useEffect(() => {
        if (isReady && nodes) newTree(nodes);
    }, [nodes, isReady]);

    const transition = { duration: 0.5, ease: 'easeInOut' };

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                A <strong>B-Tree</strong> is a self-balancing search tree
                designed to maintain sorted data and allow efficient insertion,
                deletion, and search operations. Unlike binary trees, each node
                can hold multiple keys and have more than two children. B-Trees
                are widely used in databases and file systems where large blocks
                of data must be read and written efficiently.
            </Typography>
            <Typography variant="h6" component="h2">
                How it Works
            </Typography>
            <Typography
                component="ul"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <li>
                    <strong>Insertion:</strong> A new key is inserted into the
                    appropriate leaf node. If the node overflows (exceeds the
                    maximum number of keys), it splits: the median key is pushed
                    up to the parent, and the remaining keys form two child
                    nodes. This process may propagate upward, potentially
                    creating a new root.
                </li>
                <li>
                    <strong>Splitting:</strong> Observe how existing keys are
                    pushed down while the median key rises to the parent. This
                    keeps the tree balanced — all leaves always remain at the
                    same depth.
                </li>
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={3}>
                <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                        Visualizer
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            For simplicity, the order of this B-Tree visualizer
                            is fixed to 3.
                        </Typography>
                    </Typography>

                    <DSInput {...props} buttons={buttons} />

                    <Paper ref={scope} className="resizable" id="bTree">
                        <svg style={styles.svg}>
                            <AnimatePresence>
                                {treeData?.edges.map((edge) => (
                                    <motion.line
                                        key={edge.id}
                                        initial={{ ...edge, opacity: 0 }}
                                        animate={{ ...edge, opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={transition}
                                        stroke="#b0b0b0"
                                        strokeWidth={2}
                                    />
                                ))}
                            </AnimatePresence>
                        </svg>

                        <AnimatePresence>
                            {treeData?.nodes.map((node) => (
                                <motion.div
                                    key={node.id}
                                    id={node.id.slice(1)}
                                    initial={{
                                        opacity: 0,
                                        x: node.x,
                                        y: node.y,
                                    }}
                                    animate={{ opacity: 1, ...node }}
                                    exit={{ opacity: 0 }}
                                    transition={transition}
                                    style={styles.node}
                                />
                            ))}
                        </AnimatePresence>

                        <AnimatePresence>
                            {treeData?.keys.map((key) => (
                                <motion.div
                                    key={key.value}
                                    initial={{
                                        opacity: 0,
                                        x: key.x,
                                        y: key.y,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: key.x,
                                        y: key.y,
                                    }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={transition}
                                    style={styles.key}
                                >
                                    {key.value}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Paper>
                </Stack>
                <Divider orientation="vertical" flexItem />
                {summary}
            </Box>
        </Stack>
    );
}

const styles = {
    svg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    node: {
        position: 'absolute',
        height: 40,
        borderRadius: 8,
        backgroundColor: '#e3f1fc',
        border: '1px solid #90c4f0',
        zIndex: 1,
    },
    key: {
        position: 'absolute',
        width: 50,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 16,
        color: '#2c6faa',
        zIndex: 2,
        pointerEvents: 'none',
        userSelect: 'none',
    },
};
