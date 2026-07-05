import styles from '@/styles/numbers.module.css';
import { motion } from 'motion/react';
import { memo } from 'react';
import InputNumbers from './input-numbers';
import DrawGraph, { Plane } from './draw-graph';
import CustomSeo from './custom-seo';
import Article, { Section, ListItems } from './article';
import ComplexityTable from './complexity-table';
import SavedDataList from './saved-data';
import DSInput from './ds-input';
import Spinner from './spinner';

export {
  InputNumbers,
  DrawGraph,
  Plane,
  CustomSeo,
  Article,
  Section,
  ListItems,
  ComplexityTable,
  SavedDataList,
  DSInput,
  Spinner,
};

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

export const Numkey = memo(
  function ({ index, value, ...rest }) {
    return (
      <motion.span
        className={`numkey${index}`}
        style={{
          color: '#606060',
          position: 'absolute',
          fontWeight: 'bold',
          fontSize: 14,
        }}
        {...rest}
      >
        {value}
      </motion.span>
    );
  }
);

export const Node = memo(
  function ({ index, value, showBf, ...rest }) {
    return (
      <motion.div
        className={`${styles.numbox} ${styles.node} node${index}`}
        {...rest}
      >
        {value}
        {showBf && <span className={`tag${index}`} />}
      </motion.div>
    );
  }
);

export const Edge = memo(
  function ({ index, value, ...rest }) {
    return (
      <motion.div
        className={`${styles.edge} edge${index}`}
        {...rest}
      >
        {value}
        <div className={`${styles.arrow} arrow${index}`} />
      </motion.div>
    );
  }
);
