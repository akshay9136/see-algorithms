import { useEffect } from 'react';
import { DSInput } from '@/components/common';
import { Box, Stack, Typography } from '@mui/material';
import { createGrid, showError, sound } from '@/common/utils';
import $ from 'jquery';
import useAlgorithm from '@/hooks/useAlgorithm';

var cells, n = 10;
var front = 0, rear = 0;
var size = 0;

export default function CircularQueue(props) {
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

    useEffect(() => {
        $('#cqueue').html('');
        createGrid(n, '#cqueue');
        createGrid(n, '#cqueue');
        createGrid(n, '#cqueue');
        cells = $('.cell');
        cells.eq(front).text('Front');
        cells.eq(n + n + rear).text('Rear');
        for (let k = 0; k < n; k++) {
            cells.eq(k).css({ verticalAlign: 'bottom', border: 'none' });
            cells.eq(k + n + n).css({ verticalAlign: 'top', border: 'none' });
        }
    }, []);

    const buttons = [
        { text: 'Enqueue', onClick: enqueue, validate: true },
        { text: 'Dequeue', onClick: dequeue },
    ];

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Circular Queue</strong> allows efficient use of space by
                reusing empty spots left by removed elements. In a circular
                queue, you have two pointers: one for the front (where you
                remove items) and one for the rear (where you add items). When
                the rear reaches the end, it circles back to the start, making
                the queue a continuous loop. This approach helps in situations
                where you have a fixed amount of memory and need to handle a
                continuous flow of data.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                {enqueueAlgo}
                {dequeueAlgo}
            </Box>
            <DSInput {...props} buttons={buttons} hidePlayIcon />
            <Box id="cqueue" className="alphaGrid numGrid" />
        </Stack>
    );
}

async function* enqueue(num) {
    if (front === rear && size === n) {
        showError('Queue is full.');
    } else {
        sound('pop');
        cells.eq(n + rear).text(num);
        cells.eq(n + n + rear).text('');
        rear = ++rear % n;
        cells.eq(n + n + rear).text('Rear');
        size++;
    }
}

function dequeue() {
    if (front === rear && size === 0) {
        showError('Queue is empty.');
    } else {
        sound('pop');
        cells.eq(front).text('');
        cells.eq(front + n).text('');
        front = ++front % n;
        cells.eq(front).text('Front');
        size--;
    }
}
