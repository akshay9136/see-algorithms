import { createContext } from 'react';

export const initialState = {
    isDirGraph: false,
    playStatus: 0,
    signInOpen: false,
    callbackUrl: '/',
    darkMode: false,
};

const AppContext = createContext({
    ...initialState,
    setContext: () => {},
    toggleDarkMode: () => {},
});

export default AppContext;
