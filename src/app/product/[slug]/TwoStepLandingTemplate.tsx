'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

// NOTE: This template mirrors the provided static HTML.
// Everything is static except the countdown timer and query param forwarding.

export default function TwoStepLandingTemplate() {
  const [timer, setTimer] = useState({ minutes: '29', seconds: '39' });
  const [apiProduct, setApiProduct] = useState<any>(null);

  // Fetch product data but don't use it yet
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const parts = window.location.pathname.split('/').filter(Boolean);
    const slug = parts[1] || '';
    
    if (!slug) return;

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`)
      .then(res => {
        console.log('✅ Product data fetched in TwoStepLanding:', res.data.product?.name);
        setApiProduct(res.data.product);
      })
      .catch(err => {
        console.error('❌ Failed to fetch product:', err);
      });
  }, []);

  useEffect(() => {
    const countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 29);
    countDownDate.setSeconds(countDownDate.getSeconds() + 39);

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

  const images: string[] = [
    'https://fermin.com.tr/storage/437/fermin_engin_15_01.gif',
    'https://fermin.com.tr/storage/436/fermin_engin_15_02.gif',
    'https://fermin.com.tr/storage/435/fermin_engin_15_03.gif',
    'https://fermin.com.tr/storage/434/fermin_engin_15_04.gif',
    'https://fermin.com.tr/storage/433/fermin_engin_15_05.gif',
    'https://fermin.com.tr/storage/432/fermin_engin_15_06.gif',
    'https://fermin.com.tr/storage/430/fermin_engin_15_07.gif',
    'https://fermin.com.tr/storage/429/fermin_engin_15_08.gif',
    'https://fermin.com.tr/storage/428/fermin_engin_15_09.gif',
    'https://fermin.com.tr/storage/427/fermin_engin_15_10.gif',
    'https://fermin.com.tr/storage/426/fermin_engin_15_11.gif',
    'https://fermin.com.tr/storage/425/fermin_engin_15_12.gif',
    'https://fermin.com.tr/storage/424/fermin_engin_15_13.gif',
    'https://fermin.com.tr/storage/423/fermin_engin_15_14.gif',
  ];

  return (
    <div>
      <div id="count_u" style={{
        borderStyle: 'dashed',
        height: '70px',
        width: '100%',
        position: 'fixed',
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
            <img src="https://fermin.com.tr/assets/imgs/theme/sayac.png" style={{ maxHeight: '44px' }} alt="Sipariş Ver" />
          </a>
        </div>
      </div>

      {images.map((src) => (
        <div key={src} style={{ width: '100%' }}>
          <img
            style={{ width: '100%', maxWidth: '100%' }}
            src={src}
            onClick={redirectToOrder}
            alt="product image"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}