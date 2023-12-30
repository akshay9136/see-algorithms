import { createContext } from 'react';

export const initialState = {
    isDirGraph: false,
    playStatus: 0,
};

export const AppContext = createContext({
    ...initialState,
    setContext: () => {},
});
