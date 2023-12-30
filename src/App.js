import React, { useEffect, useState } from 'react';
import './App.scss';
import { HashRouter } from 'react-router-dom';
import { Grid, Drawer } from '@mui/material';
import Header from './components/header/header';
import Sider from './components/sider/sider';
import Content from './components/content/content';
import Toast, { showToast } from './components/toast/toast';
import Menu from './components/menu/menu';
import Spinner from './components/spinner/spinner';
import DataItems from './components/data-items/data-items';
import { AppContext, initialState } from './common/context';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_ALGORITHMS } from './graphql/queries';
import { categoriesVar, dataArrayVar, userAuthVar } from './common/cache';

function App() {
    const [state, setState] = useState(initialState);
    const [menuVisible, setMenuVisible] = useState(false);
    const dataArray = useReactiveVar(dataArrayVar);

    const { loading } = useQuery(GET_ALGORITHMS, {
        onCompleted(data) {
            const { data: _data, status, message } = data.getAlgorithms;
            if (status) {
                categoriesVar(_data);
            } else {
                showToast({ message, variant: 'error' });
            }
        },
    });

    const setContext = (slice) => {
        setState((state) => ({ ...state, ...slice }));
    };

    useEffect(() => {
        const userAuth = localStorage.getItem('userAuth');
        if (userAuth) {
            userAuthVar(JSON.parse(userAuth));
        }
    }, []);

    return (
        <AppContext.Provider value={{ ...state, setContext }}>
            <Spinner className="App" spinning={loading}>
                <Toast />
                <Menu />
                <Header toggleMenu={() => setMenuVisible(!menuVisible)} />
                <HashRouter>
                    <Drawer
                        anchor="left"
                        open={menuVisible}
                        onClose={() => setMenuVisible(false)}
                        className="drawer"
                        PaperProps={{ className: 'paper' }}
                        slotProps={{
                            backdrop: { className: 'backdrop' } 
                        }}
                    >
                        <Sider onClose={() => setMenuVisible(false)} />
                    </Drawer>
                    <Grid container className="layout">
                        <Grid item xs={2} className="d-none d-md-block">
                            <Sider onClose={() => {}} />
                        </Grid>
                        <Grid item xs className="container">
                            <Content />
                            {dataArray.length > 0 && <DataItems />}
                        </Grid>
                    </Grid>
                </HashRouter>
            </Spinner>
        </AppContext.Provider>
    );
}

export default App;
