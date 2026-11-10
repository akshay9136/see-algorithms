import { Stack, Box, Typography, Divider } from '@mui/material';
import {
  ComplexityTable,
  DSInput,
  Section,
  ListItems,
} from '@/components/common';
import { useDoublyLinkedList } from '@/hooks/data-structures';
import useAlgorithm from '@/hooks/useAlgorithm';
import Link from 'next/link';

export default function DoublyLinkedList() {
  const [insertAlgo1] = useAlgorithm(`
function insertAtHead(value):
    node = new Node(value)
    node.next = head.next
    node.prev = head
    if head.next is not null:
        head.next.prev = node
    head.next = node
`);

  const [insertAlgo2] = useAlgorithm(`
function insertAtTail(value):
    node = new Node(value)
    cur = head
    while cur.next is not null:
        cur = cur.next
    cur.next = node
    node.prev = cur
`);

  const [insertAlgo3] = useAlgorithm(`
function insertAt(index, value):
    if index == 0:
        insertAtHead(value)
        return
    cur = head
    for i = 1 to index:
        if cur.next is null: break
        cur = cur.next
    node = new Node(value)
    node.next = cur.next
    node.prev = cur
    if cur.next is not null:
        cur.next.prev = node
    cur.next = node
`);

  const [deleteAlgo] = useAlgorithm(`
function deleteAt(index):
    cur = head
    for i = 0 to index:
        prev = cur
        cur = cur.next
    if cur.next is not null:
        cur.next.prev = prev
    prev.next = cur.next
`);

  return (
    <>
      <Typography paragraph>
        A <strong>Doubly Linked List</strong> is a linear data structure where
        elements are stored in nodes, and each node points to both the next node
        and the previous node in the sequence. This allows for traversal in both
        directions, making certain operations more efficient compared to a
        singly <Link href="/data-structures/LinkedList">linked list</Link>, at
        the cost of extra memory for the previous pointer.
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Visualizer
        </Typography>
        <Visualizer />
        <Divider />
        <Typography variant="h6" component="h2">
          Pseudocode
        </Typography>
        <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
          <Stack spacing={2.5}>
            {insertAlgo1}
            {insertAlgo2}
          </Stack>
          {insertAlgo3}
          {deleteAlgo}
        </Box>
      </Stack>
      <Divider sx={{ my: 4 }} />

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Box flex={1}>
          <Section title="Key Properties">
            <ListItems sx={{ pl: 2, mb: 0 }}>
              <li>
                <strong>Bidirectional Traversal:</strong> Each node maintains
                two pointers (<code>next</code> and <code>prev</code>), enabling
                efficient traversal in both forward and reverse directions.
              </li>
              <li>
                <strong>Dynamic Allocation:</strong> Nodes are stored
                independently across heap memory and connected via pointers,
                eliminating the need for large contiguous memory blocks.
              </li>
              <li>
                <strong>Sequential Access:</strong> Direct indexing is not
                supported; finding an item requires linear traversal in O(n)
                time, though searches can start from either the head or tail
                depending on which is closer.
              </li>
              <li>
                <strong>Efficient Node Removal:</strong> Any node can be
                unlinked in strictly constant O(1) time given its direct
                reference, without traversing to find the preceding node.
              </li>
              <li>
                <strong>Memory Overhead:</strong> Each node requires extra
                storage for two pointer references alongside the data value,
                compared to a singly linked list.
              </li>
            </ListItems>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography>
              Doubly Linked Lists are essential whenever bidirectional
              navigation is required or when items must be removed in O(1) time
              without knowing their predecessor. They are the foundation of{' '}
              <strong>LRU (Least Recently Used) Caches</strong> (paired with a
              hash map to reorder nodes upon access in O(1) time), browser
              history navigation (forward and back buttons), undo-redo managers
              in graphic and text editors, and double-ended queues (Deques).
            </Typography>
          </Section>
        </Box>
        <ComplexityTable data={complexityData} />
      </Box>
    </>
  );
}

const complexityData = [
  {
    type: 'Access by Index',
    complexity: 'O(n)',
    description:
      'Can traverse from head forward or tail backward, taking O(n) worst-case steps.',
  },
  {
    type: 'Search by Value',
    complexity: 'O(n)',
    description: 'Linear scan through the chain comparing values.',
  },
  {
    type: 'Insert / Delete at Ends',
    complexity: 'O(1)',
    description:
      'Updates head or tail references and neighboring pointers in constant time.',
  },
  {
    type: 'Delete Given Node Pointer',
    complexity: 'O(1)',
    description:
      'Immediately links node.prev to node.next without traversing to find the predecessor.',
  },
  {
    type: 'Insert / Delete at Index',
    complexity: 'O(n)',
    description:
      'Requires traversing to the index before executing the O(1) pointer updates.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description:
      'Requires two pointer references (prev and next) per node, doubling pointer overhead.',
  },
];

export function Visualizer() {
  const { animation, buttons, inputRefs } = useDoublyLinkedList();

  return (
    <>
      <Box display="flex" flexWrap="wrap" gap={2}>
        <DSInput
          label="Insert a number:"
          hidePlayIcon
          buttons={buttons.slice(0, 2)}
          ref={inputRefs[0]}
        />
        <DSInput
          label="At index:"
          value={0}
          hidePlayIcon
          buttons={buttons.slice(2)}
          // eslint-disable-next-line react-hooks/refs
          ref={inputRefs[1]}
        />
      </Box>
      <br />
      {animation}
    </>
  );
}
