import React, { useState } from 'react';
import useAnimator from '../../hooks/useAnimator';
import { Numbox, SortNumbers } from '../../components/numbers';
import { Colors } from '../../common/constants';
import { wait } from '../../common/utils';

var arr, delay = 500;

export default function MergeSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { bgcolor, tx, ty, txy }] = useAnimator();
    if (!numbers.length) arr = undefined;

    const getMergeIndex = (p, q, mid, end) => {
        if (p <= mid && q <= end) {
            return arr[p] <= arr[q] ? p : q;
        }
        return p <= mid ? p : q;
    };

    const merge = async (start, mid, end) => {
        arr.forEach((_, i) => {
            if (i >= start && i <= end) {
                bgcolor(`#box${i}`, Colors.compare);
            } else if (i < start) {
                bgcolor(`#box${i}`, Colors.white);
            }
        });
        await wait(1000);
        let p = start, q = mid + 1;
        let r = start, tmp = [];
        while (r <= end) {
            let s = getMergeIndex(p, q, mid, end);
            tmp.push(arr[s]);
            await txy(`#box${s}`, 60 * (r - s), 60);
            await bgcolor(`#box${s}`, Colors.sorted);
            s === q ? q++ : p++;
            r++;
        }
        const _tmp = tmp.map((_, i) => {
            arr[start + i] = tmp[i];
            return tx(`#box${start + i}`, 0, 0);
        });
        await Promise.all(_tmp);
        setNumbers(arr.slice());
        await wait(delay);
        for (let i = 0; i < tmp.length; i++) {
            await ty(`#box${start + i}`, 0);
        }
    };

    const mergeSort = async (start, end) => {
        if (start === end) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
        await wait(delay);
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        setTimeout(mergeSort, 1000, 0, arr.length - 1);
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
