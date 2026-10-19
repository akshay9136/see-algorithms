import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logError } from '@/common/utils';

const MIN_VALUE = -99;
const MAX_VALUE = 999;

const isInteger = (n) =>
  Number.isInteger(n) && n >= MIN_VALUE && n <= MAX_VALUE;

const isRedBlack = ([val, color]) =>
  isInteger(val) && ['R', 'B'].includes(color);

export default function useTreeUrl() {
  const [nodes, setNodes] = useState(null);
  const [ready, setReady] = useState(false);
  const { isReady, query, asPath } = useRouter();

  useEffect(() => {
    if (isReady && !nodes) {
      const { skeleton } = query;
      try {
        if (skeleton) {
          const arr = JSON.parse(atob(skeleton));
          if (!Array.isArray(arr)) return;

          if (asPath.includes('RedBlackTree')) {
            if (arr.every((val) => isRedBlack(val))) setNodes(arr);
          } else {
            const values = arr.map((val) =>
              Array.isArray(val) ? val[0] : val,
            );
            if (values.every(isInteger)) setNodes(values);
          }
        }
        setReady(true);
      } catch {
        logError(null, 'Error parsing tree url');
      }
    }
  }, [isReady, query, asPath, nodes]);

  return [nodes, ready];
}
