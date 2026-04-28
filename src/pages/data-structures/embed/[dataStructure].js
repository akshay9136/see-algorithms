import DSInput from '@/components/common/ds-input';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import {
  useAvlTree,
  useBTree,
  useCircularQueue,
  useLinkedList,
  useMaxHeap,
  useRedBlackTree,
  useSearchTree,
  useSplayTree,
} from '@/hooks/data-structures';

export default function EmbedDataStructure() {
  const router = useRouter();
  const { dataStructure } = router.query;

  if (dataStructure === 'LinkedList') {
    return <LinkedList />
  }

  const hooks = {
    AVL: useAvlTree,
    BinaryHeap: useMaxHeap,
    BST: useSearchTree,
    BTree: useBTree,
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
  const { animation, buttons } = useHook();

  return (
    <Stack spacing={3} position="relative">
      <DSInput buttons={buttons} />
      {animation}
      <a
        href="https://see-algorithms.com"
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Stack>
  );
}

function LinkedList() {
  const { animation, buttons, inputRefs } = useLinkedList();

  return (
    <Stack spacing={3} position="relative">
      <DSInput
        buttons={buttons.slice(0, 2)}
        hidePlayIcon
        ref={inputRefs[0]}
      />
      <DSInput
        buttons={buttons.slice(2)}
        label="Enter an index: "
        hidePlayIcon
        keepEmpty
        ref={inputRefs[1]}
      />
      {animation}
      <a
        href="https://see-algorithms.com"
        target="_blank"
        rel="noopener noreferrer"
        className="watermark"
      >
        See Algorithms
      </a>
    </Stack>
  );
}
