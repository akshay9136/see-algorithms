
import React, { useEffect, useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import { Numbox, SortNumbers } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { bgcolor, try_, wait } from '@/common/utils';

var arr, delay = 800;

export default function InsertionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty }] = useAnimator();

    if (!numbers.length) arr = undefined;

    const pickNumber = async (i) => {
        bgcolor(`#box${i}`, Colors.compare);
        await wait(delay);
        await ty(`#box${i}`, -50, 0.5);
        await wait(delay);
    };

    const sortNumbers = try_(async () => {
        bgcolor(`#box${0}`, Colors.sorted);
        await wait(delay);
        for (let i = 1; i < arr.length; i++) {
            await pickNumber(i);
            let num = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > num) {
                arr[j + 1] = arr[j];
                await tx(`#box${j}`, 60, 0.5);
                j--;
            }
            if (j < i - 1) {
                arr[j + 1] = num;
                let k = i - (j + 1);
                await tx(`#box${i}`, -k * 60, k * 0.2);
            }
            await ty(`#box${i}`, 0, 0.5);
            bgcolor(`#box${i}`, Colors.sorted);
            setNumbers(arr.slice());
            await wait(delay);
        }
    });

    useEffect(() => {
        numbers.forEach((_, i) => tx(`#box${i}`, 0, 0));
    }, [numbers]);

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
