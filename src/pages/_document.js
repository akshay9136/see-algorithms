import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <audio id="swapSound" src="/swap-sound.wav"></audio>
        <audio id="popSound" src="/pop-sound.wav"></audio>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@500&display=swap"
          rel="stylesheet"
        />
        <meta name="google-adsense-account" content="ca-pub-7905328601622622" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
