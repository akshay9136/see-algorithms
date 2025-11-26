import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/common';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { Colors } from '@/common/constants';
import { Iterator } from '@/common/timer';
import { sound, withBoxId } from '@/common/utils';

var arr, it;
var delay = 500;

export default function MergeSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { ty, txy, bgcolor }] = useAnimator();
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
            return arr[p].val <= arr[q].val ? p : q;
        }
        return p <= mid ? p : q;
    };

    async function* merge(start, mid, end, ypos) {
        let p = start, q = mid + 1;
        let r = start, temp = [];
        while (r <= end) {
            let s = getMergeIndex(p, q, mid, end);
            temp.push(arr[s]);
            sound('swap');
            await txy(arr[s].id, 60 * r, ypos - 60);
            await bgcolor(arr[s].id, Colors.sorted);
            yield 100;
            s === q ? q++ : p++;
            r++;
        }
        for (let i = 0; i < temp.length; i++) {
            arr[start + i] = temp[i];
        }
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

    const handleStart = (values) => {
        if (arr) return it.start();
        setNumbers(values);
        arr = values.map(withBoxId);
        it = Iterator(mergeSort, 0, arr.length - 1, 60);
        return it.start();
    };

    const handleStop = () => {
        setNumbers([]);
        it?.exit();
        arr = undefined;
    };

    useEffect(() => handleStop, []);

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Merge Sort</strong> is more advanced, divide-and-conquer
                algorithm that recursively splits an unsorted list into smaller
                sublists until each contains a single element. These sublists
                are then merged back together in a sorted manner. With a time
                complexity of O(n log n), Merge Sort is efficient and stable,
                making it suitable for handling large datasets.
            </Typography>
            <Typography variant="h6" component="h2">
                Things to Observe
            </Typography>
            <Typography
                component="div"
                variant="body1"
                sx={{ '& li': { mb: 1 }, mt: 1 }}
            >
                <ul>
                    <li>
                        <strong>Divide Recursively:</strong> Watch how the
                        algorithm first breaks the array down recursively into
                        single-element sub-arrays. The visualization shows this
                        by moving the elements downwards.
                    </li>
                    <li>
                        <strong>Conquer (Merge):</strong> Observe how these
                        sub-arrays are then merged back together in sorted
                        order. This merging step is where the core sorting logic
                        happens, comparing elements from the sub-arrays and
                        placing them into a temporary array before updating the
                        main one.
                    </li>
                </ul>
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                {mergeAlgo}
                <Stack spacing={3}>
                    {algorithm}
                    <InputNumbers
                        onStart={handleStart}
                        onReset={handleStop}
                        onStop={() => it?.stop()}
                    />
                    <Box className="mergeSort" pt={4} ref={scope}>
                        {numbers.map((num, i) => (
                            <Numbox key={i} index={i} value={num} />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
