'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { calculateDiscountPercentage, formatPrice } from '../utils/priceUtils';
import '../product/[slug]/components/RelatedProducts.css';

type ProductCard2Props = {
  image: string;
  title: string;
  rating?: number | null;
  priceCurrent: number;
  priceOriginal: number;
  slug: string;
  productLink: string;
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
  priceCurrent,
  priceOriginal,
  slug,
  productLink,
  variants = []
}: ProductCard2Props) {
  const optimizedImageUrl = getOptimizedImageUrl(image);
  const discountPercentage = calculateDiscountPercentage(priceOriginal, priceCurrent);
  const hasDiscount = priceOriginal > priceCurrent;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('Image failed to load:', {
      src: e.currentTarget.src,
      alt: e.currentTarget.alt,
      productTitle: title
    });
    
    const target = e.target as HTMLImageElement;
    target.src = '/images/placeholder.svg';
  };
  
  return (
    <div className="product-card-2">
      {/* Product Image */}
      <div className="product-card-2-image">
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
      <div className="product-card-2-info">
        

        {/* Product Name */}
        <div className="product-card-2-title">
          <Link href={productLink}>
            {title}
          </Link>
        </div>

        {/* Rating */}
        {typeof rating === 'number' && (
          <div className="product-card-2-rating d-none">
            <span className="stars">
              <StarRating rating={rating} />
            </span>
            <span className="rating-text">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="product-card-2-pricing">
          {hasDiscount && (
            <div className="product-card-2-discount">
              {discountPercentage}
            </div>
          )}
          
          <div className={"product-card-2-price-container " + (hasDiscount ? '' : 'w-100')}>
            {hasDiscount && (
              <div className="product-card-2-old-price">
                {formatPrice(priceOriginal)}
              </div>
            )}
            <div className="product-card-2-current-price">
              {formatPrice(priceCurrent)}
            </div>
          </div>
        </div>

        {/* Variants Info */}
        {/* {variants.length > 0 && (
          <div className="product-card-2-variants">
            {`${variants.filter((v: any) => v.type === 'Beden').length} Beden ${variants.filter((v: any) => v.type === 'Renk').length} Renk`}
          </div>
        )} */}
      </div>
    </div>
  );
}
