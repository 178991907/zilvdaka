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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'pic1.imgdb.cn',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  // START: ADDED TO FIX CROSS-ORIGIN WARNING
  // This allows the Next.js development server to accept requests from the
  // Firebase Studio preview environment.
  experimental: {
    allowedDevOrigins: [
      'https://*.cluster-bqwaigqtxbeautecnatk4o6ynk.cloudworkstations.dev',
    ],
  },
  // END: ADDED TO FIX CROSS-ORIGIN WARNING
};

export default nextConfig;
