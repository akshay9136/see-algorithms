import React, { useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import { Numbox, SortNumbers } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { bgcolor, try_, wait } from '@/common/utils';

var arr, delay = 700;

export default function SelectionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty }] = useAnimator();

    if (!numbers.length) arr = undefined;

    const pickNumber = async (i) => {
        await ty(`#box${i}`, -50, 0.5);
        await wait(delay);
    };

    const sortNumbers = try_(async () => {
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            await pickNumber(i);
            let k = i;
            for (let j = i + 1; j < n; j++) {
                bgcolor(`#box${j}`, Colors.compare);
                bgcolor(`#box${j - 1}`, Colors.white);
                await wait(delay);
                if (arr[j] < arr[k]) {
                    ty(`#box${k}`, 0, 0.5);
                    await pickNumber(j);
                    k = j;
                }
            }
            bgcolor(`#box${n - 1}`, Colors.white);
            await wait(delay);
            if (k > i) {
                await ty(`#box${i}`, 50, 0.5);
                await swapNumbers(i, k);
            } else {
                await ty(`#box${k}`, 0, 0.5);
            }
            bgcolor(`#box${i}`, Colors.sorted);
            await wait(1000);
        }
        bgcolor(`#box${n - 1}`, Colors.sorted);
    });

    const swapNumbers = async (i, j) => {
        let k = j - i;
        await Promise.all([
            tx(`#box${i}`, k * 60, 0.2 * k),
            tx(`#box${j}`, -k * 60, 0.2 * k),
        ]);
        await Promise.all([ty(`#box${i}`, 0, 0.5), ty(`#box${j}`, 0, 0.5)]);
        arr.swap(i, j);
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${i}`, 0, 0), tx(`#box${j}`, 0, 0)]);
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        setTimeout(sortNumbers, 1000);
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
