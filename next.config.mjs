/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/graph/PrimsMST',
        destination: '/graph/Prims',
        permanent: true,
      },
      {
        source: '/graph/KruskalsMST',
        destination: '/graph/Kruskals',
        permanent: true,
      },
      {
        source: '/graph/Dijkstra',
        destination: '/graph/Dijkstras',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
