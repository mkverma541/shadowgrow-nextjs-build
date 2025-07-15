/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Only enable essential experimental features
    optimizeCss: process.env.NODE_ENV === 'production',
    // Remove nextScriptWorkers as it can slow down builds
    optimizePackageImports: process.env.NODE_ENV === 'production' ? ['lucide-react'] : [],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_HOSTNAME || 'api.zmtfirmwarefiles.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'demo.shadowgrow.com',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SITE_HOSTNAME || 'zmtfirmwarefiles.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 60 : 0,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: process.env.NODE_ENV === 'production',
  poweredByHeader: false,
  generateEtags: process.env.NODE_ENV === 'production',
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Simplified webpack configuration for faster builds
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer for development
    if (process.env.ANALYZE === 'true') {
      // Use require for Next.js config compatibility
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-report.html',
        })
      );
    }

    // Only apply complex optimizations in production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate large libraries
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 20,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    // Development optimizations for faster builds
    if (dev) {
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
      // Disable some webpack features in development
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }

    return config;
  },
  // SEO & Security Headers Configuration
  headers: async () => {
    // Get API base URL from environment or use default
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005';

    // Determine connect-src based on environment
    const connectSrc = [
      "'self'",
      apiBaseUrl, // Allow the configured API URL
      'https://apis.zmtfirmwarefiles.com', // Production API fallback
      'https://www.google-analytics.com',
      'https://vitals.vercel-insights.com',
      'https://www.clarity.ms',
    ];

    // Add localhost for development
    if (process.env.NODE_ENV === 'development') {
      connectSrc.push('http://localhost:3005', 'http://localhost:3000');
    }

    return [
      {
        source: '/(.*)',
        headers: [
          // SEO Performance Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Security Headers
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Critical: Content Security Policy with dynamic API access
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https:",
              `connect-src ${connectSrc.join(' ')}`,
              "frame-src 'self' https://www.google.com",
            ].join('; '),
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },
  // Build optimizations
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during builds for speed
  },
};

module.exports = nextConfig;
