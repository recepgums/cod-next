'use client';

import React from 'react';

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

interface StickyFooterProps {
  product: {
    name: string;
    oldPrice: number;
    price: number;
  };
  selectedOption?: ProductOption | null;
  onOrderClick: () => void;
}

export default function StickyFooter({ product, selectedOption, onOrderClick }: StickyFooterProps) {
  return (
    <div className="sticky-footer">
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">
          <span className="original-price">{product.oldPrice.toFixed(2)}TL</span>
          <span className="text-danger" style={{fontWeight: 'bolder', fontSize: '1.1rem'}}>
            {selectedOption?.price.toFixed(2) || product.price.toFixed(2)}TL
          </span>
        </div>
      </div>
      <button className="add-to-cart-btn" onClick={onOrderClick}>
        Sipariş Ver
      </button>
    </div>
  );
} 