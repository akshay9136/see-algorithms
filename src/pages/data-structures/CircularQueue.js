import React, { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import DSInput from '@/components/ds-input';
import useAlgorithm from '@/hooks/useAlgorithm';
import { createGrid, sound } from '@/common/utils';
import { showToast } from '@/components/toast';

var cells, n = 10;
var front = 0, rear = 0;
var size = 0;

export default function CircularQueue(props) {
    const [enqueueAlgorithm] = useAlgorithm(`
function enqueue(value):
    if front == rear and size == n:
        alert "Queue is full."
    else:
        queue[rear] = value
        rear = (rear + 1) % n
        size = size + 1
`);
    const [dequeueAlgorithm] = useAlgorithm(`
function dequeue():
    if front == rear and size == 0:
        alert "Queue is empty."
    else:
        value = queue[front]
        front = (front + 1) % n
        size = size - 1
`);

    useEffect(() => {
        document.querySelector('#cqueue').innerHTML = '';
        createGrid(n, '#cqueue');
        createGrid(n, '#cqueue');
        createGrid(n, '#cqueue');
        cells = document.querySelectorAll('.cell');
        cells[front].textContent = 'Front';
        cells[n + n + rear].textContent = 'Rear';
        for (let k = 0; k < n; k++) {
            cells[k].setAttribute('style', 'vertical-align:bottom;');
            cells[k + n + n].setAttribute('style', 'vertical-align:top;');
            cells[k + n + n].style.border = 'none';
            cells[k].style.border = 'none';
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
                {enqueueAlgorithm}
                {dequeueAlgorithm}
            </Box>
            <DSInput {...props} buttons={buttons} />
            <Box id="cqueue" className="alphaGrid numGrid" />
        </Stack>
    );
}

function enqueue(num) {
    if (front === rear && size === n) {
        showToast({ message: 'Queue is full.', variant: 'error' });
    } else {
        sound('pop');
        cells[n + rear].textContent = num;
        cells[n + n + rear].textContent = '';
        rear = ++rear % n;
        cells[n + n + rear].textContent = 'Rear';
        size++;
    }
    return Promise.resolve();
}

function dequeue() {
    if (front === rear && size === 0) {
        showToast({ message: 'Queue is empty.', variant: 'error' });
    } else {
        sound('pop');
        cells[front].textContent = '';
        cells[front + n].textContent = '';
        front = ++front % n;
        cells[front].textContent = 'Front';
        size--;
    }
    return Promise.resolve();
}
