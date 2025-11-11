import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/numbers';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import Timer from '@/common/timer';

const sleep = (t) => Timer.sleep(t);

var arr, delay = 800;

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

    if (!numbers.length) arr = [];

    const swapNums = async (a, b) => {
        const d = b - a;
        await Promise.all([ty(`#box${a}`, 50), ty(`#box${b}`, -50)]);
        sound('swap');
        await Promise.all([
            tx(`#box${a}`, d * 60, 0.2 * d),
            tx(`#box${b}`, -d * 60, 0.2 * d),
        ]);
        await Promise.all([ty(`#box${a}`, 0), ty(`#box${b}`, 0)]);
        arr.swap(a, b);
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${a}`, 0, 0), tx(`#box${b}`, 0, 0)]);
    };

    const divide = async (start, end) => {
        setCurrentStep('1');
        bgcolor(`#box${end}`, Colors.sorted);
        await sleep(delay);
        let i = start,
            j = end - 1;
        setCurrentStep('2');
        bgcolor(`#box${i}`, Colors.compare);
        bgcolor(`#box${j}`, Colors.compare);
        await sleep(delay);
        while (i < j) {
            setCurrentStep('3');
            await sleep(delay);
            if (arr[i] <= arr[end]) {
                i++;
                setCurrentStep('4,5');
                bgcolor(`#box${i - 1}`, Colors.white);
                bgcolor(`#box${i}`, Colors.compare);
            } else if (arr[j] > arr[end]) {
                j--;
                setCurrentStep('6,7');
                bgcolor(`#box${j + 1}`, Colors.white);
                bgcolor(`#box${j}`, Colors.compare);
            } else {
                setCurrentStep('8');
                await swapNums(i, j);
            }
            await sleep(delay);
        }
        setCurrentStep('');
        if (i < end && arr[i] > arr[end]) {
            bgcolor(`#box${i}`, Colors.sorted);
            await sleep(delay);
            setCurrentStep('9');
            await swapNums(i, end);
            await sleep(delay / 2);
            bgcolor(`#box${end}`, Colors.white);
        } else {
            bgcolor(`#box${i}`, Colors.white);
            i = end;
        }
        return i;
    };

    const quickSort = async (start, end) => {
        if (start >= end) {
            bgcolor(`#box${start}`, Colors.sorted);
            return;
        }
        const pivot = await divide(start, end);
        await sleep(delay);
        await quickSort(start, pivot - 1);
        await sleep(delay);
        await quickSort(pivot + 1, end);
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        sleep(delay)
            .then(() => quickSort(0, arr.length - 1))
            .catch(() => handleStop());
    };

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        Timer.clear();
        arr = undefined;
    };

    useEffect(() => handleStop, []);

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Quick Sort</strong> is the speedster of sorting
                algorithms. It picks a <strong>pivot</strong> element and then
                arranges the rest of the elements into two groups: those less
                than the pivot and those greater. By recursively sorting these
                groups, Quick Sort efficiently sorts even the largest datasets.
                It is perfect blend of strategy and speed, making it one of the
                most popular sorting techniques.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
              {partitionAlgo}
              <Stack spacing={3}>
                {algorithm}
                <InputNumbers onStart={handleStart} onStop={handleStop} />
                <Box className="sorting d-flex" pt={8} ref={scope}>
                    {numbers.map((num, i) => (
                        <Numbox key={i} index={i} value={num} />
                    ))}
                </Box>
              </Stack>
            </Box>
        </Stack>
    );
}
