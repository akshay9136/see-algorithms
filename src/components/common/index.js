import InputNumbers from './input-numbers';
import DrawGraph from './draw-graph';
import DSInput from './ds-input';
import { motion } from 'framer-motion';
import { memo } from 'react';
import styles from '@/styles/numbers.module.css';

export { InputNumbers, DrawGraph, DSInput };

export const Numbox = memo(
  function ({ index, value, ...rest }) {
    return (
      <motion.div
        className={styles.numbox}
        animate={{ x: index * 60 }}
        id={`box${index}`}
        {...rest}
      >
        {value}
      </motion.div>
    );
  }
);

export const Node = memo(
  function ({ index, value, showBf, ...rest }) {
    return (
      <motion.div
        className={`${styles.numbox} ${styles.node} treeNode`}
        id={`node${index}`}
        {...rest}
      >
        {value}
        {showBf && <span id={'nodeBf' + index} />}
      </motion.div>
    );
  }
);

export const Edge = memo(
  function ({ index, value, ...rest }) {
    return (
      <motion.div
        className={styles.edge + ' nodeEdge'}
        id={`edge${index}`}
        {...rest}
      >
        {value}
        <div className={styles.arrow} id={`arrow${index}`} />
      </motion.div>
    );
  }
);
