import React, { useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { InputNumbers, Numbox } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { sleep, sound } from '@/common/utils';

var arr, delay = 1000;

export default function QuickSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [algorithm] = useAlgorithm(`
    function quickSort(start, end):
        if start < end:
            pivot = partition(start, end)
            quickSort(start, pivot - 1)
            quickSort(pivot + 1, end)
    `);

    if (!numbers.length) arr = undefined;

    const swap = async (a, b) => {
        const d = b - a;
        await Promise.all([ty(`#box${a}`, 50), ty(`#box${b}`, -50)]);
        sound('swap');
        await Promise.all([
            tx(`#box${a}`, d * 60, 0.2 * d),
            tx(`#box${b}`, -d * 60, 0.2 * d),
        ]);
        await Promise.all([ty(`#box${a}`, 0), ty(`#box${b}`, 0)]);
        arr.swap(a, b);
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${a}`, 0, 0), tx(`#box${b}`, 0, 0)]);
    };

    const divide = async (start, end) => {
        bgcolor(`#box${end}`, Colors.sorted);
        await sleep(delay);
        let i = start,
            j = end - 1;
        bgcolor(`#box${i}`, Colors.compare);
        bgcolor(`#box${j}`, Colors.compare);
        await sleep(delay);
        while (i < j) {
            if (arr[i] <= arr[end]) {
                i++;
                bgcolor(`#box${i - 1}`, Colors.white);
                bgcolor(`#box${i}`, Colors.compare);
            } else if (arr[j] > arr[end]) {
                j--;
                bgcolor(`#box${j + 1}`, Colors.white);
                bgcolor(`#box${j}`, Colors.compare);
            } else {
                await swap(i, j);
            }
            await sleep(delay);
        }
        if (i < end && arr[i] > arr[end]) {
            bgcolor(`#box${i}`, Colors.sorted);
            await sleep(500);
            await swap(i, end);
            await sleep(500);
            bgcolor(`#box${end}`, Colors.white);
        } else {
            bgcolor(`#box${i}`, Colors.white);
            i = end;
        }
        return i;
    };

    const quickSort = async (start, end) => {
        if (start >= end) {
            bgcolor(`#box${start}`, Colors.sorted);
            return;
        }
        const pivot = await divide(start, end);
        await sleep(delay);
        await quickSort(start, pivot - 1);
        await sleep(delay);
        await quickSort(pivot + 1, end);
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        sleep(delay).then(() => {
            quickSort(0, arr.length - 1).catch(() => {});
        });
    };

    const handleStop = () => setNumbers([]);

    return (
        <>
            <p>
                <strong>Quick Sort</strong> is the speedster of sorting
                algorithms. It picks a <strong>pivot</strong> element and then
                arranges the rest of the elements into two groups: those less
                than the pivot and those greater. By recursively sorting these
                groups, Quick Sort efficiently sorts even the largest datasets.
                It is perfect blend of strategy and speed, making it one of the
                most popular sorting techniques.
            </p>
            {algorithm}
            <InputNumbers onStart={handleStart} onStop={handleStop} />
            <div className="d-flex py-5 mb-4" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </>
    );
}
