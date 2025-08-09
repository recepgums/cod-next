'use client';

import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
import { parseSettings } from '../../utils/parseSettings';
import { Product, ProductOption } from '../../types/product';
const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

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
  const [variants, setVariants] = useState<any[]>([]); // Added variants state

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const selectOption = (option: ProductOption) => {
    setSelectedOption(option);
  };

  // Load variants from product settings
  useEffect(() => {
    if (product && product.settings) {
      try {
        const settings = product.settings;
        if (settings.variants) {
          // Handle double-encoded JSON string
          let variantsData;
          variantsData = settings.variants;
          
          setVariants(variantsData);
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, [product]);

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