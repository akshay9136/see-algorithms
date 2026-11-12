import { Stack, Box, Typography, Divider } from '@mui/material';
import {
  ComplexityTable,
  DSInput,
  Section,
  ListItems,
  AdUnit,
} from '@/components/common';
import { useLinkedList } from '@/hooks/data-structures';
import { useAlgorithm, useBreakpoints } from '@/hooks';

export default function LinkedList() {
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

  const { lgup } = useBreakpoints();

  return (
    <>
      <Typography mb={3}>
        A <strong>Linked List</strong> is a linear data structure where elements
        are stored in standalone nodes, each holding a data value and a pointer
        to the next node in sequence. Unlike arrays, linked lists do not require
        contiguous memory allocation and can dynamically expand and contract
        without expensive resizing or reallocation. This makes insertions and
        deletions at known positions strictly constant time O(1), though random
        access requires a linear traversal.
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Visualizer
        </Typography>
        <Box display="flex" gap={3}>
          <Visualizer />
          {lgup && <AdUnit fullWidth="true" />}
        </Box>
      </Stack>
      <Divider sx={{ my: 3 }} />

      <Stack spacing={2}>
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
                <strong>Dynamic Structure:</strong> Allocates memory dynamically
                for individual nodes at runtime, expanding and contracting
                without predefined capacity or costly array reallocations.
              </li>
              <li>
                <strong>Non-Contiguous Storage:</strong> Nodes are stored
                independently across heap memory and connected via pointers,
                eliminating the need for large contiguous memory blocks.
              </li>
              <li>
                <strong>Sequential Access:</strong> Direct random access by
                index is not supported; locating an element requires traversing
                from the head node in O(n) time.
              </li>
              <li>
                <strong>Efficient Insertion &amp; Deletion:</strong> Inserting
                or removing elements at known positions requires only pointer
                updates in constant O(1) time without shifting elements.
              </li>
              <li>
                <strong>Pointer Overhead:</strong> Every node incurs additional
                memory overhead to store reference pointers alongside its data
                payload.
              </li>
            </ListItems>
          </Section>
          <Section title="When to Use" sx={{ mb: 0 }}>
            <Typography paragraph>
              Linked lists are ideal when the total number of items is unknown
              in advance, frequent insertions or deletions occur at the
              beginning of the collection (such as implementing Stacks or
              Queues), or memory fragmentation makes allocating a large
              contiguous array impossible. They also form the standard structure
              for graph adjacency lists and hash table collision chaining. When
              constant-time random access (<code>arr[i]</code>) or
              cache-friendly sequential iteration is critical, contiguous arrays
              should be preferred.
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
      'Must traverse sequentially from the head node to the target index.',
  },
  {
    type: 'Search by Value',
    complexity: 'O(n)',
    description: 'Requires a linear scan through the chain comparing values.',
  },
  {
    type: 'Insert / Delete at Head',
    complexity: 'O(1)',
    description:
      'Updates the head pointer and next reference in constant time without element shifting.',
  },
  {
    type: 'Insert / Delete at Tail',
    complexity: 'O(n)',
    description:
      'Traverses to the end unless a direct tail pointer is maintained.',
  },
  {
    type: 'Insert / Delete at Index',
    complexity: 'O(n)',
    description:
      'Takes O(n) to traverse to the position, followed by an O(1) pointer assignment.',
  },
  {
    type: 'Space Complexity',
    complexity: 'O(n)',
    description:
      'Stores n data items with one pointer reference per node overhead.',
  },
];

export function Visualizer() {
  const { animation, buttons, inputRefs } = useLinkedList();

  return (
    <Stack spacing={2}>
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
    </Stack>
  );
}
