import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/common';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { sound } from '@/common/utils';
import { Colors } from '@/common/constants';
import { Iterator } from '@/common/timer';

var arr, it;
var delay = 800;

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

    async function* insertionSort() {
        yield delay;
        bgcolor(arr[0].id, Colors.sorted);
        yield delay;
        for (let i = 1; i < arr.length; i++) {
            setCurrentStep('1,2');
            let temp = arr[i];
            sound('pop');
            await ty(temp.id, -50);
            setCurrentStep('3');
            yield delay;
            let j = i - 1;
            while (j >= 0 && arr[j].val > temp.val) {
                setCurrentStep('3,4,5');
                sound('swap');
                await tx(arr[j].id, (j + 1) * 60);
                arr[j + 1] = arr[j];
                yield 0;
                j--;
            }
            sound('swap');
            if (j < i - 1) {
                let k = i - (j + 1);
                await tx(temp.id, (j + 1) * 60, k * 0.2);
                arr[j + 1] = temp;
                yield 0;
            }
            setCurrentStep('6');
            await ty(temp.id, 0);
            await bgcolor(temp.id, Colors.sorted);
            yield delay;
        }
        setCurrentStep('');
    }

    const handleStart = (values) => {
        if (arr) return it.start();
        setNumbers(values);
        sound('pop');
        arr = values.map((val, i) => ({ val, id: `#box${i}` }));
        it = Iterator(insertionSort);
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
                Ever organized a hand of playing cards? Then you already know{' '}
                <strong>Insertion Sort</strong>! This algorithm takes each
                element from the unsorted part and slides it into its correct
                position in the sorted part. It is like placing a new card in
                the right spot of a sorted hand, making it intuitive and
                efficient for small dataset, especially for partially sorted
                lists.
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
                        <strong>Inserting into Place:</strong> Watch how each
                        element is picked from the unsorted part and slides into
                        its correct position in the sorted part on the left,
                        just like organizing a hand of playing cards.
                    </li>
                    <li>
                        <strong>Adaptive Performance:</strong> Try visualizing a
                        nearly sorted list. You&apos;ll notice Insertion Sort
                        runs much faster because it only has to shift a few
                        elements for each insertion. This makes it very
                        efficient for lists that are already mostly sorted.
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
                    <Box className="sorting d-flex" pt={8} ref={scope}>
                        {numbers.map((num, i) => (
                            <Numbox
                                key={i}
                                index={i}
                                value={num}
                                animate={{ x: i * 60 }}
                                style={{ position: 'absolute' }}
                            />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
