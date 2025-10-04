'use client';

import React, { useState, useEffect } from 'react';
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('0 (5')) {
      value = '0 (5';
    }
    // Phone formatting logic here
    setPhoneValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        name: formData.get('name'),
        phone: formData.get('phone'),
        city_id: formData.get('city_id'),
        district_id: formData.get('district_id'),
        neighborhood_id: formData.get('neighborhood_id'),
        address: formData.get('address'),
        amount_type: apiProduct?.shipping?.find((opt: any) => opt.code === selectedShippingCode)?.paymentType == "card" ? "kart" : "nakit",
        quantity: selectedPackage,
        total_price: totalPrice,
        product_id: apiProduct?.id,
        products: apiProduct?.name,
        ref_url: window.location.href,
        shipping_code: selectedShippingCode || null
      });

      if (response.data.success) {
        window.location.href = `/order/${response.data.order_id}/promosyon`;
      }
    } catch (error: any) {
      console.error('Order submission failed:', error);
      alert(error.response?.data?.message || 'Sipariş gönderilirken bir hata oluştu.');
    }
  };

  return (
    <div>
      {/* Header Image */}
      <div style={{ width: '100%' }}>
        <img 
          style={{ width: '100%', maxWidth: '100%' }} 
          src="https://fermin.com.tr/assets/imgs/products/magicmilk/payment_page.jpg"
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
        <div className="part1">
          <input
            type="radio"
            style={{ opacity: 0, visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}
            name="offer1"
            value="374"
            checked={selectedPackage === '374'}
            onChange={(e) => setSelectedPackage(e.target.value)}
          />
          <label>
            <img
              src={`https://fermin.com.tr/assets/imgs/products/magicmilk/${selectedPackage === '374' ? 'selected' : 'unselected'}/1.png`}
              width="100%"
              alt="Package 1"
            />
          </label>
        </div>
        {/* Add other package options similarly */}

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
                <input type="text" className="form-control" required />
              </div>

              <div className="form-group mb-3">
                <label className="mb-1">Telefon</label>
                {phoneError && <span style={{ color: 'red' }}>{phoneError}</span>}
                <input
                  type="tel"
                  className="form-control"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  placeholder="0 (5__) ___ __ __"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="mb-1">Adres</label>
                <textarea className="form-control" rows={3} required />
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
