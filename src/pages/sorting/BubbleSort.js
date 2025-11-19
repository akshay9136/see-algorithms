import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/numbers';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import { Iterator } from '@/common/timer';

var arr, it;
var delay = 800;

export default function BubbleSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, bgcolor }] = useAnimator();
    const [algorithm, setCurrentStep] = useAlgorithm(`
for i = 1 to (n - 1):
    swapped = false
    for j = 1 to (n - i):
        if arr[j] < arr[j + 1]:
            swap(j, j + 1)
            swapped = true
    if not swapped: break
`);

    const swapNumbers = async (u, v) => {
        await Promise.all([tx(`#box${u}`, 60), tx(`#box${v}`, -60)]);
        arr.swap(u, v);
        setNumbers(arr.slice());
        await Promise.all([tx(`#box${u}`, 0, 0), tx(`#box${v}`, 0, 0)]);
    };

    const compare = async (u, v) => {
        bgcolor(`#box${u}`, Colors.compare);
        bgcolor(`#box${v}`, Colors.compare);
        if (u > 0) bgcolor(`#box${u - 1}`, Colors.white);
    };

    async function* bubbleSort() {
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            yield delay;
            setCurrentStep('0,1');
            yield delay;
            let swap = false;
            for (let j = 0; j < n - i; j++) {
                setCurrentStep('2,3');
                await compare(j, j + 1);
                yield delay;
                if (arr[j] > arr[j + 1]) {
                    swap = true;
                    setCurrentStep('4,5');
                    sound('swap');
                    await swapNumbers(j, j + 1);
                    yield delay;
                }
            }
            let k = n - i;
            bgcolor(`#box${k - 1}`, Colors.white);
            bgcolor(`#box${k}`, Colors.sorted);
            if (!swap) {
                setCurrentStep('6');
                for (let j = 0; j < n - i; j++) {
                    bgcolor(`#box${j}`, Colors.sorted);
                }
                break;
            }
        }
        bgcolor(`#box${0}`, Colors.sorted);
        setCurrentStep('');
    }

    const handleStart = (values) => {
        if (arr) return it.start();
        setNumbers(values);
        arr = values.slice();
        it = Iterator(bubbleSort);
        it.start();
    };

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        it?.stop();
        arr = undefined;
    };

    useEffect(() => handleStop, []);

    return (
        <Stack spacing={3}>
            <Typography variant="body1">
                <strong>Bubble Sort</strong> is a simple sorting algorithm that
                works by repeatedly swapping adjacent elements if they are in
                the wrong order. This process continues until the list is fully
                sorted. While it’s easy to understand, Bubble Sort is not very
                efficient for large datasets due to its quadratic time
                complexity. It’s often used for educational purposes or as a
                baseline for comparison with other sorting algorithms.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                {algorithm}
                <Stack spacing={3}>
                    <InputNumbers
                        onStart={handleStart}
                        onReset={handleStop}
                        onStop={() => it?.stop()}
                    />
                    <Box display="flex" pt={4} className="sorting" ref={scope}>
                        {numbers.map((num, i) => (
                            <Numbox key={i} index={i} value={num} />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
