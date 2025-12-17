import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { InputNumbers, Numbox } from '@/components/common';
import { sound, withBoxId } from '@/common/utils';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import Iterator from '@/common/iterator';

var arr, out, n;
var max, exp, b;
var it, delay = 500;

function RadixSort() {
  const [numbers, setNumbers] = useState([]);
  const [scope, { txy, animate }] = useAnimator();
  const [nextExp, setNextExp] = useState(0);
  const [algorithm] = useAlgorithm(`
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

  async function* radixSort() {
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

  const handleStart = (values) => {
    if (arr) return it.start();
    setNumbers(values);
    sound('pop');
    arr = values.map(withBoxId);
    n = arr.length;
    max = Math.max(...values);
    exp = 1;
    it = Iterator.new(radixSort);
    return it.start();
  };

  const handleStop = () => {
    setNumbers([]);
    setNextExp(0);
    it?.exit();
    arr = undefined;
  };

  useEffect(() => handleStop, []);

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
          </span>
        );
      } else {
        digits.push(<span key={j}>{r}</span>);
      }
      t = Math.floor(t / 10);
      j = j * 10;
    }
    return digits.reverse();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        <strong>Radix Sort</strong> organizes numbers by sorting them digit by
        digit. It starts with the least significant digit (rightmost) and works
        to the most significant digit (leftmost). Numbers are placed into
        buckets based on each digit&apos;s value, then collected back together
        in order. This process is repeated for each digit, leading to arr sorted
        list.
      </Typography>
      <Typography variant="h6" component="h2">
        Things to Observe
      </Typography>
      <Typography component="div" variant="body1" sx={{ '& li': { mb: 1 } }}>
        <ul>
          <li>
            <strong>Digit by Digit:</strong> Notice how the sorting happens in
            passes, one for each digit place (ones, tens, hundreds, etc.),
            starting from the rightmost digit. The currently sorted digit is
            highlighted in pink.
          </li>
          <li>
            <strong>Bucketing:</strong> In each pass, watch how the numbers are
            distributed into {'"buckets"'} (0-9) based on the value of the
            current digit. They are then collected back from the buckets in
            order, preserving the relative order from the previous pass.
          </li>
        </ul>
      </Typography>
      <Box display="flex" gap={3} flexWrap="wrap">
        {algorithm}
        <Stack spacing={2}>
          <InputNumbers
            onStart={handleStart}
            onReset={handleStop}
            onStop={() => it?.stop()}
          />
          <Box className="radixSort" pt={3} ref={scope}>
            <Box display="flex">
              {numbers.map((num, i) => (
                <Numbox
                  key={i}
                  index={i}
                  value={renderDigits(num)}
                  style={{ fontWeight: 'bold' }}
                />
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
                    style={styles.bucket()}
                  />
                ))}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const styles = {
  bucket: () => ({
    fontWeight: 'bold',
    fontSize: '1rem',
    background: 'transparent',
    border: 0,
    borderTop: '1.5px solid grey',
    borderRadius: '8px',
  }),
};

export default RadixSort;
