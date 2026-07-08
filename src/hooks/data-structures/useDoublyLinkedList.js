import { useEffect, useState, useRef } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Edge } from '@/components/common';
import { showError, sleep } from '@/common/utils';
import { motion } from 'motion/react';
import doublyLinkedList from '@/helpers/doublyLinkedList';
import useAnimator from '@/hooks/useAnimator';

var list, delay = 500;

export default function useDoublyLinkedList() {
  const [nodes, setNodes] = useState(['H']);
  const [scope, animator] = useAnimator();
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

  const reset = () => {
    setNodes(['H']);
    list = doublyLinkedList(animator);
  };

  const buttons = [
    { text: 'Insert at head', onClick: insertAtHead, validate: true },
    { text: 'Insert at tail', onClick: insertAtTail, validate: true },
    { text: 'Insert', onClick: insertAt, validate: true },
    { text: 'Delete', onClick: deleteAt, validate: true, keepEmpty: true },
    { text: 'Clear', onClick: reset, disabled: nodes.length <= 1 },
  ];

  useEffect(() => {
    reset();
    animator.txy(`#box${0}`, 0, 80, 0);
    return reset;
  }, []);

  const animation = (
    <Box ref={scope} className="sorting" overflow="auto">
      {nodes.map((value, i) => (
        <motion.div key={i} id={`box${i}`} style={{ position: 'absolute' }}>
          <ToggleButtonGroup
            size="small"
            sx={{ width: 75, gap: '1px', pointerEvents: 'none' }}
            value="data"
            color={i > 0 ? 'info' : 'warning'}
          >
            <ToggleButton
              value="prev"
              sx={{ flex: 1, border: '1px solid' }}
              id={`prev${i}`}
            />
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
        <div key={i}>
          <Edge index={`${i}Next`} style={{ width: 30 }} />
          <Edge index={`${i}Prev`} style={{ width: 30 }} />
        </div>
      ))}
    </Box>
  );

  return { animation, buttons, inputRefs: [inputRef1, inputRef2] };
}
