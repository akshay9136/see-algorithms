import { useState } from 'react';
import { useAlgorithm, useAnimator } from '@/hooks';
import { Box } from '@mui/material';
import { Numbox } from '@/components/common';
import { Colors } from '@/common/constants';
import { sound, withBoxId } from '@/common/utils';

var arr, delay = 800;

export default function useQuickSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [pseudocode, setCurrentStep] = useAlgorithm(`
function partition(start, end):
    pivot = arr[end]
    i = start, j = end - 1
    while i < j:
        if arr[i] <= pivot:
            i = i + 1
        else if arr[j] > pivot:
            j = j - 1
        else: swap(i, j)
    if arr[i] > pivot: swap(i, end)
`);

    async function* divide(start, end) {
        setCurrentStep('1');
        bgcolor(arr[end].id, Colors.sorted);
        yield delay;
        let i = start, j = end - 1;
        setCurrentStep('2');
        bgcolor(arr[i].id, Colors.compare);
        bgcolor(arr[j].id, Colors.compare);
        yield delay;
        const pivot = arr[end].val;
        while (i < j) {
            setCurrentStep('3');
            yield delay;
            if (arr[i].val <= pivot) {
                bgcolor(arr[i++].id, Colors.white);
                bgcolor(arr[i].id, Colors.compare);
                setCurrentStep('4,5');
            } else if (arr[j].val > pivot) {
                bgcolor(arr[j--].id, Colors.white);
                bgcolor(arr[j].id, Colors.compare);
                setCurrentStep('6,7');
            } else {
                setCurrentStep('8');
                await swapNumbers(i, j);
            }
            yield delay;
        }
        if (i < end && arr[i].val > pivot) {
            setCurrentStep('9');
            await swapNumbers(i, end);
            yield delay / 2;
            bgcolor(arr[end].id, Colors.white);
        } else {
            bgcolor(arr[i].id, Colors.sorted);
        }
        setCurrentStep('');
        return i;
    }

    const swapNumbers = async (u, v) => {
        const d = v - u;
        await Promise.all([ty(arr[u].id, 50), ty(arr[v].id, -50)]);
        sound('swap');
        await Promise.all([
            tx(arr[u].id, v * 60, 0.2 * d),
            tx(arr[v].id, u * 60, 0.2 * d),
        ]);
        await Promise.all([ty(arr[u].id, 0), ty(arr[v].id, 0)]);
        arr.swap(u, v);
    };

    async function* quickSort(start, end) {
        yield delay;
        if (start >= end) {
            bgcolor(arr[start].id, Colors.sorted);
            return;
        }
        const pivot = yield* divide(start, end);
        yield* quickSort(start, pivot - 1);
        yield* quickSort(pivot + 1, end);
    }

    async function* handleSort(values) {
        setNumbers(values);
        sound('pop');
        arr = values.map(withBoxId);
        yield* quickSort(0, arr.length - 1);
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
