'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

// NOTE: This template mirrors the provided static HTML.
// Everything is static except the countdown timer and query param forwarding.

interface TwoStepLandingTemplateProps {
  product: any; // Tam Product interface'ini buraya ekleyebilirsiniz
}

export default function TwoStepLandingTemplate({ product }: TwoStepLandingTemplateProps) {
  const [timer, setTimer] = useState({ minutes: '14', seconds: '36' });
  const [orderHref, setOrderHref] = useState(`/product/${product?.slug || ''}/order`);
  // Use server-provided product prop directly to ensure images are in initial HTML

  useEffect(() => {
    const countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 14);
    countDownDate.setSeconds(countDownDate.getSeconds() + 37);

    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate.getTime() - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimer({
        minutes: String(Math.max(0, minutes)).padStart(2, '0'),
        seconds: String(Math.max(0, seconds)).padStart(2, '0')
      });

      if (distance < 0) {
        clearInterval(x);
        setTimer({ minutes: '00', seconds: '00' });
      }
    }, 1000);

    return () => clearInterval(x);
  }, []);

  useEffect(() => {
    // Update href with query params after hydration
    if (typeof window !== 'undefined') {
      const { pathname, search } = window.location;
      const parts = pathname.split('/').filter(Boolean);
      const slug = parts[1] || product?.slug || '';
      setOrderHref(`/product/${slug}/order${search || ''}`);
    }
  }, [product?.slug]);

  const redirectToOrder = () => {
    // Order sayfasında AddToCart eventi gönderilecek, burada sadece yönlendir
    sendAddToCartEvent();
    window.location.href = orderHref;
  };

  const sendAddToCartEvent = () => {
    try {
      // Daha önce gönderilmiş mi kontrol et (1 gün içinde)
      const cached = localStorage.getItem('twostep_add_to_cart_event');
      if (cached) {
        const data = JSON.parse(cached);
        const lastSent = new Date(data.timestamp);
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const host = typeof window !== 'undefined' ? window.location.host : 'ssr';
        
        if (lastSent > oneDayAgo && data.product_id === product?.id?.toString() && data.host === host) {
          return; // 1 gün içinde aynı ürün için gönderilmiş
        }
      }

      const value = product?.price || 0;
      const pid = product?.id?.toString?.() || '';
      const pname = product?.name || '';

      // Facebook Pixel AddToCart Event
      const hasFbq = typeof window !== 'undefined' && (window as any).fbq;
      const hasTtq = typeof window !== 'undefined' && (window as any).ttq;
      if (hasFbq) {
        (window as any).fbq('track', 'AddToCart', {
          value,
          currency: 'TRY',
          content_ids: [pid],
          content_type: 'product',
          content_name: pname,
          num_items: 1
        });
        try {
          (window as any).fbq('trackCustom', 'KartaEklendi', {
            value,
            currency: 'TRY',
            content_ids: [pid],
            content_type: 'product',
            content_name: pname,
            num_items: 1,
            host: typeof window !== 'undefined' ? window.location.host : 'ssr'
          });
        } catch {}
      }

      // TikTok Pixel AddToCart Event
      if (hasTtq) {
        (window as any).ttq.track('AddToCart', {
          value,
          currency: 'TRY',
          content_id: pid,
          content_type: 'product',
          content_name: pname,
          quantity: 1
        });
      }

      // Cache'e kaydet — yalnızca en az bir gönderim denendiyse
      if (hasFbq || hasTtq) {
        localStorage.setItem('twostep_add_to_cart_event', JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'AddToCart',
          product_id: pid,
          host: typeof window !== 'undefined' ? window.location.host : 'ssr'
        }));
      } else {
      }

    } catch (error) {
      console.error('Error sending TwoStep AddToCart events:', error);
    }
  };

  const images: string[] = (product?.images || []).map((img: any) => img.original).filter(Boolean);

  return (
    <div>
      <div id="count_u" style={{
        borderStyle: 'dashed',
        height: '70px',
        width: '100%',
        backgroundColor: '#e54d42',
        zIndex: 999,
        color: 'white',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '16px'
        }}>
        <div className="d-flex align-items-center" id="demo" style={{ height: '100%' }}>
          <div className="col ps-1 text-center" id="takip">İndirimin Bitmesine Kalan Süre</div>
          <div className="col d-flex mx-auto d-flex justify-content-center text-center px-1" id="ust_saat">
            <div className="p-1" style={{ backgroundColor: '#2f2f2f' }} id="ustsayac_dakika">
              {timer.minutes}
              <br />Dakika
            </div>
            <div className="p-1" style={{ backgroundColor: '#2f2f2f' }} id="ustsayac_saniye">
              {timer.seconds}
              <br />Saniye
            </div>
          </div>
          <a className="col pe-1 text-end py-2" id="UstTarafSiparisVerButton" href={orderHref} style={{ textDecoration: 'none', color: 'white' }}>
            <img src="/TwoStepImages/sayac.png" style={{ maxHeight: '44px' }} alt="Sipariş Ver" />
          </a>
        </div>
      </div>

      {images.map((src, idx) => (
        <div key={src} style={{ width: '100%' }}>
          <img
            src={src}
            alt="product image"
            width={1200}
            height={1200}
            decoding="async"
            loading={idx === 0 ? 'eager' : 'lazy'}
            fetchPriority={idx === 0 ? 'high' : undefined}
            style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
            onClick={redirectToOrder}
          />
        </div>
      ))}

      {/* Pixel Scripts */}
      {product && product.pixels && (
        <PixelScripts pixels={product.pixels} product={product} />
      )}
    </div>
  );
}