import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  image: string;
  title: string;
  rating?: number | null;
  price: string;
  oldPrice?: string | null;
  slug: string;
  imgName: string;
};

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Full star
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      );
    } else if (rating > i - 1) {
      // Half star
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 inline" viewBox="0 0 20 20"><defs><linearGradient id={`half${i}`}><stop offset="50%" stopColor="#facc15"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path fill={`url(#half${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg key={i} className="w-4 h-4 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
      );
    }
  }
  return <span>{stars}</span>;
}

export default function ProductCard({
  image,
  title,
  rating,
  price,
  oldPrice,
  slug,
  imgName,
}: ProductCardProps) {
  return (
   
      <div className="rounded-[10px] shadow-sm mb-3 bg-white overflow-hidden w-[320px] mx-auto border border-gray-200">
         <Link href={`/product/${slug}`} className="block">
        <div className="w-[320px] h-[200px] relative" style={{ background: '#f3f3f3', borderRadius: '10px', overflow: 'hidden' }}>
          <Image
            src={`/images/${imgName}`}
            alt={title}
            fill
            className="object-cover"
            sizes="320px"
            priority={false}
          />
        </div>
        </Link>
        <div className="px-[20px] pb-[15px] pt-2">
          <h2 className="mb-2 font-bold" style={{ color: '#333' }}>
            <span style={{ fontFamily: 'Spartan, sans-serif', fontSize: '15.4px' }}>{title}</span>
          </h2>
          {typeof rating === 'number' && (
            <div>
              <span className="text-[12.6px]" style={{ color: '#f39c12', fontFamily: 'Lato, sans-serif' }}>
                {/* Inline SVG stars */}
                {Array.from({ length: 5 }).map((_, i) => {
                  if (rating >= i + 1) {
                    // Full star
                    return (
                      <svg key={i} className="w-4 h-4 inline text-[#f39c12]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    );
                  } else if (rating > i) {
                    // Half star
                    return (
                      <svg key={i} className="w-4 h-4 inline text-[#f39c12]" viewBox="0 0 20 20"><defs><linearGradient id={`half${i}`}><stop offset="50%" stopColor="#f39c12"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path fill={`url(#half${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    );
                  } else {
                    // Empty star
                    return (
                      <svg key={i} className="w-4 h-4 inline text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    );
                  }
                })}
                {` ${rating.toFixed(1)}`}
              </span>
            </div>
          )}
          <div className="product-price mt-1">
            <span className="text-[16.8px] font-bold" style={{ color: '#ff6a00', fontFamily: 'Lato, sans-serif' }}>{price}</span>
            {oldPrice && (
              <span className="old-price ml-2 text-[12.6px]" style={{ color: '#aaa', textDecoration: 'line-through', fontFamily: 'Lato, sans-serif' }}>{oldPrice}</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <a
            href={`/product/${slug}`}
            className="btn w-full btn-sm add-to-cart font-semibold text-[1em] border-0 py-[10px] rounded-b-[10px] flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, #FF6A00 0%, #EE0979 100%)' }}
          >
            <i className="fi-rs-shopping-bag mr-2" />Kapıda Ödemeli Al
          </a>
        </div>
      </div>
  );
}