'use client';

import React, { useState } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

export default function NovaTemplate({ product }: { product: any }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="nova-template" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h1 className="fw-bold" style={{ margin: 0 }}>{product?.name || 'Ürün'}</h1>
        <p style={{ margin: 0 }}>Premium Ürün Deneyimi</p>
      </div>

      <div className="mt-3">
        {Array.isArray(product?.images) && product.images.length > 0 && product.images.map((img: string, idx: number) => (
          <div key={img + idx} className="mb-3">
            <img
              src={img}
              alt={`${product?.name || 'Ürün'} - ${idx + 1}`}
              style={{ width: '100%', height: 'auto', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              loading="lazy"
              onClick={openModal}
            />
          </div>
        ))}
      </div>

      <div className="text-center p-3">
        <div className="mb-3">
          <span style={{ fontSize: '2rem', color: '#667eea', fontWeight: 700 }}>
            {typeof product?.price === 'number' ? product.price.toFixed(2) : product?.price} TL
          </span>
          {product?.oldPrice && (
            <span className="ms-3" style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>
              {typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : product.oldPrice} TL
            </span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg w-100"
          onClick={openModal}
          style={{ border: 'none', borderRadius: 24 }}
        >
          Hemen Sipariş Ver
        </button>
      </div>

      <StickyFooter
        product={product}
        selectedOption={selectedOption}
        onOrderClick={openModal}
      />

      <OrderModal
        showModal={showModal}
        onClose={closeModal}
        product={{ ...product, cities: product?.cities }}
        selectedOption={selectedOption}
        onOptionSelect={(opt: any) => setSelectedOption(opt)}
      />

      <Footer />
      {product && product.pixels && (
        <PixelScripts pixels={product.pixels} product={product} />
      )}
    </div>
  );
}


