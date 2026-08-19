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
import SignInDialog from '@/components/sign-in-dialog';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import Head from 'next/head';
import { Nunito } from 'next/font/google';
import { useRouter } from 'next/router';
import { SITE_URL } from '@/utils/constants';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

const theme = createTheme({
  typography: { fontFamily: nunito.style.fontFamily },
});

const isProd = process.env.NODE_ENV === 'production';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const { pathname, asPath } = router;
  const cleanPath = asPath.split('?')[0].split('#')[0];
  const canonicalUrl = SITE_URL + (cleanPath === '/' ? '' : cleanPath);
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
          button_text: button.textContent.trim(),
          button_name: button.title,
        });
      }
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'See Algorithms',
        description: 'Interactive Algorithm Visualizations for Data Structures, Graph Algorithms, and Sorting.',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'See Algorithms',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: ['https://github.com/akshay9136/see-algorithms'],
      },
    ],
  };

  return (
    <SessionProvider session={session}>
      <Head>
        <style>{`body{ font-family: ${nunito.style.fontFamily}; }`}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <DefaultSeo
        {...defaultSeoConfig}
        canonical={canonicalUrl}
        openGraph={{
          ...defaultSeoConfig.openGraph,
          url: canonicalUrl,
        }}
      />
      <Analytics />
      {isProd && <GoogleAnalytics gaId="G-CG2WRZ9YET" />}
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
          <SignInDialog />
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
