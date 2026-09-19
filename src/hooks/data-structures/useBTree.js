import { AnimatePresence, motion } from 'motion/react';
import { Draggable } from '@/components/common';
import useBTreeBase from './useBTreeBase';
import bTree from '@/helpers/bTree';
import Paper from '@mui/material/Paper';

export default function useBTree({ randomNodes }) {
  const { scope, treeData, ...rest } = useBTreeBase({
    createTree: bTree,
    randomNodes,
  });

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

  return { animation, ...rest };
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
