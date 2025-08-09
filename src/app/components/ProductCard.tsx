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
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    const isFull = rating >= i;
    const isHalf = !isFull && rating >= i - 0.5;
    const iconClass = isFull ? 'fas fa-star' : isHalf ? 'fas fa-star-half-alt' : 'far fa-star';
    stars.push(<i key={i} className={iconClass} />);
  }
  return <>{stars}</>;
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
          <Link href={productLink} style={{color: '#333', textDecoration: 'none'}}>{title}</Link>
        </h2>
        {typeof rating === 'number' && (
          <div className="product-rating">
            <StarRating rating={rating} />
            <span>{` ${rating.toFixed(1)}`}</span>
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
            <i className="fi-rs-shopping-bag mr-2 me-2"></i>Kapıda Ödemeli Al
          </Link>
        </div>
      </div>
    </div>
  );
}