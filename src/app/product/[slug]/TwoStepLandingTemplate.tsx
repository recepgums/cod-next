'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

// NOTE: This template mirrors the provided static HTML.
// Everything is static except the countdown timer and query param forwarding.

interface TwoStepLandingTemplateProps {
  product: any; // Tam Product interface'ini buraya ekleyebilirsiniz
}

export default function TwoStepLandingTemplate({ product }: TwoStepLandingTemplateProps) {
  const [timer, setTimer] = useState({ minutes: '14', seconds: '36' });
  

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
    const slug = (product as any)?.alias || (product as any)?.slug || '';
    return `/product/${slug}/order`;
  }, [product]);

  const redirectToOrder = () => {
    window.location.href = orderHref;
  };

  // const images: string[] = [
  //   'https://fermin.com.tr/storage/437/fermin_engin_15_01.gif',
  //   'https://fermin.com.tr/storage/436/fermin_engin_15_02.gif',
  //   'https://fermin.com.tr/storage/435/fermin_engin_15_03.gif',
  //   'https://fermin.com.tr/storage/434/fermin_engin_15_04.gif',
  //   'https://fermin.com.tr/storage/433/fermin_engin_15_05.gif',
  //   'https://fermin.com.tr/storage/432/fermin_engin_15_06.gif',
  //   'https://fermin.com.tr/storage/430/fermin_engin_15_07.gif',
  //   'https://fermin.com.tr/storage/429/fermin_engin_15_08.gif',
  //   'https://fermin.com.tr/storage/428/fermin_engin_15_09.gif',
  //   'https://fermin.com.tr/storage/427/fermin_engin_15_10.gif',
  //   'https://fermin.com.tr/storage/426/fermin_engin_15_11.gif',
  //   'https://fermin.com.tr/storage/425/fermin_engin_15_12.gif',
  //   'https://fermin.com.tr/storage/424/fermin_engin_15_13.gif',
  //   'https://fermin.com.tr/storage/423/fermin_engin_15_14.gif',
  // ];

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
            <Image src="https://fermin.com.tr/assets/imgs/theme/sayac.png" width={176} height={44} style={{ height: 'auto', width: 'auto', maxHeight: '44px' }} alt="Sipariş Ver" />
          </a>
        </div>
      </div>

      {images.map((src, idx) => (
        <div key={src} style={{ width: '100%' }}>
          <a href={orderHref} style={{ display: 'block' }}>
            <Image
              src={src}
              alt="product image"
              width={1200}
              height={1600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              priority={idx === 0}
              loading={idx === 0 ? 'eager' : 'lazy'}
              style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
            />
          </a>
        </div>
      ))}
    </div>
  );
}