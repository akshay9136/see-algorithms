/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESM-only dependency; Next/Jest must transpile it (see useSummary → marked)
  transpilePackages: ['marked'],

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
};

export default nextConfig;
