import { createContext } from 'react';
import { categories } from './cache';

export const initialState = {
    categories,
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
