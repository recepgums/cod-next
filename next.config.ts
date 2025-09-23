import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'codpanel.com.tr', // Laravel API server
      'trendygoods.com.tr', // Ana website
      'localhost',
      '127.0.0.1',
      // Other domains
      'main.vakuumcar.com.tr',
      // Local development IPs
      '10.171.250.230:8000',
      '10.0.19.82',
      '192.168.137.1:8000',
    ],
    // Modern image formatları için optimizasyon
    formats: ['image/avif', 'image/webp'],
    // Placeholder blur için
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Image cache süresi (saniye cinsinden)
    minimumCacheTTL: 60,
  },
  // Performans optimizasyonları
  experimental: {
    // Modern bundling
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Compression
  compress: true,
  // PoweredBy header'ını kaldır
  poweredByHeader: false,
};

export default nextConfig;
