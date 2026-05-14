import { AnimatePresence, motion } from 'motion/react';
import { Redo, Refresh, Save, Share, Undo } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useAnimator, useSummary, useTreeUrl, useUndoRedo } from '@/hooks';
import { copyBinaryTree, randomNodes, showError, sleep } from '@/common/utils';
import bTree from '@/helpers/bTree';
import Paper from '@mui/material/Paper';

var Tree;

export default function useBTree({ saveData }) {
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
    if (!numbers.length) Tree = bTree(animator);
    const keys = Tree.collect();
    explain({ keys, operation: 'Insert', input: num });
    history.push(numbers.slice());
    yield 500;
    setNumbers([...numbers, num]);
    yield* Tree.insert(num, setTreeData);
  }

  async function* search(num) {
    const keys = Tree.collect();
    explain({ keys, operation: 'Search', input: num });
    yield 500;
    const found = yield* Tree.search(num);
    if (!found) {
      showError(`Key (${num}) not found.`);
    }
  }

  const newTree = async (nums) => {
    setNumbers(nums.slice());
    Tree = bTree(animator);
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

  const refresh = async (data) => {
    reset();
    await sleep(100);
    newTree(data || randomNodes());
  };

  const saveButton = {
    text: <Save />,
    onClick: () => saveData(numbers),
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
      onClick: () => copyBinaryTree(numbers),
      disabled: !numbers.length,
      title: 'Share this tree',
    },
  ];

  useEffect(() => {
    if (isReady) newTree(nodes || randomNodes());
  }, [nodes, isReady]);

  const transition = { duration: 0.5, ease: 'easeInOut' };

  const animation = (
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
            initial={{ opacity: 0, x: node.x, y: node.y }}
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
            initial={{ opacity: 0, x: key.x, y: key.y }}
            animate={{ opacity: 1, x: key.x, y: key.y }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={transition}
            style={styles.key}
          >
            {key.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </Paper>
  );

  return { animation, buttons, summary, refresh };
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
