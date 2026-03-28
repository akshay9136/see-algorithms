import { useState } from 'react';
import { useAlgorithm, useAnimator } from '@/hooks';
import { Box } from '@mui/material';
import { Numbox } from '@/components/common';
import { Colors } from '@/common/constants';
import { sound, withBoxId } from '@/common/utils';

var arr, delay = 500;

export default function useMergeSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { ty, txy, bgcolor }] = useAnimator();
    const [pseudocode] = useAlgorithm(`
function mergeSort(start, end):
    if start < end:
        mid = (start + end) / 2
        mergeSort(start, mid)
        mergeSort(mid + 1, end)
        merge(start, mid, end)
`);

    const getIndex = (p, q, mid, end) => {
        if (p <= mid && q <= end) {
            return arr[p].val <= arr[q].val ? p : q;
        }
        return p <= mid ? p : q;
    };

    async function* merge(start, mid, end, ypos) {
        let p = start, q = mid + 1;
        let r = start, temp = [];
        while (r <= end) {
            const s = getIndex(p, q, mid, end);
            temp.push(arr[s]);
            sound('swap');
            await txy(arr[s].id, 60 * r, ypos - 60);
            await bgcolor(arr[s].id, Colors.sorted);
            yield 100;
            s === q ? q++ : p++;
            r++;
        }
        temp.forEach((_, i) => {
            arr[start + i] = temp[i];
        });
    }

    const split = (start, end, ypos) => {
        const promises = [];
        for (let i = start; i <= end; i++) {
            promises.push(ty(`#box${i}`, ypos));
        }
        sound('pop');
        return Promise.all(promises);
    };

    async function* mergeSort(start, end, ypos) {
        if (start === end) return;
        if (ypos === 60) yield delay;
        yield delay;
        const mid = Math.floor((start + end) / 2);
        await split(start, mid, ypos);
        yield* mergeSort(start, mid, ypos + 60);
        yield delay;
        await split(mid + 1, end, ypos);
        yield* mergeSort(mid + 1, end, ypos + 60);
        yield delay;
        yield* merge(start, mid, end, ypos);
    }

    async function* handleSort(values) {
        setNumbers(values);
        arr = values.map(withBoxId);
        yield* mergeSort(0, arr.length - 1, 60);
    }

    const handleStop = () => {
        setNumbers([]);
        arr = undefined;
    };

    const animation = (
        <Box
            className="mergeSort"
            sx={{ minWidth: numbers.length * 60, pt: 3 }}
            ref={scope}
        >
            {numbers.map((num, i) => (
                <Numbox key={i} index={i} value={num} />
            ))}
        </Box>
    );

    return { animation, pseudocode, handleSort, handleStop };
}
