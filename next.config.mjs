/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESM-only dependency; Next/Jest must transpile it (see useSummary → marked)
  transpilePackages: ['marked'],
};

export default nextConfig;
