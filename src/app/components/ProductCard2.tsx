'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProductCard2Props = {
  image: string;
  title: string;
  rating?: number | null;
  price: string;
  oldPrice?: string | null;
  slug: string;
  productLink: string;
  discount?: string | null;
  variants?: any[];
};

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Full star
      stars.push(
        <svg key={i} className="text-warning" style={{width: '16px', height: '16px'}} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      );
    } else if (rating > i - 1) {
      // Half star
      stars.push(
        <svg key={i} className="text-warning" style={{width: '16px', height: '16px'}} viewBox="0 0 20 20"><defs><linearGradient id={`half${i}`}><stop offset="50%" stopColor="#f39c12"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path fill={`url(#half${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg key={i} className="text-muted" style={{width: '16px', height: '16px'}} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      );
    }
  }
  return <span>{stars}</span>;
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

export default function ProductCard2({
  image,
  title,
  rating,
  price,
  oldPrice,
  slug,
  productLink,
  discount,
  variants = []
}: ProductCard2Props) {
  const optimizedImageUrl = getOptimizedImageUrl(image);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Daha temiz error logging - sadece gerekli bilgileri göster
    console.warn('Image failed to load:', {
      src: e.currentTarget.src,
      alt: e.currentTarget.alt,
      productTitle: title
    });
    
    // Fallback image göster
    const target = e.target as HTMLImageElement;
    target.src = '/images/placeholder.svg';
  };
  
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
    >
      {/* Product Image */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
        <Link href={productLink}>
          <Image
            src={optimizedImageUrl}
            alt={title}
            fill
            style={{
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={handleImageError}
          />
        </Link>
      </div>

      {/* Product Info */}
      <div style={{ padding: '15px' }}>
        {/* Product Name */}
        <div style={{
          fontSize: '14px',
          color: '#000',
          marginBottom: '8px',
          lineHeight: '1.3',
          height: '36px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          <Link href={productLink} style={{ color: 'inherit', textDecoration: 'none' }}>
            {title}
          </Link>
        </div>

        {/* Rating */}
        {typeof rating === 'number' && (
          <div style={{ marginBottom: '8px' }}>
            <span style={{fontSize: '12px', color: '#f39c12'}}>
              <StarRating rating={rating} />
              {` ${rating.toFixed(1)}`}
            </span>
          </div>
        )}

        {/* Pricing */}
        <div style={{ marginBottom: '8px' }}>
          {discount && (
            <div style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '4px',
              display: 'inline-block',
              marginBottom: '4px'
            }}>
              {discount}
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {oldPrice && (
              <div style={{
                textDecoration: 'line-through',
                color: '#999',
                fontSize: '12px'
              }}>
                {oldPrice}
              </div>
            )}
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000'
            }}>
              {price}
            </div>
          </div>
        </div>

        {/* Variants Info */}
        {variants.length > 0 && (
          <div style={{
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
          }}>
            {`${variants.filter((v: any) => v.type === 'Beden').length} Beden ${variants.filter((v: any) => v.type === 'Renk').length} Renk`}
          </div>
        )}
      </div>
    </div>
  );
}
