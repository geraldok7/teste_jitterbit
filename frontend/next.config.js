/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/order/:path*',
        destination: `${process.env.API_URL || 'http://localhost:3001'}/order/:path*`
      },
      {
        source: '/health',
        destination: `${process.env.API_URL || 'http://localhost:3001'}/health`
      }
    ]
  }
}

module.exports = nextConfig
