import { createContext } from 'react';

export const initialState = {
    savedData: [],
    userAuth: null,
    isDirGraph: false,
    playStatus: 0,
    summaryOn: false,
};

const AppContext = createContext({
    ...initialState,
    setContext: () => {},
});

export default AppContext;
