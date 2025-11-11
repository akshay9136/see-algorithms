import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { InputNumbers, Numbox } from '@/components/numbers';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import Timer from '@/common/timer';

const sleep = (t) => Timer.sleep(t);

var arr, delay = 500;

export default function MergeSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, txy, bgcolor }] = useAnimator();
    const [algorithm] = useAlgorithm(`
function mergeSort(start, end):
    if start < end:
        mid = (start + end) / 2
        mergeSort(start, mid)
        mergeSort(mid + 1, end)
        merge(start, mid, end)
`);
    const [mergeAlgo] = useAlgorithm(`
function merge(start, mid, end):
    i = start, j = mid + 1
    temp = []
    while i <= mid and j <= end:
        if arr[i] <= arr[j]:
            append arr[i] to temp
            i = i + 1
        else:
            append arr[j] to temp
            j = j + 1
    while i <= mid:
        append arr[i] to temp
        i = i + 1
    while j <= end:
        append arr[j] to temp
        j = j + 1
    for i = start to end:
        arr[i] = temp[i - start]
`);

    const getMergeIndex = (p, q, mid, end) => {
        if (p <= mid && q <= end) {
            return arr[p] <= arr[q] ? p : q;
        }
        return p <= mid ? p : q;
    };

    const merge = async (start, mid, end, ypos) => {
        let p = start, q = mid + 1;
        let r = start, temp = [];
        while (r <= end) {
            let s = getMergeIndex(p, q, mid, end);
            temp.push(arr[s]);
            sound('swap');
            await txy(`#box${s}`, 60 * (r - s), ypos - 60);
            await bgcolor(`#box${s}`, Colors.sorted);
            s === q ? q++ : p++;
            r++;
        }
        for (let i = 0; i < temp.length; i++) {
            arr[start + i] = temp[i]
        }
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
        sleep(delay)
            .then(() => mergeSort(0, arr.length - 1, 60))
            .catch(() => handleStop());
    };

    const handleStop = () => {
        Timer.clear();
        setNumbers([]);
        arr = undefined;
    };

    useEffect(() => handleStop, []);

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
                {mergeAlgo}
                <Stack spacing={3}>
                    {algorithm}
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
