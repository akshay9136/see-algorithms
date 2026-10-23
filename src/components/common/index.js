import styles from '@/styles/numbers.module.css';
import { motion } from 'motion/react';
import { memo } from 'react';
import Article, { Section, ListItems } from './article';
import CodeSnippet from './code-snippet';
import ComplexityTable from './complexity-table';
import CustomSeo from './custom-seo';
import Draggable from './draggable';
import DrawGraph, { Plane } from './draw-graph';
import DSInput from './ds-input';
import InputNumbers from './input-numbers';
import SavedDataList from './saved-data';
import SortingVisualizer from './sorting-visualizer';
import SpeedControl from './speed-control';
import Spinner from './spinner';

export {
  Article,
  Section,
  ListItems,
  CodeSnippet,
  ComplexityTable,
  CustomSeo,
  Draggable,
  DrawGraph,
  Plane,
  DSInput,
  InputNumbers,
  SavedDataList,
  SortingVisualizer,
  SpeedControl,
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
        initial={{ opacity: 0 }}
        {...rest}
      >
        {value}
        <div className={`${styles.arrow} arrow${index}`} />
      </motion.div>
    );
  }
);
