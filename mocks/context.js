import AppContext, { initialState } from '@/common/context';
import { useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toast from '@/components/toast';

const theme = createTheme();

export default function App({ Component }) {
  const [state, setState] = useState(initialState);

  const setContext = (slice) => {
    setState((prev) => ({ ...prev, ...slice }));
  };

  const contextValue = useMemo(() => ({ ...state, setContext }), [state]);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={contextValue}>
        <Component />
        <Toast />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
