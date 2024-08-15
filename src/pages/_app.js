import '@/styles/globals.css';
import '@/styles/app.css';
import { useEffect, useState } from 'react';
import { Grid, Drawer } from '@mui/material';
import Header from '../components/header/header';
import Sider from '../components/sider/sider';
import Toast from '../components/toast/toast';
import Menu from '../components/menu/menu';
import AppContext, { initialState } from '../common/context';
import DataItems from '../components/data-items/data-items';
import { Algorithms } from '@/common/constants';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const [state, setState] = useState(initialState);
  const [menuVisible, setMenuVisible] = useState(false);
  const { savedData } = state;
  const router = useRouter();
  const algoId = router.pathname.split('/')[2];

  const setContext = (slice) => {
    setState((state) => ({ ...state, ...slice }));
  };

  useEffect(() => {
    let userAuth = localStorage.getItem('userAuth');
    if (userAuth) {
      userAuth = JSON.parse(userAuth);
      setContext({ userAuth });
    }
  }, []);

  return (
    <AppContext.Provider value={{ ...state, setContext }}>
      <Toast />
      <Menu />
      <Header toggleMenu={() => setMenuVisible(!menuVisible)} />
      <Drawer
        anchor="left"
        open={menuVisible}
        onClose={() => setMenuVisible(false)}
        className="drawer"
        PaperProps={{ className: 'paper' }}
        slotProps={{
          backdrop: { className: 'backdrop' },
        }}
      >
        <Sider onClose={() => setMenuVisible(false)} />
      </Drawer>
      <Head>
        <title>{Algorithms[algoId] || 'SEE ALGORITHMS'}</title>
        <meta name="description" content="Visualization of Algorithms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container className="contentRow">
        <Grid item xs={2} className="d-none d-md-block">
          <Sider onClose={() => {}} />
        </Grid>
        <Grid item xs className="container m-0">
          <div className="content">
            <h5 className="mb-3">{Algorithms[algoId]}</h5>
            <Component {...pageProps} />
          </div>
          {savedData.length > 0 && <DataItems />}
        </Grid>
      </Grid>
    </AppContext.Provider>
  );
}
