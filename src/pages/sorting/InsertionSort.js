import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/common';
import { sound, withBoxId } from '@/common/utils';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { Colors } from '@/common/constants';

var arr, delay = 800;

export default function InsertionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, txy, bgcolor }] = useAnimator();
    const [algorithm] = useAlgorithm(`
for i = 1 to (n - 1):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j = j - 1
    arr[j + 1] = key
`);

    async function* animate(i = 1, j, temp) {
        yield delay;
        for (; i < arr.length; i++) {
            temp = temp || arr[i];
            yield [arr, i, j, temp];
            sound('pop');
            await ty(temp.id, -50);
            temp.y = -50;
            yield delay;
            j = j ?? i - 1;
            while (j >= 0 && arr[j].val > temp.val) {
                yield [arr, i, j, temp];
                sound('swap');
                await tx(arr[j].id, (j + 1) * 60);
                arr[j].x = (j + 1) * 60;
                arr[j + 1] = arr[j];
                yield 200;
                j--;
            }
            sound('swap');
            if (j < i - 1) {
                yield [arr, i, j, temp];
                const k = i - (j + 1);
                await tx(temp.id, (j + 1) * 60, k * 0.2);
                temp.x = (j + 1) * 60;
                arr[j + 1] = temp;
            }
            yield [arr, i, j];
            await ty(temp.id, 0);
            temp.y = 0;
            bgcolor(temp.id, Colors.sorted);
            yield delay;
            temp = j = undefined;
        }
    }

    async function* handleBack([_arr, i, j, temp]) {
        arr = _arr;
        for (let k = 0; k < arr.length; k++) {
            const { id, x, y } = arr[k];
            bgcolor(id, k <= i ? Colors.sorted : Colors.white);
            txy(id, x, y);
        }
        if (temp) {
            bgcolor(temp.id, Colors.white);
            txy(temp.id, temp.x, temp.y);
        }
        yield* animate(i, j, temp);
    }

    async function* handleStart(values) {
        setNumbers(values);
        sound('pop');
        arr = values.map(withBoxId);
        yield delay;
        bgcolor(arr[0].id, Colors.sorted);
        yield* animate();
    }

    const handleStop = () => {
        setNumbers([]);
        arr = undefined;
    };

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
                        onStepBack={handleBack}
                    />

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
