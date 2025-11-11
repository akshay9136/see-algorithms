import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/numbers';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import Timer from '@/common/timer';
import Link from 'next/link';

const sleep = (t) => Timer.sleep(t);

var arr, delay = 500;

export default function SelectionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [algorithm, setCurrentStep] = useAlgorithm(`
for i = 0 to (n - 1):
    min = i
    for j = i + 1 to (n):
        if arr[j] < arr[min]:
            min = j
    if min != i: swap(i, min)
`);

    const sortNumbers = async () => {
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            setCurrentStep('1');
            sound('pop');
            await ty(`#box${i}`, -50);
            await sleep(delay);
            let k = i;
            for (let j = i + 1; j < n; j++) {
                setCurrentStep('2,3');
                bgcolor(`#box${j - 1}`, Colors.white);
                bgcolor(`#box${j}`, Colors.compare);
                await sleep(delay);
                if (arr[j] < arr[k]) {
                    setCurrentStep('4');
                    ty(`#box${k}`, 0);
                    k = j;
                    sound('pop');
                    await ty(`#box${k}`, -50);
                    await sleep(delay);
                }
            }
            bgcolor(`#box${n - 1}`, Colors.white);
            await sleep(delay);
            if (k > i) {
                setCurrentStep('5');
                await ty(`#box${i}`, 50);
                sound('swap');
                await swapNumbers(i, k);
            } else {
                sound('swap');
                await ty(`#box${k}`, 0);
            }
            bgcolor(`#box${i}`, Colors.sorted);
            await sleep(1000);
        }
        setCurrentStep('');
        bgcolor(`#box${n - 1}`, Colors.sorted);
    };

    const swapNumbers = async (i, j) => {
        let k = j - i;
        await Promise.all([
            tx(`#box${i}`, k * 60, 0.2 * k),
            tx(`#box${j}`, -k * 60, 0.2 * k),
        ]);
        await Promise.all([ty(`#box${i}`, 0), ty(`#box${j}`, 0)]);
        arr.swap(i, j);
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${i}`, 0, 0), tx(`#box${j}`, 0, 0)]);
    };

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        sleep(1000).then(() => {
            sortNumbers().catch(handleStop);
        });
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
                <strong>Selection Sort</strong> is like a choosy person picking
                the best apples. It scans the unsorted section, selects the
                smallest item, and places it at the correct position. This
                process repeats until the entire list is sorted. Selection sort
                minimizes the number of swaps needed compared to{' '}
                <Link href="/sorting/BubbleSort">Bubble Sort</Link>, which makes
                it useful when the cost of moving items is high, but finding the
                smallest item is easy.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {algorithm}
                <Stack spacing={3}>
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
