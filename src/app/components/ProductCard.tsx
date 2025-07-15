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
    <Link href={`/product/${slug}`} className="block">
      <article className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full border border-gray-100 w-[320px] mx-auto hover:shadow-lg transition">
        <div className="w-full h-48 relative">
          <Image
            src={`/images/${imgName}`}
            alt={title}
            fill
            className="object-cover object-center"
            sizes="320px"
            priority={false}
          />
        </div>
        <div className="flex-1 flex flex-col p-4">
          <h2 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2">{title}</h2>
          {typeof rating === 'number' && (
            <div className="flex items-center mb-2">
              <StarRating rating={rating} />
              <span className="ml-2 font-medium text-sm text-gray-800">{rating.toFixed(1)}</span>
            </div>
          )}
          <div className="mb-2">
            <span className="text-xl font-bold text-pink-600 mr-2">{price}</span>
            {oldPrice && (
              <span className="text-base text-gray-400 line-through">{oldPrice}</span>
            )}
          </div>
          <span className="mt-auto w-full py-2 rounded-md text-white font-semibold text-base flex items-center justify-center bg-gradient-to-r from-orange-400 to-pink-500 hover:from-pink-500 hover:to-orange-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75h19.5M6.75 6.75V5.25A2.25 2.25 0 019 3h6a2.25 2.25 0 012.25 2.25v1.5m-10.5 0h10.5m-10.5 0v10.5A2.25 2.25 0 009 19.5h6a2.25 2.25 0 002.25-2.25V6.75" />
            </svg>
            Kapıda Ödemeli Al
          </span>
        </div>
      </article>
    </Link>
  );
} 