import React, { useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import { Numbox, SortNumbers } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { bgcolor, try_, wait } from '@/common/utils';

var arr, delay = 800;

export default function BubbleSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx }] = useAnimator();

    if (!numbers.length) arr = undefined;

    const swapNumbers = async (u, v) => {
        await Promise.all([tx(`#box${u}`, 60, 0.5), tx(`#box${v}`, -60, 0.5)]);
        arr.swap(u, v);
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${u}`, 0, 0), tx(`#box${v}`, 0, 0)]);
    };

    const compare = async (u, v) => {
        bgcolor(`#box${u}`, Colors.compare);
        bgcolor(`#box${v}`, Colors.compare);
        if (u > 0) bgcolor(`#box${u - 1}`, Colors.white);
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
            bgcolor(`#box${k - 1}`, Colors.white);
            bgcolor(`#box${k}`, Colors.sorted);
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
