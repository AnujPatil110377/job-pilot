
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure output directory is properly defined for Netlify
  distDir: '.next',
  output: 'export',
  images: { unoptimized: true },
  // Remove trailing slash configuration as it can cause issues with static exports
  trailingSlash: true,
  // Remove API rewrites as they won't work with static exports
  async rewrites() {
    return [];
  }
};

export default nextConfig;
