'use client';

import React, { useEffect, useMemo, useState } from 'react';

// NOTE: This template mirrors the provided static HTML.
// Everything is static except the countdown timer and query param forwarding.

interface TwoStepLandingTemplateProps {
  product: any; // Tam Product interface'ini buraya ekleyebilirsiniz
}

export default function TwoStepLandingTemplate({ product }: TwoStepLandingTemplateProps) {
  const [timer, setTimer] = useState({ minutes: '14', seconds: '36' });
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

  const orderHref = useMemo(() => {
    if (typeof window === 'undefined') return '/';
    const { pathname, search } = window.location;
    const parts = pathname.split('/').filter(Boolean);
    const slug = parts[1] || '';
    return `/product/${slug}/order${search || ''}`;
  }, []);

  const redirectToOrder = () => {
    window.location.href = orderHref;
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
            {...(idx === 0 ? { fetchpriority: 'high' as any } : {})}
            style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
            onClick={redirectToOrder}
          />
        </div>
      ))}
    </div>
  );
}