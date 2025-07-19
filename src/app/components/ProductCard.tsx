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
  productLink: string;
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

export default function ProductCard({
  image,
  title,
  rating,
  price,
  oldPrice,
  slug,
  productLink,
}: ProductCardProps) {
  return (
    <div className="product-cart-wrap mb-3 shadow-sm" style={{borderRadius: '10px'}}>
      <div className="product-img-action-wrap" style={{padding: 0}}>
        <div className="product-img product-img-zoom" style={{borderRadius: '10px 10px 0 0', overflow: 'hidden'}}>
          <Link href={productLink}>
            <Image
              src={image}
              alt={title}
              width={320}
              height={200}
              className="lozad default-img w-100"
              style={{height: '200px', objectFit: 'cover'}}
              priority={false}
            />
          </Link>
        </div>
      </div>
      <div className="product-content-wrap pt-2 px-3">
        <h2 className="mb-2" style={{fontSize: '1.1em', fontWeight: 'bold'}}>
          <Link href={productLink} style={{color: '#333'}}>{title}</Link>
        </h2>
        {typeof rating === 'number' && (
          <div>
            <span>
              <span style={{fontSize: '0.9em', color: '#f39c12'}}>
                <StarRating rating={rating} />
                {` ${rating.toFixed(1)}`}
              </span>
            </span>
          </div>
        )}
        <div className="product-price mt-1">
          <span style={{fontSize: '1.2em', color: '#ff6a00'}}>{price} TL</span>
          {oldPrice && (
            <span className="old-price" style={{fontSize: '0.9em', color: '#aaa', textDecoration: 'line-through'}}>{oldPrice} TL</span>
          )}
        </div>
      </div>
      <div className="row mx-auto">
        <div className="col-12 px-0">
          <Link 
            href={`/product/${slug}`} 
            className="btn w-100 btn-sm add-to-cart" 
            style={{
              background: 'linear-gradient(90deg, #FF6A00 0%, #EE0979 100%)', 
              fontWeight: 600, 
              fontSize: '1em', 
              border: 0, 
              padding: '10px',
              color: 'white',
              borderRadius: '0 0 10px 10px'
            }}
            data-product-name={title}
            data-product-price={price}
          >
            <i className="fi-rs-shopping-bag me-2"></i>Kapıda Ödemeli Al
          </Link>
        </div>
      </div>
    </div>
  );
}