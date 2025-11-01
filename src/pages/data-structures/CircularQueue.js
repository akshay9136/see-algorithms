import React, { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import DSInput from '@/components/ds-input';
import { createGrid, randomInt, sound } from '@/common/utils';
import { showToast } from '@/components/toast';

const buttons = [
    { text: 'Enqueue', onClick: enqueue, validate: true },
    { text: 'Dequeue', onClick: dequeue },
];

export default function CircularQueue(props) {
    useEffect(() => {
        rear = 5;
        size = rear - front;
        document.querySelector('#cqueue').innerHTML = '';
        createGrid(n, '#cqueue');
        createGrid(n, '#cqueue');
        createGrid(n, '#cqueue');
        cells = document.querySelectorAll('.cell');
        cells[front].textContent = 'Front';
        cells[n + n + rear].textContent = 'Rear';
        for (let k = 0; k < n; k++) {
            if (k < rear && k >= front) {
                cells[k + n].textContent = randomInt();
            }
            cells[k].setAttribute('style', 'vertical-align:bottom;');
            cells[k + n + n].setAttribute('style', 'vertical-align:top;');
            cells[k + n].style.border = '2px solid';
        }
    }, []);

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
            <DSInput {...props} buttons={buttons} />
            <Box id="cqueue" className="numGrid" />
        </Stack>
    );
}

var cells, n = 12;
var front = 0, rear;
var size;

export function enqueue(num) {
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

export function dequeue() {
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
