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

    const swapNums = async (u, v) => {
        await Promise.all([tx(arr[u].id, v * 60), tx(arr[v].id, u * 60)]);
        arr.swap(u, v);
    };

    const compare = async (u, v) => {
        bgcolor(arr[u].id, Colors.compare);
        bgcolor(arr[v].id, Colors.compare);
        if (u > 0) bgcolor(arr[u - 1].id, Colors.white);
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
                if (arr[j].val > arr[j + 1].val) {
                    swap = true;
                    setCurrentStep('4,5');
                    sound('swap');
                    await swapNums(j, j + 1);
                    yield delay;
                }
            }
            let k = n - i;
            bgcolor(arr[k - 1].id, Colors.white);
            bgcolor(arr[k].id, Colors.sorted);
            if (!swap) {
                setCurrentStep('6');
                yield delay;
                break;
            }
        }
        arr.forEach((_, i) => {
            bgcolor(`#box${i}`, Colors.sorted);
        });
        setCurrentStep('');
    }

    const handleStart = (values) => {
        if (arr) return it.start();
        setNumbers(values);
        sound('pop');
        arr = values.map(withBoxId);
        it = Iterator(bubbleSort);
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
                <strong>Bubble Sort</strong> is a simple sorting algorithm that
                works by repeatedly swapping adjacent elements if they are in
                the wrong order. This process continues until the list is fully
                sorted. While it’s easy to understand, Bubble Sort is not very
                efficient for large datasets due to its quadratic time
                complexity. It’s often used for educational purposes or as a
                baseline for comparison with other sorting algorithms.
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
                        <strong>Bubbling Up:</strong> In each pass through the
                        list, notice how the largest unsorted element gradually
                        {'"bubbles up"'} to its correct position at the end of
                        the array. This is why the sorted portion of the array
                        grows from right to left.
                    </li>
                    <li>
                        <strong>Early Termination:</strong> This visualization
                        uses an optimized version of Bubble Sort. If a full pass
                        is completed with no swaps, the algorithm knows the list
                        is already sorted and stops early. Try a nearly-sorted
                        list to see this in action!
                    </li>
                </ul>
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
                {algorithm}
                <Stack spacing={3}>
                    <InputNumbers
                        onStart={handleStart}
                        onReset={handleStop}
                        onStop={() => it?.stop()}
                    />
                    <Box className="sorting" pt={4} ref={scope}>
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
