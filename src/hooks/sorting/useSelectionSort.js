import { useState } from 'react';
import { useAlgorithm, useAnimator } from '@/hooks';
import { Box } from '@mui/material';
import { Numbox } from '@/components/common';
import { Colors } from '@/common/constants';
import { sound, withBoxId } from '@/common/utils';

var arr, delay = 500;

export default function useSelectionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [pseudocode, setCurrentStep] = useAlgorithm(`
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
                bgcolor(arr[j - 1].id, Colors.white);
                bgcolor(arr[j].id, Colors.compare);
                yield delay;
                if (arr[j].val < arr[k].val) {
                    setCurrentStep('4');
                    sound('pop');
                    ty(arr[k].id, 0);
                    ty(arr[j].id, -50);
                    k = j;
                    yield delay * 2;
                }
            }
            bgcolor(arr[n - 1].id, Colors.white);
            yield delay;
            if (k > i) {
                setCurrentStep('5');
                await ty(arr[i].id, 50);
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
