import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/common';
import { sound, withBoxId } from '@/common/utils';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { Colors } from '@/common/constants';
import Link from 'next/link';

var arr, delay = 500;

export default function SelectionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [algorithm, setCurrentStep] = useAlgorithm(`
for i = 0 to (n - 1):
    min = i
    for j = i + 1 to (n - 1):
        if arr[j] < arr[min]:
            min = j
    if min != i: swap(i, min)
`);

    async function* handleSort(values) {
        setNumbers(values);
        arr = values.map(withBoxId);
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            yield 1000;
            setCurrentStep('1');
            sound('pop');
            await ty(arr[i].id, -50);
            yield delay;
            let k = i;
            for (let j = i + 1; j < n; j++) {
                setCurrentStep('2,3');
                bgcolor(arr[j].id, Colors.compare);
                bgcolor(arr[j - 1].id, Colors.white);
                yield delay;
                if (arr[j].val < arr[k].val) {
                    setCurrentStep('4');
                    ty(arr[k].id, 0);
                    k = j;
                    sound('pop');
                    await ty(arr[k].id, -50);
                    yield delay;
                }
            }
            bgcolor(arr[n - 1].id, Colors.white);
            yield delay;
            if (k > i) {
                setCurrentStep('5');
                await ty(arr[i].id, 50);
                yield 0;
                sound('swap');
                await swapMin(i, k);
            } else {
                sound('swap');
                await ty(arr[k].id, 0);
            }
            bgcolor(arr[i].id, Colors.sorted);
            yield delay;
            setCurrentStep('');
        }
        yield delay;
        bgcolor(arr[n - 1].id, Colors.sorted);
    }

    const swapMin = async (u, v) => {
        const d = v - u;
        await Promise.all([
            tx(arr[u].id, v * 60, 0.2 * d),
            tx(arr[v].id, u * 60, 0.2 * d),
        ]);
        await Promise.all([ty(arr[u].id, 0), ty(arr[v].id, 0)]);
        arr.swap(u, v);
    };

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        arr = undefined;
    };

    return (
        <Stack spacing={2}>
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
                        <strong>Finding the Minimum:</strong> In each pass,
                        watch how the algorithm scans the entire unsorted
                        portion of the array to find the single smallest
                        element.
                    </li>
                    <li>
                        <strong>One Swap Per Pass:</strong> Notice that there is
                        only one swap at the very end of each pass. This is a
                        key difference from Bubble Sort and is the reason why
                        Selection Sort is preferred when write operations are
                        expensive.
                    </li>
                </ul>
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap" alignItems="start">
                {algorithm}
                <Stack spacing={3}>
                    <InputNumbers onStart={handleSort} onReset={handleStop} />

                    <Box className="sorting" pt={8} ref={scope}>
                        {numbers.map((num, i) => (
                            <Numbox key={i} index={i} value={num} />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
