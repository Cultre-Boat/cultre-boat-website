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
  },
   experimental: {
    // This is the new configuration setting
    allowedDevOrigins: ["http://192.168.1.5:3000"],
  },
};

export default nextConfig;