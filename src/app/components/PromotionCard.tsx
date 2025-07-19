import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type PromotionCardProps = {
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
      stars.push(
        <i key={i} className="fas fa-star text-warning"></i>
      );
    } else if (rating > i - 1) {
      stars.push(
        <i key={i} className="fas fa-star-half-alt text-warning"></i>
      );
    } else {
      stars.push(
        <i key={i} className="far fa-star text-muted"></i>
      );
    }
  }
  return <span>{stars}</span>;
}

export default function PromotionCard({
  image,
  title,
  rating,
  price,
  oldPrice,
  slug,
  imgName,
}: PromotionCardProps) {
  return (
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '25px', overflow: 'hidden' }}>
      <div className="position-relative">
        {/* Badge */}
        <span
          className="badge position-absolute"
          style={{
            top: '12px',
            left: '12px',
            background: '#ff3e8e',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            padding: '3px 12px',
            borderRadius: '12px',
            zIndex: 2,
          }}
        >
          İndirimli
        </span>
        
        <Link href={`/product/${slug}`} className="d-block">
          <div className="card-img-top" style={{ 
            background: '#f3f3f3', 
            borderRadius: '10px', 
            overflow: 'hidden', 
            padding: '10px 12px',
            height: '296px',
            position: 'relative'
          }}>
            <Image
              src={`/images/${imgName}`}
              alt={title}
              fill
              className="object-cover"
              sizes="296px"
              priority={false}
            />
          </div>
        </Link>
        
        <div className="card-body p-3">
          <h5 className="card-title mb-2 fw-bold" style={{ color: '#333', fontSize: '15.4px', fontFamily: 'Spartan, sans-serif' }}>
            {title}
          </h5>
          
          {typeof rating === 'number' && (
            <div className="mb-2">
              <span className="text-muted" style={{ fontSize: '12.6px', color: '#f39c12', fontFamily: 'Lato, sans-serif' }}>
                <StarRating rating={rating} />
                {` ${rating.toFixed(1)}`}
              </span>
            </div>
          )}
          
          <div className="product-price">
            <span className="fw-bold" style={{ 
              fontSize: '16.8px', 
              color: '#ff6a00', 
              fontFamily: 'Lato, sans-serif' 
            }}>
              {price}
            </span>
            {oldPrice && (
              <span className="text-muted ms-2" style={{ 
                fontSize: '12.6px', 
                textDecoration: 'line-through', 
                fontFamily: 'Lato, sans-serif' 
              }}>
                {oldPrice}
              </span>
            )}
          </div>
        </div>
        
        <div className="card-footer bg-transparent border-0 p-3">
          <a
            href={`/product/${slug}`}
            className="btn btn-primary w-100 fw-semibold"
            style={{ 
              background: 'linear-gradient(180deg, #f27a1a 0%, #ff983f 100%)',
              border: 'none',
              fontSize: '1em',
              padding: '10px'
            }}
          >
            <i className="fi-rs-shopping-bag me-2"></i>
            Kapıda Ödemeli Al
          </a>
        </div>
      </div>
    </div>
  );
} 