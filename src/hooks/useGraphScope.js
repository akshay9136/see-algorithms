import { createGraphScope } from '@/common/graphScope';
import { useEffect, useRef, useState } from 'react';

function useGraphScope() {
  const [scope, setScope] = useState(null);
  const graphRef = useRef(null);

  useEffect(() => {
    const _scope = createGraphScope(graphRef.current);
    setScope(_scope);
  }, []);

  return [scope, graphRef]
};

export default useGraphScope;
