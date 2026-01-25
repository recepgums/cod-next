import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // remotePatterns kullan (domains deprecated)
    remotePatterns: [
      // Production domains
      { protocol: 'https', hostname: 'codpanel.com.tr' },
      { protocol: 'https', hostname: 'trendygoods.com.tr' },
      { protocol: 'https', hostname: 'main.trendygoods.com.tr' },
      { protocol: 'https', hostname: 'demo.trendygoods.com.tr' },
      { protocol: 'https', hostname: 'api.trendygoods.com.tr' },
      { protocol: 'https', hostname: 'main.vakuumcar.com.tr' },
      // External CDN for review images
      { protocol: 'https', hostname: 'cdn.dsmcdn.com' },
      { protocol: 'https', hostname: '**.dsmcdn.com' },
      // Development domains
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'cod.laravel' },
      { protocol: 'http', hostname: '10.171.250.230' },
      { protocol: 'http', hostname: '10.0.19.82' },
      { protocol: 'http', hostname: '192.168.137.1' },
    ],
    // Modern image formatları için optimizasyon
    formats: ['image/avif', 'image/webp'],
    // Placeholder blur için
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Image cache süresi (saniye cinsinden)
    minimumCacheTTL: 3600, // 1 saat (performans için artırıldı)
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performans optimizasyonları
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Compression
  compress: true,
  // PoweredBy header'ını kaldır
  poweredByHeader: false,
};

export default nextConfig;
