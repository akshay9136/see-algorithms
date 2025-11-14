import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Edge } from '@/components/numbers';
import DSInput from '@/components/ds-input';
import useAnimator from '@/hooks/useAnimator';
import { sleep } from '@/common/utils';
import linkedList from '@/helpers/linkedList';
import { motion } from 'framer-motion';

var list, delay = 500;

export default function LinkedList(props) {
  const [nodes, setNodes] = useState(['H']);
  const [scope, animator] = useAnimator();
  const { txy } = animator;

  const insertAtHead = async (value) => {
    if (!list) list = linkedList(animator);
    setNodes([...nodes, value]);
    await sleep(delay);
    await list.insertAtHead(value);
  };

  const insertAtTail = async (value) => {
    if (!list) list = linkedList(animator);
    setNodes([...nodes, value]);
    await sleep(delay);
    await list.insertAtTail(value);
  };

  const reset = () => {
    setNodes(['H']);
    list = null;
  };

  const buttons = [
    { text: 'Insert at head', onClick: insertAtHead, validate: true },
    { text: 'Insert at tail', onClick: insertAtTail, validate: true },
    { text: 'Clear', onClick: reset, disabled: nodes.length <= 1 },
  ];

  useEffect(() => {
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
      <DSInput {...props} buttons={buttons} />
      <Box
        ref={scope}
        sx={{
          height: 200,
          position: 'relative',
          width: '100%',
          overflow: 'auto',
        }}
      >
        {nodes.map((value, i) => (
          <motion.div key={i} id={`box${i}`} style={{ position: 'absolute' }}>
            <ToggleButtonGroup
              color="warning"
              value="data"
              size="small"
              sx={{ width: 60 }}
            >
              <ToggleButton
                value="data"
                sx={{
                  width: 45,
                  fontSize: 16,
                  padding: '4px 8px',
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
