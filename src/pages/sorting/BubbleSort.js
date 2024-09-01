import React, { useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import { InputNumbers, Numbox } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { try_, wait } from '@/common/utils';

var arr, delay = 800;

export default function BubbleSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, bgcolor }] = useAnimator();

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
        <>
            <section>
                <p>
                    Imagine a gentle giant sorting a stack of books by
                    repeatedly passing through the stack and swapping adjacent
                    books if they are out of order.{' '}
                    <strong>Bubble Sort</strong> is a simple yet effective
                    method for small datasets, making sure each element rises to
                    its proper place, like bubbles in a soda. Not the fastest,
                    but Bubble Sort is a friendly introduction to the concept of
                    sorting.
                </p>
            </section>
            <InputNumbers onStart={handleStart} onStop={handleStop} />
            <div className="d-flex pt-4" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </>
    );
}
