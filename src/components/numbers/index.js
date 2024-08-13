import InputNumbers from './numbers';
import { motion } from 'framer-motion';
import styles from './numbers.module.css';

export function SortNumbers(props) {
  return (
    <div className={styles.sortNumbers}>
      <InputNumbers {...props} />
      {props.children}
    </div>
  );
}

export function Numbox({ index, value, ...rest }) {
  return (
    <motion.div className={styles.numbox} id={`box${index}`} {...rest}>
      {value}
    </motion.div>
  );
}

export function Node({ index, value, ...rest }) {
  return (
    <motion.div
      className={`${styles.numbox} ${styles.node}`}
      id={`node${index}`}
      {...rest}
    >
      {value}
    </motion.div>
  );
}

export function Edge({ index, value, ...rest }) {
  return <motion.div className={styles.edge} id={`edge${index}`} {...rest} />;
}
