import { Box } from '@mui/material';
import { Visualizer as LLV } from '../LinkedList';
import { Visualizer as DLV } from '../DoublyLinkedList';
import { DSInput } from '@/components/common';
import { useRouter } from 'next/router';
import {
  useBPlusTree,
  useBTree,
  useCircularQueue,
  useMaxHeap,
  useBinaryTree,
} from '@/hooks/data-structures';
import searchTree from '@/common/searchTree';
import avlTree from '@/helpers/avlTree';
import redBlackTree from '@/helpers/redBlackTree';
import splayTree from '@/helpers/splayTree';

const useSearchTree = () =>
  useBinaryTree({
    createTree: searchTree,
    hideButtons: ['Search'],
    treeType: 'search',
  });

const useAvlTree = () =>
  useBinaryTree({
    createTree: (animator) => avlTree(animator, () => {}),
    hideButtons: ['Search'],
    treeType: 'avl',
  });

const useRedBlackTree = () =>
  useBinaryTree({
    createTree: redBlackTree,
    hideButtons: ['Search'],
    treeType: 'red-black',
  });

const useSplayTree = () =>
  useBinaryTree({
    createTree: splayTree,
    hideButtons: ['Delete'],
    treeType: 'splay',
  });

export default function EmbedDataStructure() {
  const router = useRouter();
  if (!router.isReady) return <div>Loading...</div>;

  const { dataStructure } = router.query;

  if (dataStructure.includes('LinkedList')) {
    return <LinkedList isDoubly={dataStructure.includes('Doubly')} />;
  }

  const hooks = {
    AVL: useAvlTree,
    BinaryHeap: useMaxHeap,
    BST: useSearchTree,
    BTree: useBTree,
    'B+Tree': useBPlusTree,
    CircularQueue: useCircularQueue,
    RedBlackTree: useRedBlackTree,
    SplayTree: useSplayTree,
  };

  const useHook = hooks[dataStructure];

  if (!useHook) {
    return <div>Algorithm not found</div>;
  }

  return <Visualizer useHook={useHook} />;
}

function Visualizer({ useHook }) {
  const { animation, buttons } = useHook({});

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      position="relative"
    >
      <DSInput buttons={buttons} />
      {animation}
      <a
        href={window.location.href.replace('/embed', '')}
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Box>
  );
}

function LinkedList({ isDoubly }) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
      position="relative"
    >
      {isDoubly ? <DLV /> : <LLV />}
      <a
        href={window.location.href.replace('/embed', '')}
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Box>
  );
}
