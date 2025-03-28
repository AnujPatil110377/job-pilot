
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  distDir: '.next',
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
