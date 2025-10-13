import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/gh/Avinesh-2001/CB@main/**',
      },
    ],
    // Optimize images for mobile devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable image optimization for better mobile performance
    unoptimized: false,
  },
  // Explicitly set the project root directory to prevent workspace detection issues
  outputFileTracingRoot: resolve(__dirname),
  // Disable output file tracing for dev to prevent lockfile scanning issues
  outputFileTracing: false,
  // Enable compression for better performance
  compress: true,
  // Optimize bundle for mobile
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['pixi.js', 'gsap'],
  },
};

export default nextConfig;