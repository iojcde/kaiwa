/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    enableUndici: true,
    serverActions:true

  }
}

module.exports = nextConfig
