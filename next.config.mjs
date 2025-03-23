
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure output directory is properly defined for Netlify
  distDir: '.next',
  // Define asset prefix if needed for CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  // Add trailing slash to URLs
  trailingSlash: true,
  // API rewrite configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  }
};

export default nextConfig;
