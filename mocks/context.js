import AppContext, { initialState } from '@/common/context';
import Toast from '@/components/toast';
import { useMemo, useState } from 'react';

export default function App({ Component }) {
  const [state, setState] = useState(initialState);

  const setContext = (slice) => {
    setState((prev) => ({ ...prev, ...slice }));
  };

  const contextValue = useMemo(() => ({ ...state, setContext }), [state]);

  return (
    <AppContext.Provider value={contextValue}>
      <Component />
      <Toast />
    </AppContext.Provider>
  );
}
