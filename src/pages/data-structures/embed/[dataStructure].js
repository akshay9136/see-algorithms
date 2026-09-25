import DSInput from '@/components/common/ds-input';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import {
  useBPlusTree,
  useBTree,
  useCircularQueue,
  useLinkedList,
  useMaxHeap,
  useBinaryTree,
} from '@/hooks/data-structures';
import { SITE_URL } from '@/utils/constants';
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
  if (dataStructure === 'LinkedList') return <LinkedList />;

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
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Box>
  );
}

function LinkedList() {
  const { animation, buttons, inputRefs } = useLinkedList();

  return (
    <Stack spacing={3} position="relative">
      <DSInput buttons={buttons.slice(0, 2)} hidePlayIcon ref={inputRefs[0]} />
      <DSInput
        buttons={buttons.slice(2)}
        label="Enter an index: "
        hidePlayIcon
        keepEmpty
        ref={inputRefs[1]}
      />
      {animation}
      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Stack>
  );
}
