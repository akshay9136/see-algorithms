import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
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
