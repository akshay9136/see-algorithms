import React, { useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { InputNumbers, Numbox } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { sleep, sound } from '@/common/utils';

var arr, delay = 800;

export default function BubbleSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, bgcolor }] = useAnimator();
    const [algorithm, setCurrentStep] = useAlgorithm(`
    for i = 1 to (n - 1):
        swapped = false
        for j = 1 to (n - i):
            if arr[j] < arr[j + 1]:
                swap(j, j + 1)
                swapped = true
        if not swapped:
            break
    `);

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
    };

    const bubbleSort = async () => {
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            await sleep(delay);
            setCurrentStep('0,1');
            await sleep(delay);
            let swap = false;
            for (let j = 0; j < n - i; j++) {
                setCurrentStep('2,3');
                await compare(j, j + 1);
                await sleep(delay);
                if (arr[j] > arr[j + 1]) {
                    swap = true;
                    setCurrentStep('4,5');
                    sound('swap');
                    await swapNumbers(j, j + 1);
                    await sleep(delay);
                }
            }
            let k = n - i;
            bgcolor(`#box${k - 1}`, Colors.white);
            bgcolor(`#box${k}`, Colors.sorted);
            if (!swap) {
                setCurrentStep('6,7');
                for (let j = 0; j < n - i; j++)
                    bgcolor(`#box${j}`, Colors.sorted);
                i = n;
            }
        }
        bgcolor(`#box${0}`, Colors.sorted);
        setCurrentStep('');
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        bubbleSort().catch(() => setCurrentStep(''));
    };

    const handleStop = () => setNumbers([]);

    return (
        <>
            <p>
                <strong>Bubble Sort</strong> is a simple sorting algorithm that
                works by repeatedly swapping adjacent elements if they are in
                the wrong order. This process continues until the list is fully
                sorted. While it’s easy to understand, Bubble Sort is not very
                efficient for large datasets due to its quadratic time
                complexity. It’s often used for educational purposes or as a
                baseline for comparison with other sorting algorithms.
            </p>
            {algorithm}
            <InputNumbers onStart={handleStart} onStop={handleStop} />
            <div className="d-flex py-4" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </>
    );
}
