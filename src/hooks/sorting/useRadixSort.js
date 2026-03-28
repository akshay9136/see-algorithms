import { useState } from 'react';
import { useAlgorithm, useAnimator } from '@/hooks';
import { Numbox } from '@/components/common';
import { Box } from '@mui/material';
import { sound, withBoxId } from '@/common/utils';

var arr, out, n;
var max, exp, b;

var delay = 500;

export default function useRadixSort() {
  const [numbers, setNumbers] = useState([]);
  const [scope, { txy, animate }] = useAnimator();
  const [nextExp, setNextExp] = useState(0);
  const [pseudocode] = useAlgorithm(`
max = largest(arr)
exp = 1
while (max / exp) > 0:
    buckets[0..9] = empty stacks
    for i = 0 to (n - 1):
        d = (arr[i] / exp) % 10
        push arr[i] to buckets[d]
    k = n - 1
    for j = 9 to 0:
        b = buckets[j]
        while b is not empty:
            arr[k] = b.pop()
            k = k - 1
    exp = exp * 10
`);

  async function enqueue(i) {
    const j = Math.floor(arr[i].val / exp) % 10;
    b[j].push(i);
    animate(arr[i].id, { height: 30 });
    const dy = b[j].length * 36;
    sound('swap');
    await txy(arr[i].id, j * 60, 240 - dy);
  }

  async function* dequeue(j) {
    while (b[j].length) {
      const i = b[j].pop();
      out.push(arr[i]);
      const k = n - out.length;
      animate(arr[i].id, { height: 40 });
      sound('swap');
      await txy(arr[i].id, k * 60, 0);
      yield delay;
    }
  }

  async function* handleSort(_values) {
    const values = _values.map((v) => Math.abs(v));
    setNumbers(values);
    sound('pop');
    arr = values.map(withBoxId);
    n = arr.length;
    max = Math.max(...values);
    exp = 1;
    yield 1000;
    while (Math.floor(max / exp) > 0) {
      setNextExp(exp);
      b = [[], [], [], [], [], [], [], [], [], []];
      yield 1000;
      for (let i = 0; i < n; i++) {
        await enqueue(i);
        yield delay;
      }
      yield delay;
      out = [];
      for (let j = 9; j >= 0; j--) {
        yield* dequeue(j);
      }
      exp *= 10;
      arr = out.reverse();
      setNextExp(0);
      yield delay;
    }
  }

  const handleStop = () => {
    setNumbers([]);
    setNextExp(0);
    arr = undefined;
  };

  const renderDigits = (num) => {
    let digits = [];
    let t = num;
    let j = 1;
    while (t !== 0) {
      let r = t % 10;
      if (j === nextExp) {
        digits.push(
          <span key={j} style={{ color: '#e91e63' }}>
            {r}
          </span>,
        );
      } else {
        digits.push(<span key={j}>{r}</span>);
      }
      t = Math.floor(t / 10);
      j = j * 10;
    }
    return digits.reverse();
  };

  const animation = (
    <Box
      className="radixSort"
      sx={{ minWidth: numbers.length * 60, pt: 3 }}
      ref={scope}
    >
      <Box display="flex">
        {numbers.map((num, i) => (
          <Numbox key={i} index={i} value={renderDigits(num)} />
        ))}
      </Box>
      <Box display="flex">
        {numbers.length > 0 &&
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Numbox
              key={i}
              index={numbers.length + i}
              value={i}
              animate={{ x: i * 60, y: 240 }}
              style={{
                fontWeight: 'bold',
                background: 'transparent',
                color: '#606060',
                border: 0,
              }}
            />
          ))}
      </Box>
    </Box>
  );

  return { animation, pseudocode, handleSort, handleStop };
}
