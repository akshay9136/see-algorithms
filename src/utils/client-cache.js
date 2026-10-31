import createCache from '@emotion/cache';

export default function createEmotionCache() {
  const insertionPoint =
    typeof document !== 'undefined'
      ? document.querySelector('meta[name="emotion-insertion-point"]')
      : undefined;

  // Keep MUI styles ahead of our CSS overrides before and after hydration.
  return createCache({ key: 'mui', insertionPoint, prepend: true });
}
