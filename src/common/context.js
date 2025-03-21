import { createContext } from 'react';

export const initialState = {
    savedData: [],
    userAuth: null,
    isDirGraph: false,
    playStatus: 0,
};

const AppContext = createContext({
    ...initialState,
    setContext: () => {},
});

export default AppContext;
