import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'cod.laravel',
      'localhost',
      '127.0.0.1',
      'main.trendygoods.com.tr',
      'demo.trendygoods.com.tr',
      '10.171.250.230:8000',
      '10.0.19.82',
      'main.vakuumcar.com.tr',
      '192.168.137.1:8000',
      'codpanel.com.tr',
      'trendygoods.com.tr', // Ana domain eklendi
      'api.trendygoods.com.tr', // API domain eklendi
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
