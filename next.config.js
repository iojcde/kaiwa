/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images:{
    formats: ['image/avif', 'image/webp'],remotePatterns:[{
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
  }]

  }
}

module.exports = nextConfig
