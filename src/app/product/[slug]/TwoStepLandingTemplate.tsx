'use client';

import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import dynamic from 'next/dynamic';
import { parseSettings } from '../../utils/parseSettings';
import { Product, ProductOption } from '../../types/product';
const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

interface TwoStepLandingTemplateProps {
  product: Product;
}

export default function TwoStepLandingTemplate({ product }: TwoStepLandingTemplateProps) {
  const [timer, setTimer] = useState({ minutes: '29', seconds: '39' });
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [variants, setVariants] = useState<any[]>([]); // State for variants

  // Countdown timer effect
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
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });

      if (distance < 0) {
        clearInterval(x);
        setTimer({ minutes: '00', seconds: '00' });
      }
    }, 1000);

    return () => clearInterval(x);
  }, []);

  // Load variants from product settings
  useEffect(() => {
    if (product && product.settings) {
      try {
        const settings = parseSettings(product.settings);
        if (settings.variants) {
          // Handle double-encoded JSON string
          let variantsData;
          if (typeof settings.variants === 'string') {
            try {
              variantsData = JSON.parse(settings.variants);
            } catch (e) {
              variantsData = settings.variants;
            }
          } else {
            variantsData = settings.variants;
          }
          setVariants(variantsData);
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, [product]);

  const redirectToOrder = () => {
    const currentParams = window.location.search;
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}/order`;
    window.location.href = baseUrl + currentParams;
  };

  return (
    <div className="two-step-landing-template">
      {/* Fixed Countdown Timer */}
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
        <div className="d-flex align-items-center" id="demo" style={{height: '100%'}}>
          <div className="col ps-1 text-center" id="takip">İndirimin Bitmesine Kalan Süre</div>
          <div className="col d-flex mx-auto d-flex justify-content-center text-center px-1" id="ust_saat">
            <div className="p-1" style={{backgroundColor: '#2f2f2f'}} id="ustsayac_dakika">
              {timer.minutes}
            </div>
            <div className="p-1" style={{backgroundColor: '#2f2f2f'}} id="ustsayac_saniye">
              {timer.seconds}
            </div>
          </div>
          <a 
            className="col pe-1 text-end py-2" 
            id="UstTarafSiparisVerButton" 
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}/order`}
            style={{textDecoration: 'none', color: 'white'}}
          >
            <img src="/images/assets/sayac.png" style={{maxHeight: '44px'}} alt="Order" />
          </a>
        </div>
      </div>

      {/* Product Images */}
      {product.images && product.images.length > 0 && product.images.map((img: string, idx: number) => (
        <div key={img + idx} style={{width: '100%', paddingTop: '18%'}}>
          <img 
            style={{width: '100%', maxWidth: '100%'}} 
            src={img}
            onClick={redirectToOrder}
            alt="product image"
            loading="lazy"
          />
        </div>
      ))}

      {/* Sticky Footer */}
      <StickyFooter 
        product={product}
        selectedOption={selectedOption}
        onOrderClick={redirectToOrder}
      />

      {/* Footer */}
      <Footer />
      {product && product.pixels && (
        <PixelScripts pixels={product.pixels} product={product} />
      )}
    </div>
  );
} 