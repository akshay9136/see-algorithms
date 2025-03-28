import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <audio id="swapSound" src="/swap-sound.wav"></audio>
        <audio id="popSound" src="/pop-sound.wav"></audio>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
