import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { InputNumbers, Numbox } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { sleep, sound } from '@/common/utils';

var arr, delay = 500;

export default function MergeSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, txy, bgcolor }] = useAnimator();
    const [algorithm] = useAlgorithm(`
    function mergeSort(start, end):
        if start < end:
            mid = length(arr) / 2
            mergeSort(start, mid)
            mergeSort(mid + 1, end)
            merge(start, mid, end)
    `);

    if (!numbers.length) arr = undefined;

    const getMergeIndex = (p, q, mid, end) => {
        if (p <= mid && q <= end) {
            return arr[p] <= arr[q] ? p : q;
        }
        return p <= mid ? p : q;
    };

    const merge = async (start, mid, end, ypos) => {
        let p = start, q = mid + 1;
        let r = start, tmp = [];
        while (r <= end) {
            let s = getMergeIndex(p, q, mid, end);
            tmp.push(arr[s]);
            sound('swap');
            await txy(`#box${s}`, 60 * (r - s), ypos - 60);
            await bgcolor(`#box${s}`, Colors.sorted);
            s === q ? q++ : p++;
            r++;
        }
        tmp.forEach((_, i) => (arr[start + i] = tmp[i]));
        setNumbers(arr.slice());
    };

    const split = (start, end, ypos) => {
        const promises = [];
        for (let i = start; i <= end; i++) {
            promises.push(ty(`#box${i}`, ypos));
        }
        return Promise.all(promises);
    };

    const mergeSort = async (start, end, ypos) => {
        if (start === end) return;
        const mid = Math.floor((start + end) / 2);
        await sleep(delay);
        sound('pop');
        await split(start, mid, ypos);
        await mergeSort(start, mid, ypos + 60);
        await sleep(delay);
        sound('pop');
        await split(mid + 1, end, ypos);
        await mergeSort(mid + 1, end, ypos + 60);
        await sleep(delay);
        await merge(start, mid, end, ypos);
        await sleep(delay);
    };

    useEffect(() => {
        numbers.forEach((_, i) => tx(`#box${i}`, 0, 0));
    }, [numbers]);

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        sleep(delay).then(() =>
            mergeSort(0, arr.length - 1, 60).catch(() => {})
        );
    };

    const handleStop = () => setNumbers([]);

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Merge Sort</strong> is more advanced, divide-and-conquer
                algorithm that recursively splits an unsorted list into smaller
                sublists until each contains a single element. These sublists
                are then merged back together in a sorted manner. With a time
                complexity of O(n log n), Merge Sort is efficient and stable,
                making it suitable for handling large datasets.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {algorithm}
                <Stack spacing={3}>
                    <InputNumbers onStart={handleStart} onStop={handleStop} />
                    <Box className="d-flex mergeSort" pt={4} ref={scope}>
                        {numbers.map((num, i) => (
                            <Numbox key={i} index={i} value={num} />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
