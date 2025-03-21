import '@/styles/globals.css';
import '@/styles/app.css';
import { useEffect, useState } from 'react';
import AppContext, { initialState } from '../common/context';
import Layout from '@/components/layout';
import Toast from '@/components/toast';

export default function App({ Component, pageProps }) {
  const [state, setState] = useState(initialState);

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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

Array.prototype.findObj = function (prop, val) {
  return this.find((obj) => obj[prop] === val);
};

Array.prototype.swap = function (u, v) {
  let num = this[u];
  this[u] = this[v];
  this[v] = num;
};
