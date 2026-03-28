import { useState } from 'react';
import { useAlgorithm, useAnimator } from '@/hooks';
import { Box } from '@mui/material';
import { Numbox } from '@/components/common';
import { Colors } from '@/common/constants';
import { sound, withBoxId } from '@/common/utils';

var arr, delay = 800;

export default function useBubbleSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, bgcolor }] = useAnimator();
    const [pseudocode, setCurrentStep] = useAlgorithm(`
for i = 1 to (n - 1):
    swapped = false
    for j = 1 to (n - i):
        if arr[j] < arr[j - 1]:
            swap(j, j - 1)
            swapped = true
    if not swapped: break
`);

    const compare = async (u, v) => {
        if (u > 0) bgcolor(arr[u - 1].id, Colors.white);
        await Promise.all([
            bgcolor(arr[u].id, Colors.compare),
            bgcolor(arr[v].id, Colors.compare),
        ]);
    };

    const swapNumbers = async (u, v) => {
        await Promise.all([tx(arr[u].id, v * 60), tx(arr[v].id, u * 60)]);
        arr.swap(u, v);
    };

    async function* handleSort(values) {
        setNumbers(values);
        sound('pop');
        arr = values.map(withBoxId);
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            yield delay;
            setCurrentStep('0,1');
            yield delay;
            let swapped = false;
            for (let j = 0; j < n - i; j++) {
                setCurrentStep('2,3');
                await compare(j, j + 1);
                yield delay;
                if (arr[j].val > arr[j + 1].val) {
                    swapped = true;
                    setCurrentStep('4,5');
                    sound('swap');
                    await swapNumbers(j, j + 1);
                    yield delay;
                }
            }
            let k = n - i;
            bgcolor(arr[k - 1].id, Colors.white);
            bgcolor(arr[k].id, Colors.sorted);
            if (!swapped) {
                setCurrentStep('6');
                break;
            }
        }
        arr.forEach((_, i) => {
            bgcolor(`#box${i}`, Colors.sorted);
        });
        yield delay;
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
            sx={{ minWidth: numbers.length * 60, pt: 4 }}
            ref={scope}
        >
            {numbers.map((num, i) => (
                <Numbox key={i} index={i} value={num} />
            ))}
        </Box>
    );

    return { animation, pseudocode, handleSort, handleStop };
}
