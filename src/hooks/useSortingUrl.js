import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logError } from '@/common/utils';

const MIN_COUNT = 5;
const MAX_COUNT = 12;
const MIN_VALUE = -99;
const MAX_VALUE = 999;

const isInteger = (n) =>
  Number.isInteger(n) && n >= MIN_VALUE && n <= MAX_VALUE;

export default function useSortingUrl() {
  const [numbers, setNumbers] = useState(null);
  const [ready, setReady] = useState(false);
  const { isReady, query } = useRouter();

  useEffect(() => {
    if (isReady && !numbers) {
      const { skeleton } = query;
      try {
        if (skeleton) {
          const arr = JSON.parse(atob(skeleton));
          if (
            Array.isArray(arr) &&
            arr.length >= MIN_COUNT &&
            arr.length <= MAX_COUNT &&
            arr.every(isInteger)
          ) {
            setNumbers(arr);
          }
        }
        setReady(true);
      } catch {
        logError(null, 'Error parsing sorting url');
        setReady(true);
      }
    }
  }, [isReady, query, numbers]);

  return [numbers, ready];
}
