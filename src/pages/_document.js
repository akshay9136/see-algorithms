import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '@/utils/client-cache';

export default function Document({ emotionStyleTags }) {
  const themeInitScript = `
    (function() {
      try {
        var saved = localStorage.getItem('darkMode');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = saved !== null ? saved === 'true' : prefersDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } catch (e) {}
    })();
  `;

  return (
    <Html lang="en">
      <Head>
        <meta name="emotion-insertion-point" content="" />
        {emotionStyleTags}
        <link rel="icon" href="/favicon.png" />
        <audio id="swapSound" src="/swap-sound.wav"></audio>
        <audio id="popSound" src="/pop-sound.wav"></audio>
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  // A fresh cache per render prevents styles from leaking between requests.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => function EmotionApp(props) {
        return <App {...props} emotionCache={cache} />;
      },
    });

  const initialProps = await NextDocument.getInitialProps(ctx);
  const chunks = extractCriticalToChunks(initialProps.html);

  return {
    ...initialProps,
    emotionStyleTags: chunks.styles.map((style) => (
      <style
        key={style.key}
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    )),
  };
};
