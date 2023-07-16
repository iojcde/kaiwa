/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  image:{
    formats: ['image/avif', 'image/webp'],
  }
}

module.exports = nextConfig
