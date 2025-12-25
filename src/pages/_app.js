import '@/styles/globals.css';
import '@/styles/app.css';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultSeoConfig } from '../components/algorithm-seo/config';
import { DefaultSeo } from 'next-seo';
import AppContext, { initialState } from '../common/context';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '@/components/layout';
import Toast from '@/components/toast';
import { Analytics } from '@vercel/analytics/next';
import { useRouter } from 'next/router';
import Script from 'next/script';

const isProd = process.env.NODE_ENV === 'production';

const theme = createTheme({
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },
});

export default function App({ Component, pageProps }) {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const hasContent = router.pathname !== '/404';

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
    const handleClick = (event) => {
      const button = event.target.closest('button');
      if (button) {
        const buttonInfo = {
          text: button.textContent.trim(),
          title: button.title,
          page: router.pathname,
        };

        fetch('/api/log-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Button clicked',
            data: buttonInfo,
          }),
        });
      }
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [router.pathname]);

  return (
    <>
      <Analytics />
      {isProd && hasContent && (
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toast />
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
