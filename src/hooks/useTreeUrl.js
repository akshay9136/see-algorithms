import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logError } from '@/common/utils';

export default function useTreeUrl() {
  const [nodes, setNodes] = useState(null);
  const [ready, setReady] = useState(false);
  const { isReady, query } = useRouter();

  useEffect(() => {
    if (isReady && !nodes) {
      const { skeleton } = query;
      try {
        if (skeleton) {
          const arr = JSON.parse(atob(skeleton));
          setNodes(arr);
        }
        setReady(true);
      } catch {
        logError('Error parsing nodes');
      }
    }
  }, [isReady, query, nodes]);

  return [nodes, ready];
}
