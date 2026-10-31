import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

// Check the actual production HTML: unit tests cannot detect a split Emotion
// context introduced by the server bundler.
async function htmlFiles(target) {
  if ((await stat(target)).isFile()) return [target];
  const entries = await readdir(target, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const file = path.join(target, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : file.endsWith('.html') ? [file] : [];
  }));
  return files.flat();
}

const files = await htmlFiles(process.argv[2] || '.next/server/pages');
if (!files.length) throw new Error('No production HTML found to check.');

const failures = [];
let styledPages = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const headEnd = html.indexOf('</head>');
  const styles = [...html.matchAll(/<style\b[^>]*\bdata-emotion="([^"]*)"[^>]*>/g)];
  if (styles.length) styledPages++;
  const keys = new Set(styles.map((style) => style[1].split(' ')[0]));
  if ([...keys].some((key) => key !== 'mui' && key !== 'mui-global')) {
    failures.push(`${file}: unexpected Emotion cache (${[...keys].join(', ')}).`);
  }
  if (styles.some((style) => headEnd < 0 || style.index > headEnd)) {
    failures.push(`${file}: Emotion styles were rendered outside <head>.`);
  }
}

if (!styledPages) throw new Error('No server-rendered Emotion styles found.');
if (failures.length) {
  throw new Error(`SSR styling regression:\n${failures.slice(0, 6).join('\n')}\nKeep MUI and the app on the same Emotion cache.`);
}
console.log(`Verified Emotion cache and style placement in ${styledPages} production pages.`);
