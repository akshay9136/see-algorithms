/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bundle the entire styling chain together. Transpiling only Emotion can
  // split MUI's server imports from the app's CacheProvider in Webpack builds.
  // marked is ESM-only and also needs transpilation (see useSummary).
  transpilePackages: [
    'marked',
    '@emotion/react',
    '@emotion/styled',
    '@mui/material',
    '@mui/system',
    '@mui/styled-engine',
    '@mui/private-theming',
    '@mui/utils',
  ],

  async headers() {
    return [
      {
        source: '/sorting/embed/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
      {
        source: '/graph/embed/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
      {
        source: '/data-structures/embed/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/graph/dfs-vs-bfs',
        destination: '/graph/bfs-vs-dfs',
        permanent: true, // 308 Permanent Redirect
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/sorting', destination: '/' },
      { source: '/graph', destination: '/' },
      { source: '/data-structures', destination: '/' },
      { source: '/advanced-trees', destination: '/' },
      { source: '/other', destination: '/' },
    ];
  },
};

export default nextConfig;
