import '@/styles/globals.css';
import '@/styles/app.css';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DefaultSeo } from 'next-seo';
import { defaultSeoConfig } from '../components/algorithm-seo/config';
import CookieConsent from '../components/cookie-consent';
import AppContext, { initialState } from '../common/context';
import Layout from '@/components/layout';
import Toast from '@/components/toast';
import Script from 'next/script';

const theme = createTheme({
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },
});

const noContentPages = ['PageNotFound'];

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
    <>
      {!noContentPages.includes(Component.name) && (
        <>
          <DefaultSeo {...defaultSeoConfig} />
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7905328601622622"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </>
      )}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContext.Provider value={{ ...state, setContext }}>
          <Toast />
          {/* <CookieConsent /> */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppContext.Provider>
      </ThemeProvider>
    </>
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
