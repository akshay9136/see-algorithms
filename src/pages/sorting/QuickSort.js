import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/common';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { Colors } from '@/common/constants';
import { Iterator } from '@/common/timer';
import { sound, withBoxId } from '@/common/utils';

var arr, it;
var delay = 800;

export default function QuickSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [algorithm] = useAlgorithm(`
function quickSort(start, end):
    if start < end:
        pivot = partition(start, end)
        quickSort(start, pivot - 1)
        quickSort(pivot + 1, end)
`);
    const [partitionAlgo, setCurrentStep] = useAlgorithm(`
function partition(start, end):
    pivot = arr[end]
    i = start, j = end - 1
    while i < j:
        if arr[i] <= pivot:
            i = i + 1
        else if arr[j] > pivot:
            j = j + 1
        else: swap(i, j)
    if arr[i] > pivot: swap(i, end)
`);

    async function* divide(start, end) {
        setCurrentStep('1');
        bgcolor(arr[end].id, Colors.sorted);
        yield delay;
        let i = start, j = end - 1;
        setCurrentStep('2');
        bgcolor(arr[i].id, Colors.compare);
        bgcolor(arr[j].id, Colors.compare);
        yield delay;
        const pivot = arr[end].val;
        while (i < j) {
            setCurrentStep('3');
            yield delay;
            if (arr[i].val <= pivot) {
                i++;
                setCurrentStep('4,5');
                bgcolor(arr[i].id, Colors.compare);
                bgcolor(arr[i - 1].id, Colors.white);
            } else if (arr[j].val > pivot) {
                j--;
                setCurrentStep('6,7');
                bgcolor(arr[j].id, Colors.compare);
                bgcolor(arr[j + 1].id, Colors.white);
            } else {
                setCurrentStep('8');
                await swapNumbers(i, j);
            }
            yield delay;
        }
        if (i < end && arr[i].val > pivot) {
            setCurrentStep('9');
            await swapNumbers(i, end);
            yield delay / 2;
            bgcolor(arr[end].id, Colors.white);
        } else {
            bgcolor(arr[i].id, Colors.sorted);
        }
        setCurrentStep('');
        return i;
    }

    const swapNumbers = async (u, v) => {
        const d = v - u;
        await Promise.all([ty(arr[u].id, 50), ty(arr[v].id, -50)]);
        sound('swap');
        await Promise.all([
            tx(arr[u].id, v * 60, 0.2 * d),
            tx(arr[v].id, u * 60, 0.2 * d),
        ]);
        await Promise.all([ty(arr[u].id, 0), ty(arr[v].id, 0)]);
        arr.swap(u, v);
    };

    async function* quickSort(start, end) {
        yield delay;
        if (start >= end) {
            bgcolor(arr[start].id, Colors.sorted);
            return;
        }
        const pivot = yield* divide(start, end);
        yield* quickSort(start, pivot - 1);
        yield* quickSort(pivot + 1, end);
    }

    const handleStart = (values) => {
        if (arr) return it.start();
        setNumbers(values);
        sound('pop');
        arr = values.map(withBoxId);
        it = Iterator(quickSort, 0, arr.length - 1);
        return it.start();
    };

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        it?.exit();
        arr = undefined;
    };

    useEffect(() => handleStop, []);

    return (
        <Stack spacing={2}>
            <Typography variant="body1">
                <strong>Quick Sort</strong> is the speedster of sorting
                algorithms. It picks a <strong>pivot</strong> element and then
                arranges the rest of the elements into two groups: those less
                than the pivot and those greater. By recursively sorting these
                groups, Quick Sort efficiently sorts even the largest datasets.
                It is perfect blend of strategy and speed, making it one of the
                most popular sorting techniques.
            </Typography>
            <Typography variant="h6" component="h2">
                Things to Observe
            </Typography>
            <Typography
                component="div"
                variant="body1"
                sx={{ '& li': { mb: 1 } }}
            >
                <ul>
                    <li>
                        <strong>Pivot and Partition:</strong> In each step,
                        notice how a {'"pivot"'} element is chosen (in this
                        visualization, it&apos;s the last element of the
                        segment) and the other elements are partitioned into two
                        groups: those smaller and those larger than the pivot.
                    </li>
                    <li>
                        <strong>Divide and Conquer:</strong> Watch how the
                        algorithm recursively breaks the array down into smaller
                        sub-arrays around the pivots, sorting each one
                        independently.
                    </li>
                </ul>
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {partitionAlgo}
                <Stack spacing={3}>
                    {algorithm}
                    <InputNumbers
                        onStart={handleStart}
                        onReset={handleStop}
                        onStop={() => it?.stop()}
                    />
                    <Box className="sorting" pt={8} ref={scope}>
                        {numbers.map((num, i) => (
                            <Numbox
                                key={i}
                                index={i}
                                value={num}
                                animate={{ x: i * 60 }}
                            />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
