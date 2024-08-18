import '@/styles/globals.css';
import '@/styles/app.css';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';
import Header from '../components/header/header';
import Sider from '../components/sider/sider';
import Toast from '../components/toast/toast';
import Menu from '../components/menu/menu';
import AppContext, { initialState } from '../common/context';
import DataItems from '../components/data-items/data-items';
import { Algorithms } from '@/common/constants';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

export default function App({ Component, pageProps }) {
  const [state, setState] = useState(initialState);
  const [menuVisible, setMenuVisible] = useState(false);
  const { theory, savedData } = state;
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
      <NextSeo
        title={`SEE ALGORITHMS - ${Algorithms[algoId] || 'Visualization of Algorithms'}`}
        description="Learn basic algorithms by visualzing them through interactive animations."
      />
      <div className="d-flex contentRow">
        <div className="d-none d-md-block" style={{ width: '20%', maxWidth: 300 }}>
          <Sider onClose={() => {}} />
        </div>
        <div className="content m-0">
          <div style={{ padding: '1rem 1.5rem' }}>
            <h5 className="mb-3">{Algorithms[algoId]}</h5>
            <Component {...pageProps} />
          </div>
          {savedData.length > 0 && <DataItems />}
        </div>
      </div>
    </AppContext.Provider>
  );
}

Array.prototype.swap = function (u, v) {
  let num = this[u];
  this[u] = this[v];
  this[v] = num;
}
