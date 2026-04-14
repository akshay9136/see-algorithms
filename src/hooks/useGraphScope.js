import { createScope } from '@/common/graphScope';
import { useEffect, useRef, useState } from 'react';

function useGraphScope() {
  const [scope, setScope] = useState();
  const graphRef = useRef(null);

  useEffect(() => {
    const _scope = createScope(graphRef.current);
    setScope(_scope);
  }, []);

  return [scope, graphRef]
};

export default useGraphScope;
