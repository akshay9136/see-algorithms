import { createGraphScope } from '@/common/graphScope';
import { useEffect, useRef, useState } from 'react';

export default function useGraphScope() {
  const [scope, setScope] = useState(null);
  const graphRef = useRef(null);

  useEffect(() => {
    setScope(createGraphScope(graphRef.current));
  }, []);

  return [scope, graphRef];
}
