/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: false,
        has: [
          {
            type: 'header',
            key: 'user-agent',
            value: '.*',
          },
        ],
        missing: [
          {
            type: 'cookie',
            key: 'fromLanding',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
