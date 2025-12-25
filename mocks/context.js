import AppContext, { initialState } from '@/common/context';
import Toast from '@/components/toast';
import { useState } from 'react';

export default function App({ Component }) {
  const [state, setState] = useState(initialState);

  const setContext = (slice) => {
    setState((state) => ({ ...state, ...slice }));
  };

  return (
    <AppContext.Provider value={{ ...state, setContext }}>
      <Component />
      <Toast />
    </AppContext.Provider>
  );
}
