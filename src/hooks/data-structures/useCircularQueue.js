import { useState } from 'react';
import { showError, sound } from '@/common/utils';
import Box from '@mui/material/Box';

const n = 12;

export default function useCircularQueue() {
  const [numbers, setNumbers] = useState(Array(n).fill(null));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(0);
  const [size, setSize] = useState(0);

  // eslint-disable-next-line require-yield
  async function* enqueue(num) {
    if (front === rear && size === n) {
      showError('Queue is full.');
    } else {
      sound('pop');
      numbers[rear] = num;
      setNumbers(numbers.slice());
      setRear((rear + 1) % n);
      setSize(size + 1);
    }
  }

  function dequeue() {
    if (front === rear && size === 0) {
      showError('Queue is empty.');
    } else {
      sound('pop');
      numbers[front] = null;
      setNumbers(numbers.slice());
      setFront((front + 1) % n);
      setSize(size - 1);
    }
  }

  const buttons = [
    { text: 'Enqueue', onClick: enqueue, validate: true },
    { text: 'Dequeue', onClick: dequeue },
  ];

  const animation = (
    <Box className="alphaGrid numGrid" display="block !important">
      <Box display="flex">
        {numbers.map((_, i) => (
          <Box key={i} className="cell" style={{ border: 0 }}>
            {i === front ? 'Front' : ''}
          </Box>
        ))}
      </Box>
      <Box display="flex">
        {numbers.map((num, i) => (
          <Box key={i} className="cell">
            {num}
          </Box>
        ))}
      </Box>
      <Box display="flex">
        {numbers.map((_, i) => (
          <Box key={i} className="cell" style={{ border: 0 }}>
            {i === rear ? 'Rear' : ''}
          </Box>
        ))}
      </Box>
    </Box>
  );

  return { animation, buttons };
}
