'use client';

import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Base64 blur placeholder for better UX
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  // Generate blur placeholder if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL || defaultBlurDataURL}
      loading={priority ? 'eager' : 'lazy'}
      onError={(e) => {
        // Fallback to placeholder
        const target = e.target as HTMLImageElement;
        target.src = '/images/placeholder.svg';
      }}
    />
  );
}

// Hook for responsive image sizes
export const useResponsiveImageSizes = (breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}) => {
  const { mobile = 100, tablet = 50, desktop = 33 } = breakpoints;
  
  return `(max-width: 768px) ${mobile}vw, (max-width: 1200px) ${tablet}vw, ${desktop}vw`;
};

// Utility for converting images to WebP/AVIF
export const getOptimizedImageUrl = (originalUrl: string, format: 'webp' | 'avif' = 'webp') => {
  // If using Next.js Image component, it handles format conversion automatically
  // This is for manual URL construction if needed
  if (originalUrl.includes('/_next/image')) {
    return originalUrl;
  }
  
  // For external images, you might want to use a service like Cloudinary
  // or implement your own image optimization service
  return originalUrl;
};