'use client';

import React, { useState } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

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
  images: string[];
  options: ProductOption[];
  features: string[];
  rating: number;
  commentCount: number;
  comments: any[];
  cities: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string;
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
          {announcementTexts.map((t, i) => <span key={i}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 10}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 20}>{t}</span>)}
        </div>
      </div>

      {/* Gallery Container */}
      <div className="gallery-container mt-1">
        <div className="header text-center mx-auto">
          <a href="/"><img style={{height: 50}} src="/images/logo.png" alt="TrendyGoods" /></a>
        </div>

        {/* Full-width images stacked vertically */}
        {product.images && product.images.length > 0 && product.images.map((img: string, idx: number) => (
          <img 
            key={img + idx}
            src={img}
            style={{width: '100%', maxWidth: '100%'}}
            alt="product image"
            onClick={openModal}
            loading="lazy"
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