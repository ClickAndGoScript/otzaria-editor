/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/forum/:path*',
        destination: 'http://72.62.95.11:4567/:path*',
      },
      {
        source: '/forum',
        destination: 'http://72.62.95.11:4567/',
      },
    ]
  },
}

export default nextConfig
