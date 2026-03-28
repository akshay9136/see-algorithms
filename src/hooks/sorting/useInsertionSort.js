import { useState } from 'react';
import { useAlgorithm, useAnimator } from '@/hooks';
import { Box } from '@mui/material';
import { Numbox } from '@/components/common';
import { Colors } from '@/common/constants';
import { sound, withBoxId } from '@/common/utils';

var arr, delay = 800;

export default function useInsertionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [pseudocode, setCurrentStep] = useAlgorithm(`
for i = 1 to (n - 1):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j = j - 1
    arr[j + 1] = key
`);

    async function* handleSort(values) {
        setNumbers(values);
        sound('pop');
        arr = values.map(withBoxId);
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
            for (; j >= 0 && arr[j].val > temp.val; j--) {
                setCurrentStep('3,4,5');
                sound('swap');
                await tx(arr[j].id, (j + 1) * 60);
                arr[j + 1] = arr[j];
                yield 200;
            }
            sound('swap');
            if (j < i - 1) {
                let k = i - (j + 1);
                await tx(temp.id, (j + 1) * 60, k * 0.2);
                arr[j + 1] = temp;
            }
            setCurrentStep('6');
            await ty(temp.id, 0);
            await bgcolor(temp.id, Colors.sorted);
            yield delay;
        }
        setCurrentStep('');
    }

    const handleStop = () => {
        setNumbers([]);
        setCurrentStep('');
        arr = undefined;
    };

    const animation = (
        <Box
            className="sorting"
            sx={{ minWidth: numbers.length * 60, pt: 8 }}
            ref={scope}
        >
            {numbers.map((num, i) => (
                <Numbox key={i} index={i} value={num} />
            ))}
        </Box>
    );

    return { animation, pseudocode, handleSort, handleStop };
}
