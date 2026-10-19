Nunito is bundled locally so Next.js development and builds do not fetch Google
Fonts or depend on the Google font loader.

`nunito-variable.woff2` contains the complete normal-style variable font, with
weights 200–1000 and all original glyphs. It was converted losslessly from the
[Google Fonts Nunito source](https://github.com/google/fonts/blob/main/ofl/nunito/Nunito%5Bwght%5D.ttf)
to WOFF2 using fontTools 4.60.2 on October 19, 2026. No font tools are required to
install or build this app. The font is distributed under the license in `OFL.txt`.

The app deliberately registers only weights 500, 600, and 700, matching the
previous Google Fonts configuration. Exposing the full variable range makes
regular (400) text lighter than before, because the original setup resolved it
to the available 500 face. All three faces reuse the same WOFF2 asset.
