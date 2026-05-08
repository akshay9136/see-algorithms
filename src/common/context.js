import { createContext } from 'react';

export const initialState = {
    isDirGraph: false,
    playStatus: 0,
};

const AppContext = createContext({
    ...initialState,
    setContext: () => {},
});

export default AppContext;
