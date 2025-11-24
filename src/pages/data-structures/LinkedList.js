import { useEffect, useState, useRef } from 'react';
import {
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DSInput, Edge } from '@/components/common';
import useAnimator from '@/hooks/useAnimator';
import linkedList from '@/helpers/linkedList';
import { sleep } from '@/common/utils';
import { motion } from 'framer-motion';
import { showToast } from '@/components/toast';

var list, delay = 500;

export default function LinkedList(props) {
  const [nodes, setNodes] = useState(['H']);
  const [scope, animator] = useAnimator();
  const inputRef = useRef(null);
  const { txy } = animator;

  const insertAtHead = async (value) => {
    setNodes([...nodes, value]);
    await sleep(delay);
    await list.insertAtHead(value);
  };

  const insertAtTail = async (value) => {
    setNodes([...nodes, value]);
    await sleep(delay);
    await list.insertAtTail(value);
  };

  const insertAtIndex = async (index) => {
    const value = inputRef.current.getValue();
    if (typeof value !== 'number') {
      showToast({
        message: 'Please enter a number.',
        variant: 'error',
      });
      return;
    }
    setNodes([...nodes, value]);
    await sleep(delay);
    await list.insertAtIndex(value, index);
  };

  const deleteAtIndex = (index) => {
    return list.deleteAtIndex(index);
  };

  const reset = () => {
    setNodes(['H']);
    list = linkedList(animator);
  };

  const buttons = [
    { text: 'Insert at head', onClick: insertAtHead, validate: true },
    { text: 'Insert at tail', onClick: insertAtTail, validate: true },
  ];

  const buttons2 = [
    { text: 'Insert', onClick: insertAtIndex, validate: true },
    { text: 'Delete', onClick: deleteAtIndex, validate: true, keepEmpty: true },
    { text: 'Clear', onClick: reset, disabled: nodes.length <= 1 },
  ];

  useEffect(() => {
    reset();
    txy(`#box${0}`, 0, 80, 0);
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
      <Stack spacing={2}>
        <DSInput {...props} buttons={buttons} ref={inputRef} />
        <DSInput
          {...props}
          buttons={buttons2}
          label="Enter an index: "
          keepEmpty
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
                  width: 45,
                  padding: '4px 8px',
                  fontSize: 16,
                  border: '1.5px solid gray',
                  fontWeight: 'bold',
                }}
              >
                {value}
              </ToggleButton>
              <ToggleButton
                value="next"
                sx={{ flex: 1, border: '1.5px solid gray' }}
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
