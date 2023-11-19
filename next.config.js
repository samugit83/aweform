
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: 'supercar.s3.eu-west-1.amazonaws.com',
        },
      ],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '100mb',
      },
    },
  };
  
  module.exports = nextConfig;