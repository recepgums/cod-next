'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RelatedProduct {
  id: number;
  slug: string;
  name: string;
  template: string;
  productImg: string;
  images: Array<{
    thumbnail: string;
    medium: string;
    large: string;
    mobile: string;
    original: string;
  }>;
  productLink: string;
  rating: number;
  reviewCount: number;
  priceCurrent: number;
  priceOriginal: number;
  discount: string | null;
  sold: number;
  features: string[];
  quantityOptions: Array<{
    title: string;
    quantity: number;
    price: number;
    discount: number;
  }>;
  variants: any[];
  content: string | null;
  pixel_id: string | null;
  merchant_id: number;
  is_whatsapp_homepage: boolean | null;
  merchant_phone: string;
  cargo_price: number | null;
  upsell_product: any | null;
  upsell_discount: number | null;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [itemsPerView, setItemsPerView] = useState(2);
  const [slidesPerGroup, setSlidesPerGroup] = useState(2);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(2); // Mobile: 2 items
        setSlidesPerGroup(2); // Mobile: 2 slide at a time
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 items
        setSlidesPerGroup(2); // Tablet: 2 slide at a time
      } else {
        setItemsPerView(4); // Desktop: 4 items
        setSlidesPerGroup(2); // Desktop: 2 slide at a time
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <div className="related-products-section" style={{ 
      marginTop: '40px',
      maxWidth: '600px',
      margin: '40px auto 0'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#000',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Benzer Ürünler
      </h3>

      <div style={{ position: 'relative' }}>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={15}
          slidesPerView={itemsPerView}
          slidesPerGroup={slidesPerGroup}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 2,
              spaceBetween: 15,
            },
          }}
          style={{
            padding: '0 5px'
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link href={product.productLink} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                    <Image
                      src={product.images[0]?.large || product.productImg}
                      alt={product.name}
                      fill
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '15px' }}>
                    {/* Brand Name */}
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#000',
                      marginBottom: '4px',
                      textTransform: 'uppercase'
                    }}>
                      LUFIVA
                    </div>

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
                      {product.name}
                    </div>

                    {/* Pricing */}
                    <div style={{ marginBottom: '8px' }}>
                      {product.discount && (
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
                          {product.discount}
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {product.priceOriginal > product.priceCurrent && (
                          <div style={{
                            textDecoration: 'line-through',
                            color: '#999',
                            fontSize: '12px'
                          }}>
                            ₺ {product.priceOriginal.toFixed(2)}
                          </div>
                        )}
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#000'
                        }}>
                          ₺ {product.priceCurrent.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Variants Info */}
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {product.variants.length > 0 ? 
                        `${product.variants.filter((v: any) => v.type === 'Beden').length} Beden ${product.variants.filter((v: any) => v.type === 'Renk').length} Renk` :
                        '4 Beden 4 Renk'
                      }
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom" style={{
          position: 'absolute',
          left: '-15px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '40px',
          height: '40px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          ‹
        </div>

        <div className="swiper-button-next-custom" style={{
          position: 'absolute',
          right: '-15px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '40px',
          height: '40px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          ›
        </div>

        {/* Custom Pagination */}
        <div className="swiper-pagination-custom" style={{
          textAlign: 'center',
          marginTop: '20px'
        }}></div>
      </div>
    </div>
  );
}