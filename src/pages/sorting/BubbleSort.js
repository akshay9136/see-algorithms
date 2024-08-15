import React, { useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import { Numbox, SortNumbers } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { try_, wait } from '@/common/utils';

var arr, delay = 500;

export default function BubbleSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { bgcolor, tx }] = useAnimator();
    if (!numbers.length) arr = undefined;

    const swapNumbers = async (a, b) => {
        await Promise.all([tx(`#box${a}`, 60, 0.5), tx(`#box${b}`, -60, 0.5)]);
        let num = arr[a];
        arr[a] = arr[b];
        arr[b] = num;
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${a}`, 0, 0), tx(`#box${b}`, 0, 0)]);
    };

    const compare = async (a, b) => {
        await Promise.all([
            bgcolor(`#box${a}`, Colors.compare),
            bgcolor(`#box${b}`, Colors.compare),
            a > 0 ? bgcolor(`#box${a - 1}`, Colors.white) : Promise.resolve(),
        ]);
        await wait(delay);
    };

    const bubbleSort = try_(async () => {
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < n - i; j++) {
                await compare(j, j + 1);
                if (arr[j] > arr[j + 1]) {
                    await swapNumbers(j, j + 1);
                    await wait(delay);
                }
            }
            let k = n - i;
            await Promise.all([
                bgcolor(`#box${k - 1}`, Colors.white),
                bgcolor(`#box${k}`, Colors.sorted),
            ]);
            await wait(delay);
        }
        bgcolor(`#box${0}`, Colors.sorted);
    });

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        setTimeout(bubbleSort, 1000);
    };

    const handleStop = () => setNumbers([]);

    return (
        <SortNumbers onStart={handleStart} onStop={handleStop}>
            <div className="d-flex pt-4" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </SortNumbers>
    );
}
