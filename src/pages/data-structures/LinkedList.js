import { useEffect, useState, useRef } from 'react';
import {
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DSInput, Edge } from '@/components/common';
import { showError, sleep } from '@/common/utils';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import linkedList from '@/helpers/linkedList';
import { motion } from 'framer-motion';

var list, delay = 500;

export default function LinkedList(props) {
  const [nodes, setNodes] = useState(['H']);
  const [scope, animator] = useAnimator();
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
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  async function* insertAtHead(value) {
    const { setStatus } = inputRef2.current;
    setStatus(1);
    setNodes([...nodes, value]);
    await sleep(delay);
    await list.insertAtHead(value);
    setStatus(0);
  }

  async function* insertAtTail(value) {
    const { setStatus } = inputRef2.current;
    setStatus(1);
    setNodes([...nodes, value]);
    await sleep(delay);
    await list.insertAtTail(value);
    setStatus(0);
  }

  async function* insertAt(index) {
    const { value, setStatus } = inputRef1.current;
    if (typeof value !== 'number') {
      showError('Please enter a number.');
      return;
    }
    setStatus(1);
    setNodes([...nodes, value]);
    await sleep(delay);
    const flag = await list.insertAt(value, index);
    await sleep(delay);
    if (flag) setNodes(nodes); // if index is out of bounds
    setStatus(0);
  }

  async function* deleteAt(index) {
    const { setStatus } = inputRef1.current;
    setStatus(1);
    await list.deleteAt(index);
    setStatus(0);
  }

  const buttons = [
    { text: 'Insert at head', onClick: insertAtHead, validate: true },
    { text: 'Insert at tail', onClick: insertAtTail, validate: true },
  ];

  const reset = () => {
    setNodes(['H']);
    list = linkedList(animator);
  };

  const buttons2 = [
    { text: 'Insert', onClick: insertAt, validate: true },
    { text: 'Delete', onClick: deleteAt, validate: true, keepEmpty: true },
    { text: 'Clear', onClick: reset, disabled: nodes.length <= 1 },
  ];

  useEffect(() => {
    reset();
    animator.txy(`#box${0}`, 0, 80, 0);
    return reset;
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="body1">
        A <strong>Linked List</strong> is a linear data structure where elements
        are stored in nodes, and each node points to the next node in the
        sequence. Unlike arrays, linked lists do not have a fixed size and can
        grow or shrink dynamically. This makes them efficient for insertions and
        deletions, but slower for direct access to an element.
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
        <Stack spacing={2}>
          {insertAlgo1}
          {insertAlgo2}
        </Stack>
        {insertAlgo3}
        {deleteAlgo}
      </Box>
      <Stack spacing={2}>
        <DSInput {...props} buttons={buttons} hidePlayIcon ref={inputRef1} />
        <DSInput
          {...props}
          buttons={buttons2}
          label="Enter an index: "
          hidePlayIcon
          keepEmpty
          ref={inputRef2}
        />
      </Stack>
      <Box ref={scope} className="sorting" overflow="auto">
        {nodes.map((value, i) => (
          <motion.div key={i} id={`box${i}`} style={{ position: 'absolute' }}>
            <ToggleButtonGroup
              size="small"
              sx={{ width: 60, gap: '1px' }}
              value="data"
              color={i > 0 ? 'info' : 'warning'}
            >
              <ToggleButton
                value="data"
                sx={{
                  fontSize: '1rem',
                  width: 45,
                  padding: '4px 8px',
                  border: '1px solid',
                }}
              >
                {value}
              </ToggleButton>
              <ToggleButton
                value="next"
                sx={{ flex: 1, border: '1px solid' }}
                id={`next${i}`}
              />
            </ToggleButtonGroup>
          </motion.div>
        ))}
        {nodes.slice(1).map((_, i) => (
          <Edge key={i} index={i} style={{ width: 40 }} />
        ))}
      </Box>
    </Stack>
  );
}
