import { Stack, Box, Typography, Divider } from '@mui/material';
import DSInput from '@/components/common/ds-input';
import useLinkedList from '@/hooks/data-structures/useLinkedList';
import useAlgorithm from '@/hooks/useAlgorithm';

export default function LinkedList(props) {
  const { animation, buttons, inputRefs } = useLinkedList();

  const [insertAlgo1] = useAlgorithm(`
function insertAtHead(value):
    node = new Node(value)
    node.next = head.next
    head.next = node
`);

  const [insertAlgo2] = useAlgorithm(`
function insertAtTail(value):
    node = new Node(value)
    cur = head
    while cur.next is not null:
        cur = cur.next
    cur.next = node
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
    cur.next = node
`);

  const [deleteAlgo] = useAlgorithm(`
function deleteAt(index):
    cur = head
    prev = null
    for i = 0 to index:
        prev = cur
        cur = cur.next
    prev.next = cur.next
`);

  return (
    <Stack spacing={2}>
      <Typography>
        A <strong>Linked List</strong> is a linear data structure where elements
        are stored in nodes, and each node points to the next node in the
        sequence. Unlike arrays, linked lists do not have a fixed size and can
        grow or shrink dynamically. This makes them efficient for insertions and
        deletions, but slower for direct access to an element.
      </Typography>

      <Typography variant="h6" component="h2">
        Visualizer
      </Typography>
      <DSInput
        {...props}
        buttons={buttons.slice(0, 2)}
        hidePlayIcon
        ref={inputRefs[0]}
      />
      <DSInput
        {...props}
        buttons={buttons.slice(2)}
        label="Enter an index: "
        hidePlayIcon
        keepEmpty
        ref={inputRefs[1]}
      />
      <br />
      {animation}
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
