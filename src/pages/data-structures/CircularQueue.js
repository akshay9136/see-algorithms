import { Box, Stack, Typography } from '@mui/material';
import DSInput from '@/components/common/ds-input';
import useCircularQueue from '@/hooks/data-structures/useCircularQueue';
import useAlgorithm from '@/hooks/useAlgorithm';

export default function CircularQueue(props) {
  const { animation, buttons } = useCircularQueue();

  const [enqueueAlgo] = useAlgorithm(`
function enqueue(value):
    if front == rear and size == n:
        alert "Queue is full."
    else:
        queue[rear] = value
        rear = (rear + 1) % n
        size = size + 1
`);
  const [dequeueAlgo] = useAlgorithm(`
function dequeue():
    if front == rear and size == 0:
        alert "Queue is empty."
    else:
        value = queue[front]
        front = (front + 1) % n
        size = size - 1
`);

  return (
    <Stack spacing={2}>
      <Typography>
        <strong>Circular Queue</strong> allows efficient use of space by reusing
        empty spots left by removed elements. In a circular queue, you have two
        pointers: one for the front (where you remove items) and one for the
        rear (where you add items). When the rear reaches the end, it circles
        back to the start, making the queue a continuous loop. This approach
        helps in situations where you have a fixed amount of memory and need to
        handle a continuous flow of data.
      </Typography>
      <Typography variant="h6" component="h2">
        Pseudocode
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap">
        {enqueueAlgo}
        {dequeueAlgo}
      </Box>
      <Typography variant="h6" component="h2" py={1}>
        Visualizer
      </Typography>
      <DSInput {...props} buttons={buttons} hidePlayIcon />
      {animation}
    </Stack>
  );
}
