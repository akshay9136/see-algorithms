import '@/styles/globals.css';
import '@/styles/app.css';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';
import Header from '../components/header/header';
import Sider from '../components/sider/sider';
import Toast from '../components/toast/toast';
import AppContext, { initialState } from '../common/context';
import DataItems from '../components/data-items/data-items';
import { Algorithms } from '@/common/constants';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { metaDescription } from '@/common/cache';

export default function App({ Component, pageProps }) {
  const [state, setState] = useState(initialState);
  const { savedData } = state;
  const [menuVisible, setMenuVisible] = useState(false);
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

  useEffect(() => {
    setMenuVisible(false);
  }, [router.pathname]);

  return (
    <AppContext.Provider value={{ ...state, setContext }}>
      <Toast />
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
        <Sider selected={algoId} />
      </Drawer>
      <NextSeo
        title={`${Algorithms[algoId] || 'SEE ALGORITHMS'} | Visualization of Algorithms`}
        description={
          metaDescription[algoId] ||
            'Learn basic algorithms by visualzing them through interactive animations.'
        }
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              Algorithms[algoId],
              'algorithms',
              'interactive animations',
              'learning',
              'visualization',
              'sorting',
              'searching',
              'data structures',
              'computer science',
              'programming',
            ].join(),
          },
        ]}
      />
      <div className="d-flex contentRow">
        <div
          className="d-none d-md-block"
          style={{ width: 'max-content', minWidth: 240 }}
        >
          <Sider selected={algoId} />
        </div>
        <div className="content m-0">
          <div style={{ padding: '1rem 1.5rem' }}>
            {algoId && <h5 className="my-3">{Algorithms[algoId]}</h5>}
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
};
