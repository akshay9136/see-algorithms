import '@/styles/globals.css';
import '@/styles/app.css';
import { useEffect, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultSeoConfig } from '../components/algorithm-seo/config';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import AppContext, { initialState } from '../common/context';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '@/components/layout';
import Toast from '@/components/toast';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useRouter } from 'next/router';
import Script from 'next/script';

const isProd = process.env.NODE_ENV === 'production';

const theme = createTheme({
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [state, setState] = useState(initialState);
  const { pathname } = useRouter();
  const hasContent = pathname !== '/404';

  const setContext = (slice) => {
    setState((prev) => ({ ...prev, ...slice }));
  };

  const contextValue = useMemo(() => ({ ...state, setContext }), [state]);

  useEffect(() => {
    const handleClick = (event) => {
      const button = event.target.closest('button');

      if (button && window.gtag) {
        window.gtag('event', 'button_clicked', {
          text: button.textContent.trim(),
          title: button.title,
          page: pathname,
        });
      }
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  return (
    <SessionProvider session={session}>
      <DefaultSeo {...defaultSeoConfig} />
      <GoogleAnalytics gaId="G-CG2WRZ9YET" />
      <Analytics />
      {isProd && hasContent && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7905328601622622"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContext.Provider value={contextValue}>
          {Component.noLayout ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
          <Toast />
        </AppContext.Provider>
      </ThemeProvider>
    </SessionProvider>
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
