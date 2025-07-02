import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1751259039005.cluster-c23mj7ubf5fxwq6nrbev4ugaxa.cloudworkstations.dev',
      'https://www.assetwise.live',
      'https://assetwise.live',
    ],
  },
};

export default nextConfig;
