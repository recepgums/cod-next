'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard2 from '../../../components/ProductCard2';
import './RelatedProducts.css';

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
    <div className="related-products-section">
      <h3 className="related-products-title">
        Benzer Ürünler
      </h3>

      <div className="related-products-swiper">
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
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard2
                image={product.images[0]?.large || product.productImg}
                title={product.name}
                rating={product.rating}
                priceCurrent={product.priceCurrent}
                priceOriginal={product.priceOriginal}
                slug={product.slug}
                productLink={product.productLink}
                variants={product.variants}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" color="#000" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style={{color:"black", marginLeft:"7px"}}><path fill="none" d="M0 0h24v24H0z"></path><path d="M11.67 3.87 9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path></svg>
        </div>

        <div className="swiper-button-next-custom">
          ›
        </div>

        {/* Custom Pagination */}
        <div className="swiper-pagination-custom"></div>
      </div>
    </div>
  );
}