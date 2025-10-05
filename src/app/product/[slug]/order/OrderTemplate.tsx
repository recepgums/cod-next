'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface OrderTemplateProps {
  slug: string;
}

export default function OrderTemplate({ slug }: OrderTemplateProps) {
  const [timer, setTimer] = useState({ hours: '00', minutes: '14', seconds: '00' });
  const [selectedPackage, setSelectedPackage] = useState('374');
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [apiProduct, setApiProduct] = useState<any>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [refUrlData, setRefUrlData] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<string>('1');

  const quantityImages = useMemo(() => {
    try {
      const settings = apiProduct?.settings;
      const parsed = settings && typeof settings === 'string' ? JSON.parse(settings) : settings;
      const raw = parsed?.quantity_images;
      const imagesObj = raw && typeof raw === 'string' ? JSON.parse(raw) : raw;
      return imagesObj || {};
    } catch {
      return {} as Record<string, { selected_url?: string; unselected_url?: string }>;
    }
  }, [apiProduct?.settings]);

  const quantityPrices = useMemo(() => {
    try {
      const settings = apiProduct?.settings;
      const parsed = settings && typeof settings === 'string' ? JSON.parse(settings) : settings;
      const raw = parsed?.quantity_price;
      const priceObj = raw && typeof raw === 'string' ? JSON.parse(raw) : raw;
      return priceObj || {};
    } catch {
      return {} as Record<string, number>;
    }
  }, [apiProduct?.settings]);

  // Fetch product data but don't use it yet
  useEffect(() => {
    if (!slug) return;

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`)
      .then(res => {
        console.log('✅ Product data fetched in OrderTemplate:', res.data.product?.name);
        setApiProduct(res.data.product);
      })
      .catch(err => {
        console.error('❌ Failed to fetch product:', err);
      });
  }, [slug]);

  // Load ref URL data from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedData = localStorage.getItem('ref_url_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setRefUrlData(parsedData);
      } catch (error) {
        console.error('Error parsing ref URL data:', error);
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 29);
    countDownDate.setSeconds(countDownDate.getSeconds() + 16);

    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate.getTime() - now;

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 120));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimer({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });

      if (distance < 0) {
        clearInterval(x);
        setTimer({ hours: '00', minutes: '00', seconds: '00' });
      }
    }, 1000);

    return () => clearInterval(x);
  }, []);

  const totalPrice = useMemo(() => {
    const price = quantityPrices?.[selectedQuantity];
    return typeof price === 'number' ? price : 0;
  }, [selectedQuantity, quantityPrices]);

  const formatTRMobile = (input: string) => {
    let digits = (input || '').replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    digits = digits.slice(0, 10);

    let out = '0 ';
    if (digits.length > 0) {
      out += '(' + digits.slice(0, Math.min(3, digits.length));
      if (digits.length >= 3) out += ') ';
    }
    if (digits.length > 3) {
      out += digits.slice(3, Math.min(6, digits.length));
      if (digits.length >= 6) out += ' ';
    }
    if (digits.length > 6) {
      out += digits.slice(6, Math.min(8, digits.length));
      if (digits.length >= 8) out += ' ';
    }
    if (digits.length > 8) {
      out += digits.slice(8, Math.min(10, digits.length));
    }
    return out;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTRMobile(e.target.value);
    setPhoneValue(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log(formData.get('name'));
    console.log(formData.get('phone'));
    console.log(formData.get('address'));
    console.log(selectedPackage);
    console.log(totalPrice);
    console.log(apiProduct?.id);
    console.log(apiProduct?.name);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        quantity: selectedQuantity,
        total_price: totalPrice,
        product_id: apiProduct?.id,
        products: apiProduct?.name ,
        ref_url: refUrlData?.fullUrl,
        
      });

      if (response.data.success) {
        setOrderId(response.data.order_id);
        setOrderSuccess(true);
      }
    } catch (error: any) {
      console.error('Order submission failed:', error);
      alert(error.response?.data?.message || 'Sipariş gönderilirken bir hata oluştu.');
    }
  };

  if (orderSuccess) {
    return (
      <div>
        <div style={{ width: '100%' }} id="">
          <img style={{ width: '100%', maxWidth: '100%' }} src="https://greenbubble-trofficial.com/setmobile/images/torder1.jpg" alt="Order Success 1" />
        </div>
        <div style={{ width: '100%' }} id="">
          <a href={`/product/${slug}`}>
            <img style={{ width: '100%', maxWidth: '100%' }} src="https://greenbubble-trofficial.com/setmobile/images/torder2.jpg" alt="Order Success 2" />
          </a>
        </div>
        <div style={{ width: '100%' }} id="">
          <a href="#">
            <img style={{ width: '100%', maxWidth: '100%' }} src="https://greenbubble-trofficial.com/setmobile/images/torder3.jpg" alt="Order Success 3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Image */}
      <div style={{ width: '100%' }} 
      onClick={()=>{
        console.log(apiProduct);
      }}
      >
        <img 
          style={{ width: '100%', maxWidth: '100%' }} 
          src={
            (() => {
              try {
                if (apiProduct?.settings) {
                  const parsed = typeof apiProduct.settings === "string"
                    ? JSON.parse(apiProduct.settings)
                    : apiProduct.settings;
                  if (parsed && parsed.order_image) {
                    return parsed.order_image;
                  }
                }
              } catch (e) {
                // fail silently, fallback below
              }
              return "";
            })()
          }
          alt="Product Header"
        />
      </div>

      {/* Timer Section */}
      <div className="container-fluid" style={{ backgroundColor: '#53475a', display: 'none' }}>
        <div className="bannerCounterDiv text-center py-2 text-white">
          <p>
            <span className="titleSpan" style={{ fontSize: '5vw', fontWeight: 300 }}>
              SADECE BUGÜNE ÖZEL
            </span>
            <br />
            <span className="subtitleSpan" style={{ color: 'yellow', fontSize: '5vw', fontWeight: 800 }}>
              %60 İNDİRİM <br />
            </span>
          </p>
          <div className="outerCounter mt-3" style={{ paddingBottom: '22px' }}>
            <div className="counter" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <div className="kalanurun" style={{ width: 'initial', marginRight: '15px' }}>
                <span className="mb-2" style={{ display: 'block', padding: '0 10px', fontSize: '3vw' }}>
                  KALAN STOK
                </span>
                <p className="quata2" style={{
                  fontSize: '18px',
                  marginLeft: 0,
                  lineHeight: 'initial',
                  display: 'inline-flex',
                  padding: '7px 10px',
                  width: '100%',
                  justifyContent: 'center',
                  backgroundColor: '#ffcf0c',
                  borderRadius: '10px'
                }}>
                  0060
                </p>
              </div>
              <div className="sayac" style={{ width: 'auto' }}>
                <span className="mb-2" style={{ display: 'block', padding: '0 10px', fontSize: '3vw' }}>
                  KALAN SÜRE
                </span>
                <div style={{ backgroundColor: '#ffcf0c', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '7px 10px' }}>
                    <div>{timer.hours}</div>
                    <div>:</div>
                    <div>{timer.minutes}</div>
                    <div>:</div>
                    <div>{timer.seconds}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Selection */}
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center justify-content-center">
        <div className="part1" id="two" style={{}}>
          <input
            type="radio"
            style={{ opacity: 0, visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}
            className="packageBtn"
            value="374"
            id="1302"
            checked={selectedPackage === '374'}
            onChange={(e) => { setSelectedPackage(e.target.value); setSelectedQuantity('1'); }}
            data-quantity="1"
            data-price={quantityPrices['1'] ?? ''}
          />
          <label htmlFor="1302">
            <img
              className="image_replce"
              id="s_374"
              src={(selectedQuantity === '1' ? quantityImages['1']?.selected_url : quantityImages['1']?.unselected_url) || `https://fermin.com.tr/assets/imgs/products/magicmilk/${selectedPackage === '374' ? 'selected' : 'unselected'}/1.png`}
              data-original={quantityImages['1']?.unselected_url || 'https://fermin.com.tr/assets/imgs/products/magicmilk/unselected/1.png'}
              data-active={quantityImages['1']?.selected_url || 'https://fermin.com.tr/assets/imgs/products/magicmilk/selected/1.png'}
              width="100%"
              alt="Package 1"
            />
          </label>
        </div>
        <div className="part1" id="three" style={{}}>
          <input
            type="radio"
            style={{ display: 'none' }}
            className="packageBtn"
            value="375"
            id="1303"
            checked={selectedPackage === '375'}
            onChange={(e) => { setSelectedPackage(e.target.value); setSelectedQuantity('2'); }}
            data-quantity="2"
            data-price={quantityPrices['2'] ?? ''}
          />
          <label htmlFor="1303">
            <img
              className="image_replce"
              id="s_375"
              src={(selectedQuantity === '2' ? quantityImages['2']?.selected_url : quantityImages['2']?.unselected_url) || `https://fermin.com.tr/assets/imgs/products/magicmilk/${selectedPackage === '375' ? 'selected' : 'unselected'}/2.png`}
              data-original={quantityImages['2']?.unselected_url || 'https://fermin.com.tr/assets/imgs/products/magicmilk/unselected/2.png'}
              data-active={quantityImages['2']?.selected_url || 'https://fermin.com.tr/assets/imgs/products/magicmilk/selected/2.png'}
              width="100%"
              alt="Package 2"
            />
          </label>
        </div>
        <div className="part1" id="four" style={{}}>
          <input
            type="radio"
            style={{ display: 'none' }}
            className="packageBtn"
            value="376"
            id="1304"
            checked={selectedPackage === '376'}
            onChange={(e) => { setSelectedPackage(e.target.value); setSelectedQuantity('4'); }}
            data-quantity="4"
            data-price={quantityPrices['4'] ?? ''}
          />
          <label htmlFor="1304">
            <img
              className="image_replce"
              id="s_376"
              src={(selectedQuantity === '4' ? quantityImages['4']?.selected_url : quantityImages['4']?.unselected_url) || `https://fermin.com.tr/assets/imgs/products/magicmilk/${selectedPackage === '376' ? 'selected' : 'unselected'}/3.png`}
              data-original={quantityImages['4']?.unselected_url || 'https://fermin.com.tr/assets/imgs/products/magicmilk/unselected/3.png'}
              data-active={quantityImages['4']?.selected_url || 'https://fermin.com.tr/assets/imgs/products/magicmilk/selected/3.png'}
              width="100%"
              alt="Package 3"
            />
          </label>
        </div>

        {/* Form Section */}
        <div className="container" style={{ backgroundColor: '#2c3a47', color: 'white', maxWidth: '960px' }}>
          <div className="row">
            <div className="col-md-6 p-3">
              <img 
                src="https://greenbubble-trofficial.com/images/indirim.gif" 
                className="mb-3" 
                style={{ maxWidth: '100%', border: '5px solid #ffe27e' }}
                alt="Discount"
              />

              <div className="form-group mb-3">
                <label className="mb-1">Ad Soyad</label>
                <input type="text" className="form-control" name="name" required />
              </div>

              <div className="form-group mb-3">
                <label className="mb-1">Telefon</label>
                {phoneError && <span style={{ color: 'red' }}>{phoneError}</span>}
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  placeholder="0 (5__) ___ __ __"
                  inputMode="numeric"
                  maxLength={18}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="mb-1">Adres</label>
                <textarea className="form-control" name="address" rows={3} required />
              </div>

              <button type="submit" className="btn btn-success w-100 py-3" style={{ fontWeight: 600, fontSize: '17px' }}>
                <i className="fas fa-shopping-cart mx-2"></i>
                <span>Siparişi Tamamla</span>
              </button>
            </div>

            {/* Info Section */}
            <div className="col-md-6">
              <div style={{ backgroundColor: '#314150', padding: '15px' }}>
                <div className="p-4" style={{ backgroundColor: '#2c3a47' }}>
                  <div className="mb-4">
                    <div className="mb-3" style={{ fontSize: '24px' }}>
                      <i className="fas fa-clock" style={{ color: '#ce0002', fontSize: '32px' }}></i>
                      {' '}Aynı Gün Kargo
                    </div>
                    <p style={{ fontSize: '13px' }}>
                      Siparişiniz aynı gün kargoya verilmektedir. Max 3 iş günü içerisinde teslim edilmektedir.
                    </p>
                  </div>
                  {/* Add other info sections */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
