import React, { useEffect, useState } from 'react';
import { sound } from '@/common/utils';
import Numbers from '@/components/numbers/input-numbers';
import Timer from '@/common/timer';
import useAnimator from '@/hooks/useAnimator';
import { Numbox } from '@/components/numbers';

const sleep = (t) => Timer.sleep(t);

var a, n;
var max, exp;
var out, b;
var delay = 500;

function RadixSort() {
  const [numbers, setNumbers] = useState([]);
  const [scope, { txy, tx, bgcolor, animate }] = useAnimator();
  const [nextExp, setNextExp] = useState(0);

  const enqueue = async (i) => {
    bgcolor(`#box${i}`, '#ffea00');
    await sleep(delay);
    sound('swap');
    let j = Math.floor(a[i] / exp) % 10;
    b[j].push(i);
    animate(`#box${i}`, { height: 30 });
    let dy = b[j].length * 36;
    await txy(`#box${i}`, j * 60, 240 - dy);
    await sleep(delay);
  };

  const radixSort = async () => {
    await sleep(delay * 2);
    b = [];
    for (let j = 0; j < 10; j++) b[j] = [];
    for (let i = 0; i < n; i++) {
      await enqueue(i);
    }
    await sleep(delay);
    out = [];
    for (let j = 9; j >= 0; j--) {
      await dequeue(j);
    }
    a = out.reverse();
    setNumbers(a.slice());
    setNextExp(0);
    for (let i = 0; i < n; i++) {
      bgcolor(`#box${i}`, '#fff');
    }
    for (let i = 0; i < n; i++) {
      tx(`#box${i}`, i * 60, 0);
    }
    exp *= 10;
    if (Math.floor(max / exp) > 0) {
      await sleep(delay * 2);
      setNextExp(exp);
      await radixSort();
    }
  };

  const dequeue = async (j) => {
    while (b[j].length) {
      let i = b[j].pop();
      out.push(a[i]);
      sound('swap');
      let k = n - out.length;
      animate(`#box${i}`, { height: 40 });
      await txy(`#box${i}`, k * 60, 0);
      await sleep(delay);
    }
  };

  const start = async (values) => {
    setNumbers(values);
    a = values.slice();
    n = a.length;
    max = a[0];
    for (let i = 1; i < n; i++) {
      if (a[i] > max) max = a[i];
    }
    exp = 1;
    await sleep(delay * 2);
    setNextExp(1);
    radixSort().catch(() => {});
  };

  const stop = () => {
    setNumbers([]);
    setNextExp(0);
    Timer.clear();
  };

  useEffect(() => () => stop(), []);

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
    <>
      <p>
        <strong>Radix Sort</strong> organizes numbers by sorting them digit by
        digit. It starts with the least significant digit (rightmost) and works
        to the most significant digit (leftmost). Numbers are placed into
        buckets based on each digit&apos;s value, then collected back together
        in order. This process is repeated for each digit, leading to a sorted
        list.
      </p>
      <Numbers onStart={start} onStop={stop} />

      <div className="radixSort" ref={scope}>
        <div className="d-flex">
          {numbers.map((num, i) => (
            <Numbox
              key={i}
              index={i}
              value={renderDigits(num)}
              animate={{ x: i * 60 }}
              style={styles.numbox()}
            />
          ))}
        </div>
        <div className="d-flex">
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
        </div>
      </div>
    </>
  );
}

const styles = {
  numbox: () => ({
    position: 'absolute',
    fontWeight: 600,
  }),

  bucket: () => ({
    position: 'absolute',
    fontWeight: 600,
    fontSize: '1rem',
    background: 'transparent',
    border: 0,
    borderTop: '2px solid grey',
    borderRadius: '8px',
  }),
};

export default RadixSort;
