import { AnimatePresence, motion } from 'motion/react';
import { Draggable } from '@/components/common';
import useBTreeBase from './useBTreeBase';
import bPlusTree from '@/helpers/bPlusTree';
import Paper from '@mui/material/Paper';

export default function useBPlusTree({ randomNodes }) {
  const { scope, treeData, ...rest } = useBTreeBase({
    createTree: bPlusTree,
    randomNodes,
  });

  const transition = { duration: 0.5, ease: 'easeInOut' };

  const animation = (
    <Paper ref={scope} className="resizable" id="bPlusTree">
      <Draggable>
        <svg style={styles.svg}>
          <AnimatePresence>
            {/* Tree edges (parent → child) */}
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
            {/* Leaf-chain horizontal */}
            {treeData?.leafLinks.map((link) => (
              <motion.line
                key={link.id}
                initial={{ ...link, opacity: 0 }}
                animate={{ ...link, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
                stroke="#66bb6a"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                markerEnd="url(#arrowHead)"
              />
            ))}
            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowHead"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#66bb6a" />
              </marker>
            </defs>
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
              style={node.isLeaf ? styles.leafNode : styles.internalNode}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {treeData?.keys.map((key) => (
            <motion.div
              key={`${key.nodeId}-${key.value}`}
              initial={{ opacity: 0, x: key.x, y: key.y }}
              animate={{ opacity: 1, x: key.x, y: key.y }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={transition}
              style={key.isLeaf ? styles.leafKey : styles.internalKey}
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

const baseNode = {
  position: 'absolute',
  height: 40,
  borderRadius: 8,
  zIndex: 1,
};

const baseKey = {
  position: 'absolute',
  width: 50,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 16,
  zIndex: 2,
  pointerEvents: 'none',
  userSelect: 'none',
};

const styles = {
  svg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  internalNode: {
    ...baseNode,
    backgroundColor: '#e3f1fc',
    border: '1px solid #90c4f0',
  },
  leafNode: {
    ...baseNode,
    backgroundColor: '#e8f5e9',
    border: '1px solid #66bb6a',
  },
  internalKey: { ...baseKey, color: '#2c6faa' },
  leafKey: { ...baseKey, color: '#2e7d32' },
};
