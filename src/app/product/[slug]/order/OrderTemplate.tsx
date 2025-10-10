'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface OrderTemplateProps {
  slug: string;
  product: any;
}

export default function OrderTemplate({ slug, product }: OrderTemplateProps) {
  const [timer, setTimer] = useState({ hours: '00', minutes: '14', seconds: '00' });
  const [selectedPackage, setSelectedPackage] = useState('374');
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [apiProduct, setApiProduct] = useState<any>(product || null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [refUrlData, setRefUrlData] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<string>('1');
  const formRef = useRef<HTMLFormElement>(null);
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

  const quantityDisplayTexts = useMemo(() => {
    try {
      const settings = apiProduct?.settings;
      const parsed = settings && typeof settings === 'string' ? JSON.parse(settings) : settings;
      const raw = parsed?.quantity_display_text;
      const displayObj = raw && typeof raw === 'string' ? JSON.parse(raw) : raw;
      return displayObj || {};
    } catch {
      return {} as Record<string, string>;
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

  const quantityDiscounts = useMemo(() => {
    try {
      const settings = apiProduct?.settings;
      const parsed = settings && typeof settings === 'string' ? JSON.parse(settings) : settings;
      const raw = parsed?.quantity_discount;
      const discountObj = raw && typeof raw === 'string' ? JSON.parse(raw) : raw;
      return discountObj || {};
    } catch {
      return {} as Record<string, number>;
    }
  }, [apiProduct?.settings]);

  const discountedPrices = useMemo(() => {
    const result: Record<string, number> = {};
    Object.keys(quantityPrices || {}).forEach((k) => {
      const base = Number((quantityPrices as any)[k]) || 0;
      const disc = Number((quantityDiscounts as any)[k]) || 0;
      const finalVal = Math.max(0, base - disc);
      result[k] = finalVal;
    });
    return result;
  }, [quantityPrices, quantityDiscounts]);

  const totalPrice = useMemo(() => {
    const price = discountedPrices?.[selectedQuantity];
    return typeof price === 'number' ? price : 0;
  }, [selectedQuantity, discountedPrices]);

  const quantityKeys = useMemo(() => {
    try {
      return Object.keys(discountedPrices || {}).sort((a, b) => Number(a) - Number(b));
    } catch {
      return [] as string[];
    }
  }, [discountedPrices]);

  useEffect(() => {
    // Ensure selected quantity is one of the available options
    if (!selectedQuantity && quantityKeys.length > 0) {
      setSelectedQuantity(quantityKeys[0]);
      return;
    }
    if (selectedQuantity && !quantityKeys.includes(selectedQuantity) && quantityKeys.length > 0) {
      setSelectedQuantity(quantityKeys[0]);
    }
  }, [quantityKeys, selectedQuantity]);

  // Product already provided by server; keep state only if needed for local parsing

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

  // Fire AddToCart when order page is visited (once)
  useEffect(() => {
    try {
      const cached = localStorage.getItem('add_to_cart_event');
      if (cached) {
        const data = JSON.parse(cached);
        if (data.expires && new Date(data.expires) > new Date()) {
          return;
        }
      }

      const value = typeof totalPrice === 'number' && totalPrice > 0 ? totalPrice : (apiProduct?.price || 0);
      const qty = Number(selectedQuantity) || 1;
      const pid = apiProduct?.id?.toString?.() || '';
      const pname = apiProduct?.name || '';

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          value,
          currency: 'TRY',
          content_ids: [pid],
          content_type: 'product',
          content_name: pname,
          num_items: qty
        });
      }
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('AddToCart', {
          value,
          currency: 'TRY',
          content_id: pid,
          content_type: 'product',
          content_name: pname,
          quantity: qty
        });
      }

      localStorage.setItem('add_to_cart_event', JSON.stringify({
        expires: new Date(Date.now() + 1000 * 60 * 60 * 6),
        event: 'AddToCart'
      }));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isValidTRMobile = (val: string) => {
    const digits = (val || '').replace(/\D/g, '');
    return digits.length === 11 && digits.startsWith('05');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTRMobile(e.target.value);
    setPhoneValue(formatted);
    if (isValidTRMobile(formatted)) {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone
    if (!isValidTRMobile(phoneValue)) {
      setPhoneError('Geçerli bir telefon numarası giriniz (0 (5__) ___ __ __)');
      try { document.getElementById('telephone')?.focus(); } catch {}
      return;
    }

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
        products: apiProduct?.name,
        ref_url: refUrlData?.fullUrl,
        
      });

      if (response.data.success) {
        setOrderId(response.data.order_id);
        setOrderSuccess(true);
        sendPurchaseEvent(response.data);
      }
    } catch (error: any) {
      console.error('Order submission failed:', error);
      alert(error.response?.data?.message || 'Sipariş gönderilirken bir hata oluştu.');
    }
  };

  
  const sendPurchaseEvent = (orderData: any) => {
    try {

      const purchaseEvent = localStorage.getItem('purchase_event');
      if (purchaseEvent) {
        const purchaseEventData = JSON.parse(purchaseEvent);
        if (purchaseEventData.expires && new Date(purchaseEventData.expires) > new Date()) {
          return;
        }
      }

      // Facebook Pixel Purchase Event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value: totalPrice,
          currency: 'TRY',
          content_ids: [apiProduct?.id?.toString() || ''],
          content_type: 'product',
          content_name: apiProduct?.name || '',
          num_items: Number(selectedQuantity) || 1
        });
      }

      // TikTok Pixel Purchase Event
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('CompletePayment', {
          value: totalPrice,
          currency: 'TRY',
          content_id: apiProduct?.id?.toString() || '',
          content_type: 'product',
          content_name: apiProduct?.name || '',
          quantity: Number(selectedQuantity) || 1
        });

        (window as any).ttq.track('PlaceAnOrder', {
          value: totalPrice,
          currency: 'TRY',
          content_id: apiProduct?.id?.toString() || '',
          content_type: 'product',
          content_name: apiProduct?.name || '',
          quantity: Number(selectedQuantity) || 1
        });
      }

      console.log('Purchase events sent:', {
        facebook: {
          event: 'Purchase',
          value: totalPrice,
          currency: 'TRY',
          content_ids: [apiProduct?.id?.toString() || ''],
          content_name: apiProduct?.name || ''
        },
        tiktok: {
          event: 'CompletePayment',
          value: totalPrice,
          currency: 'TRY',
          content_id: apiProduct?.id?.toString() || '',
          content_name: apiProduct?.name || ''
        }
      });
      localStorage.setItem('purchase_event', JSON.stringify({
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        event: 'Purchase'
      }));
    } catch (error) {
      console.error('Error sending purchase events:', error);
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
        console.log(formRef.current);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      >
        <img 
          style={{ width: '100%', maxWidth: '100%', height: 'auto' }} 
          width={1200}
          height={1200}
          decoding="async"
          loading="eager"
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
      <div className="container-fluid order-template" style={{ backgroundColor: '#53475a', display: 'none' }}>
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
      <form ref={formRef} onSubmit={handleSubmit} className="d-flex flex-column align-items-center justify-content-center">
        {quantityKeys.map((qKey, idx) => {
          const id = `opt_${qKey}`;
          const isSelected = selectedQuantity === qKey;
          const images = quantityImages[qKey] || {};
          const labelText = quantityDisplayTexts[qKey] || `${qKey} ${(apiProduct?.unit || 'Adet')}`;
          const imgAlt = `Package ${qKey}`;
          return (
            <div key={qKey} className="part1" style={{}}>
              <input
                type="radio"
                style={{ opacity: 0, visibility: 'hidden', position: 'absolute', width: 0, height: 0 }}
                className="packageBtn"
                name="offer1"
                value={qKey}
                id={id}
                checked={isSelected}
                onChange={(e) => { setSelectedPackage(e.target.value); setSelectedQuantity(qKey); }}
                data-quantity={qKey}
                data-price={discountedPrices[qKey] ?? ''}
                aria-label={labelText}
              />
              <label htmlFor={id} title={labelText}>
                <img
                  className="image_replce w-100"
                  src={isSelected ? (images.selected_url || '') : (images.unselected_url || '')}
                  data-original={images.unselected_url || ''}
                  data-active={images.selected_url || ''}
                  decoding="async"
                  loading={isSelected ? 'eager' : 'lazy'}
                  alt={imgAlt}
                />
              </label>
            </div>
          );
        })}

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
                  id="telephone"
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
