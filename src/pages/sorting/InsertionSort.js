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

export default function InsertionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [algorithm, setCurrentStep] = useAlgorithm(`
for i = 1 to (n - 1):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j = j - 1
    arr[j + 1] = key
`);

    const sortNumbers = async () => {
        await sleep(delay);
        bgcolor(`#box${0}`, Colors.sorted);
        for (let i = 1; i < arr.length; i++) {
            await sleep(delay);
            setCurrentStep('1,2');
            sound('pop');
            await ty(`#box${i}`, -50);
            setCurrentStep('3');
            await sleep(delay);

            let num = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > num) {
                arr[j + 1] = arr[j];
                setCurrentStep('3,4,5');
                sound('swap');
                await tx(`#box${j}`, 60);
                j--;
            }
            sound('swap');
            if (j < i - 1) {
                arr[j + 1] = num;
                let k = i - (j + 1);
                await tx(`#box${i}`, -k * 60, k * 0.2);
            }
            setCurrentStep('6');
            await ty(`#box${i}`, 0);
            await bgcolor(`#box${i}`, Colors.sorted);
            setNumbers(arr.slice());
        }
        setCurrentStep('');
    };

    useEffect(() => {
        numbers.forEach((_, i) => tx(`#box${i}`, 0, 0));
    }, [numbers]);

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        sortNumbers().catch(handleStop);
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
                Ever organized a hand of playing cards? Then you already know{' '}
                <strong>Insertion Sort</strong>! This algorithm takes each
                element from the unsorted part and slides it into its correct
                position in the sorted part. It is like placing a new card in
                the right spot of a sorted hand, making it intuitive and
                efficient for small dataset, especially for partially sorted
                lists.
            </Typography>
            <Box display="flex" gap={3} flexWrap="wrap">
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
