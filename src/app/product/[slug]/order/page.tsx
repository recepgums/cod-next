'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Footer from '../../../components/Footer';

export default function TwoStepOrderForm() {
  const params = useParams();
  const productId = params.slug;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load product data
  useEffect(() => {
    if (!productId) return;

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`)
      .then(res => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="text-center">
          <h4>Ürün bulunamadı</h4>
          <p>Lütfen tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="two-step-order-form">
      {/* Header */}
      <div className="header text-center mx-auto mb-4">
        <a href="/"><img style={{height: 50}} src="/images/logo.png" alt="TrendyGoods" /></a>
      </div>

      {/* Product Image */}
      {product.images && product.images.length > 0 && (
        <div className="text-center mb-4">
          <img 
            src={product.images[0]?.medium || '/placeholder-product.jpg'} 
            style={{maxWidth: '100%', height: 'auto'}}
            alt={product.name}
          />
        </div>
      )}

      {/* Order Form */}
      <div className="container-fluid">
        <h2 className="text-center mb-4">{product.name}</h2>
        <p className="text-center mb-4">Order form will be implemented here...</p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
} 