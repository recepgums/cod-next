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
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onError?: (error: any) => void;
}

// Optimized image URL helper
function getOptimizedImageUrl(originalUrl: string): string {
  // Eğer URL zaten proxy üzerinden geliyorsa, olduğu gibi kullan
  if (originalUrl.includes('/api/image-proxy')) {
    return originalUrl;
  }
  
  // Laravel API'dan gelen resimler için proxy kullan
  if (originalUrl.includes(process.env.NEXT_PUBLIC_API_URL || '')) {
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  }
  
  // Diğer durumlar için orijinal URL'i kullan
  return originalUrl;
}

// Base64 blur placeholder
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  priority = false,
  quality = 80,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  onError,
}: OptimizedImageProps) {
  const optimizedSrc = getOptimizedImageUrl(src);

  const handleError = (error: any) => {
    console.error('OptimizedImage load error:', error);
    if (onError) {
      onError(error);
    }
  };

  const imageProps = {
    src: optimizedSrc,
    alt,
    className,
    style,
    priority,
    quality,
    sizes,
    placeholder: 'blur' as const,
    blurDataURL,
    loading: priority ? 'eager' as const : 'lazy' as const,
    onError: handleError,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
      />
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  );
}