import { createContext } from 'react';

export const initialState = {
    isDirGraph: false,
    playStatus: 0,
    signInOpen: false,
    callbackUrl: '/',
};

const AppContext = createContext({
    ...initialState,
    setContext: () => {},
});

export default AppContext;
