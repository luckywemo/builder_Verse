/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@coinbase/onchainkit'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig; 