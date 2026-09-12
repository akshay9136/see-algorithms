import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAnimator, useSummary, useTreeControls, useTreeUrl } from '@/hooks';
import { randomKeys, showError, sleep } from '@/common/utils';
import { Draggable } from '@/components/common';
import bTree from '@/helpers/bTree';
import Paper from '@mui/material/Paper';

var Tree;

export default function useBTree({ saveData, allowRefresh = true }) {
  const [treeData, setTreeData] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [scope, animator] = useAnimator();
  const [summary, explain, abort] = useSummary();
  const [nodes, isReady] = useTreeUrl();

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
    if (!found) showError(`Key (${num}) not found.`);
  }

  const newTree = async (keys) => {
    keys = keys || randomKeys();
    setNumbers(keys.slice());
    Tree = bTree(animator);
    await sleep(100);
    keys.forEach((num) => Tree._insert(num));
    setTreeData(Tree.getSnapshot());
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
    if (isReady && allowRefresh) newTree(nodes);
  }, [nodes, isReady]);

  const transition = { duration: 0.5, ease: 'easeInOut' };

  const animation = (
    <Paper ref={scope} className="resizable" id="bTree">
      <Draggable>
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
      </Draggable>
    </Paper>
  );

  const refresh = controls.REFRESH.onClick;

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
