import InputNumbers from './input-numbers';
import { motion } from 'framer-motion';
import styles from './numbers.module.css';

export { InputNumbers };

export function Numbox({ index, value, ...rest }) {
  return (
    <motion.div className={styles.numbox} id={`box${index}`} {...rest}>
      {value}
    </motion.div>
  );
}

export function Node({ index, value, showBf, ...rest }) {
  return (
    <motion.div
      className={`${styles.numbox} ${styles.node}`}
      id={`node${index}`}
      {...rest}
    >
      {value}
      {showBf && <span id={'nodeBf' + index} />}
    </motion.div>
  );
}

export function Edge({ index, value, ...rest }) {
  return <motion.div className={styles.edge} id={`edge${index}`} {...rest} />;
}
