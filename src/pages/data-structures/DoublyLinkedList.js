import { Stack, Box, Typography, Divider } from '@mui/material';
import { useDoublyLinkedList } from '@/hooks/data-structures';
import useAlgorithm from '@/hooks/useAlgorithm';
import DSInput from '@/components/common/ds-input';
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
    <Stack spacing={2}>
      <Typography>
        A <strong>Doubly Linked List</strong> is a linear data structure where
        elements are stored in nodes, and each node points to both the next node
        and the previous node in the sequence. This allows for traversal in both
        directions, making certain operations more efficient compared to a
        singly <Link href="/data-structures/LinkedList">linked list</Link>, at
        the cost of extra memory for the previous pointer.
      </Typography>

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
  );
}

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
          ref={inputRefs[1]}
        />
      </Box>
      <br />
      {animation}
    </>
  );
}
