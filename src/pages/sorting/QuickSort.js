import React, { useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import { Numbox, SortNumbers } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { bgcolor, wait } from '@/common/utils';

var arr, delay = 1000;

export default function QuickSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty }] = useAnimator();

    if (!numbers.length) arr = undefined;

    const swap = async (a, b) => {
        const d = b - a;
        await Promise.all([ty(`#box${a}`, 50), ty(`#box${b}`, -50)]);
        await Promise.all([
            tx(`#box${a}`, d * 60, 0.5),
            tx(`#box${b}`, -d * 60, 0.5),
        ]);
        await Promise.all([ty(`#box${a}`, 0), ty(`#box${b}`, 0)]);
        arr.swap(a, b);
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${a}`, 0, 0), tx(`#box${b}`, 0, 0)]);
    };

    const divide = async (start, end) => {
        bgcolor(`#box${end}`, Colors.sorted);
        await wait(delay);
        let i = start,
            j = end - 1;
        bgcolor(`#box${i}`, Colors.compare);
        bgcolor(`#box${j}`, Colors.compare);
        await wait(delay);
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
            await wait(delay);
        }
        if (i < end && arr[i] > arr[end]) {
            bgcolor(`#box${i}`, Colors.sorted);
            await wait(500);
            await swap(i, end);
            await wait(500);
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
        await wait(delay);
        await quickSort(start, pivot - 1);
        await wait(delay);
        await quickSort(pivot + 1, end);
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        setTimeout(quickSort, delay, 0, arr.length - 1);
    };

    const handleStop = () => setNumbers([]);

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="d-flex pt-5" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </SortNumbers>
    );
}
