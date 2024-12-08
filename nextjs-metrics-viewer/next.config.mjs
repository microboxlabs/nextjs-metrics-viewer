/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["geoip-lite"], // Add other external packages used in your API routes
  },
};

export default nextConfig;
