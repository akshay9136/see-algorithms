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
    ];
  },
};

export default nextConfig;
