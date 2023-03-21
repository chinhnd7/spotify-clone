/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['platform-lookaside.fbsbx.com', 'mosaic.scdn.co', 'i.scdn.co']
  },
}

module.exports = nextConfig

