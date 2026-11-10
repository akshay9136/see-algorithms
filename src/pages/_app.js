import '@/styles/globals.css';
import '@/styles/app.css';
import '@/styles/animation.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/next';
import { CacheProvider } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import CssBaseline from '@mui/material/CssBaseline';
import AppContext, { initialState } from '../common/context';
import GoogleAnalytics from '@/components/analytics';
import CookieConsent from '@/components/cookie-consent';
import Layout from '@/components/layout';
import Toast from '@/components/toast';
import dynamic from 'next/dynamic';
import localFont from 'next/font/local';
import createEmotionCache from '@/utils/client-cache';
import { defaultSeoConfig } from '@/components/algorithm-seo/config';
import { PERSON_SCHEMA, SITE_URL } from '@/utils/constants';
import Head from 'next/head';
import Script from 'next/script';

const clientCache = createEmotionCache();
const siteHostname = new URL(SITE_URL).hostname;
const subscribeToHostname = () => () => {}; // The hostname never changes within a page.

const SignInDialog = dynamic(() => import('@/components/sign-in-dialog'), {
  ssr: false,
});

const nunito = localFont({
  src: [
    { path: '../fonts/nunito-variable.woff2', weight: '500' },
    { path: '../fonts/nunito-variable.woff2', weight: '600' },
    { path: '../fonts/nunito-variable.woff2', weight: '700' },
  ],
  style: 'normal',
  display: 'swap',
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  emotionCache = clientCache,
}) {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const { pathname, asPath } = router;
  const cleanPath = asPath.split('?')[0].split('#')[0];
  const canonicalUrl = SITE_URL + (cleanPath === '/' ? '' : cleanPath);

  const onPublicHost = useSyncExternalStore(
    subscribeToHostname,
    () => window.location.hostname === siteHostname,
    () => false,
  );

  const setContext = (slice) => {
    setState((prev) => ({ ...prev, ...slice }));
  };

  const [darkMode, toggleDarkMode] = useDarkMode();

  const context = useMemo(
    () => ({ ...state, darkMode, toggleDarkMode, setContext }),
    [state, darkMode, toggleDarkMode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, xxl: 1920 },
        },
        palette: { mode: darkMode ? 'dark' : 'light' },
        typography: { fontFamily: nunito.style.fontFamily },
      }),
    [darkMode],
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'See Algorithms',
        description:
          'Interactive Algorithm Visualizations for Data Structures, Graph Algorithms, and Sorting.',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'See Algorithms',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        foundingDate: '2024',
        description:
          'See Algorithms provides interactive, step-by-step visualizations for sorting, graph, and data structure algorithms to help students and educators learn computer science concepts.',
        email: 'hello@see-algorithms.com',
        sameAs: ['https://github.com/akshay9136/see-algorithms'],
        founder: { '@id': `${SITE_URL}/#person-akshay` },
      },
      PERSON_SCHEMA,
    ],
  };

  const isEmbed = pathname.includes('/embed/');
  const loadAdScript = pathname !== '/404' && !isEmbed && onPublicHost;
  const { openGraph } = defaultSeoConfig;

  return (
    <CacheProvider value={emotionCache}>
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
          openGraph={{ ...openGraph, url: canonicalUrl }}
        />
        {loadAdScript && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7905328601622622"
            crossOrigin="anonymous"
            strategy="lazyOnload"
            onReady={() => setContext({ adsReady: true })}
          />
        )}
        <Analytics />
        <GoogleAnalytics />
        {!isEmbed && <CookieConsent />}

        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContext.Provider value={context}>
            {Component.noLayout ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
            <Toast />
            {state.signInOpen && <SignInDialog />}
          </AppContext.Provider>
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
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
