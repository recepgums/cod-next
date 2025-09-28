'use client';

import '../Nova.css';
import React, { useState } from 'react';
import Image from 'next/image';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

interface ProductImage {
  thumbnail: string;
  medium: string;
  large: string;
  mobile: string;
  original: string;
}

interface ProductOption {
  quantity: number;
  price: number;
  original?: number;
  discount: number;
  badge: string;
  isCampaign?: boolean;
  unit?: string;
  displayText?: string;
  finalDiscount?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  images: ProductImage[];
  options: ProductOption[];
  features: string[];
  rating: number;
  commentCount: number;
  comments: any[];
  cities: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string;
  logoUrl?: string;
}

const announcementTexts = [
  '💰 Kapıda Ödeme Seçeneği 💰',
  '❤️ Şeffaf Kargolu ❤️',
  '⭐ +10.000 Mutlu Müşteri ⭐',
];

interface ImageOnlyTemplateProps {
  product: Product;
}

export default function ImageOnlyTemplate({ product }: ImageOnlyTemplateProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);


  // Add to Cart eventi gönderme fonksiyonu
  const sendAddToCartEvent = () => {
    try {
      // Facebook Pixel AddToCart Event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_ids: [product.id.toString()],
          content_type: 'product',
          content_name: product.name,
          num_items: selectedOption?.quantity || 1
        });
      }

      // TikTok Pixel AddToCart Event
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('AddToCart', {
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_id: product.id.toString(),
          content_type: 'product',
          content_name: product.name,
          quantity: selectedOption?.quantity || 1
        });
      }

      console.log('AddToCart events sent:', {
        facebook: {
          event: 'AddToCart',
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_ids: [product.id.toString()],
          content_name: product.name
        },
        tiktok: {
          event: 'AddToCart',
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_id: product.id.toString(),
          content_name: product.name
        }
      });
    } catch (error) {
      console.error('Error sending AddToCart events:', error);
    }
  };


  const openModal = () => {
    setShowModal(true);
    sendAddToCartEvent();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const selectOption = (option: ProductOption) => {
    setSelectedOption(option);
  };

  return (
    <div className="image-only-template" style={{maxWidth: '600px', margin: '0 auto'}}>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="scrolling-text">
          {announcementTexts?.map((t, i) => <span key={i}>{t}</span>)}
          {announcementTexts?.map((t, i) => <span key={i + 10}>{t}</span>)}
          {announcementTexts?.map((t, i) => <span key={i + 20}>{t}</span>)}
        </div>
      </div>

      {/* Gallery Container */}
      <div className="gallery-container mt-1">
        <div className="header text-center mx-auto">
          <a href="/"><img style={{height: 50}} src={product.logoUrl || "/images/logo.png"} alt="Logo" /></a>
        </div>

        {/* Full-width images stacked vertically */}
        {product.images && product.images.length > 0 && product.images?.map((img: ProductImage, idx: number) => (
          <Image 
            key={img.medium + idx}
            src={img.medium}
            alt="product image"
            width={800}
            height={600}
            style={{width: '100%', maxWidth: '100%', height: 'auto', cursor: 'pointer'}}
            onClick={openModal}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ))}

        {/* Direct Order Button */}
        <div className="product-extra-link2 my-3" style={{width: '100%'}}>
          <button 
            type="button" 
            className="btn btn-success btn-block bounce w-100" 
            onClick={openModal}
          >
            Sipariş Ver - {product.price.toFixed(2)}TL
          </button>
        </div>
      </div>

      {/* Sticky Footer */}
      <StickyFooter 
        product={product}
        selectedOption={selectedOption}
        onOrderClick={openModal}
      />

      {/* Order Modal */}
      <OrderModal
        showModal={showModal}
        onClose={closeModal}
        product={{
          ...product,
          cities: product.cities
        }}
        selectedOption={selectedOption}
        onOptionSelect={selectOption}
      />

      {/* Footer */}
      <Footer />
      {product && product.pixels && (
        <PixelScripts pixels={product.pixels} product={product} />
      )}
    </div>
  );
}