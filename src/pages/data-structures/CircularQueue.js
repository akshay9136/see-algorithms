import React, { useEffect } from 'react';
import DSInput from '@/components/ds-input/ds-input';
import { showToast } from '@/components/toast/toast';
import { createGrid, randomInt } from '@/common/utils';

const buttons = [
    { text: 'Enqueue', onClick: enqueue, validate: true },
    { text: 'Dequeue', onClick: dequeue },
];

export default function CircularQueue(props) {
    useEffect(() => {
        rear = 5;
        size = rear - front;
        document.querySelector('#queue').innerHTML = '';
        createGrid(n, '#queue');
        createGrid(n, '#queue');
        createGrid(n, '#queue');
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
        <>
            <section>
                <p>
                    <strong>Circular Queue</strong> allows efficient use of
                    space by reusing empty spots left by removed elements. In a
                    circular queue, you have two pointers: one for the front
                    (where you remove items) and one for the rear (where you add
                    items). When the rear reaches the end, it circles back to
                    the start, making the queue a continuous loop. This approach
                    helps in situations where you have a fixed amount of memory
                    and need to handle a continuous flow of data.
                </p>
            </section>
            <DSInput {...props} buttons={buttons} />
            <div id="queue" className="numGrid" />
        </>
    );
}

var cells, n = 12;
var front = 0, rear;
var size;

export function enqueue(num) {
    if (front === rear && size === n) {
        showToast({ message: 'Queue is full.', variant: 'error' });
    } else {
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
        cells[front].textContent = '';
        cells[front + n].textContent = '';
        front = ++front % n;
        cells[front].textContent = 'Front';
        size--;
    }
    return Promise.resolve();
}
