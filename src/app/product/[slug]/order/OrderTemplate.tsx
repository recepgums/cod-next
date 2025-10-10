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

  // Fire AddToCart when order page is visited (once per day)
  useEffect(() => {
    const sendAddToCartEvent = () => {
      try {
        // Check if already sent within 24 hours
        const cached = localStorage.getItem('add_to_cart_event');
        if (cached) {
          const data = JSON.parse(cached);
          const lastSent = new Date(data.timestamp);
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          
          if (lastSent > oneDayAgo && data.product_id === apiProduct?.id?.toString()) {
            console.log('OrderTemplate: AddToCart event already sent within 24 hours, skipping...');
            return;
          }
        }

        const value = apiProduct?.price || 0;
        const qty = 1;
        const pid = apiProduct?.id?.toString?.() || '';
        const pname = apiProduct?.name || '';

        // Send immediately if pixels are ready
        const hasFbq = typeof window !== 'undefined' && !!(window as any).fbq;
        const hasTtq = typeof window !== 'undefined' && !!(window as any).ttq;

        if (hasFbq) {
          (window as any).fbq('track', 'AddToCart', {
            value,
            currency: 'TRY',
            content_ids: [pid],
            content_type: 'product',
            content_name: pname,
            num_items: qty
          });
          console.log('✅ Facebook AddToCart event sent');
        }

        if (hasTtq) {
          (window as any).ttq.track('AddToCart', {
            value,
            currency: 'TRY',
            content_id: pid,
            content_type: 'product',
            content_name: pname,
            quantity: qty
          });
          console.log('✅ TikTok AddToCart event sent');
        }

        if (hasFbq || hasTtq) {
          // Cache the event with timestamp
          localStorage.setItem('add_to_cart_event', JSON.stringify({
            timestamp: new Date().toISOString(),
            event: 'AddToCart',
            product_id: pid
          }));
          console.log('📦 AddToCart event cached for 24 hours');
        } else {
          console.log('⏳ Pixels not ready yet, will retry...');
        }
      } catch (error) {
        console.error('❌ Error sending AddToCart event:', error);
      }
    };

    // Try immediately
    sendAddToCartEvent();

    // Also try after a short delay to catch late-loading pixels
    const timeout = setTimeout(() => {
      sendAddToCartEvent();
    }, 2000);

    return () => clearTimeout(timeout);
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

  const prefix = "0 (5";

  const formatPhoneNumber = (value: string) => {
    let formatted = "";
    if (value.length > 0) formatted += value.substring(0, 3) + " ";
    if (value.length >= 4) formatted += value.substring(3, 5) + " ";
    if (value.length >= 6) formatted += value.substring(5, 7);
    return formatted.trim();
  };

  const setCaretPosition = (el: HTMLInputElement, position: number) => {
    if (el.setSelectionRange) {
      el.focus();
      el.setSelectionRange(position, position);
    }
  };

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (phoneValue === "" || phoneValue === prefix) {
      setPhoneValue(prefix);
      setTimeout(() => {
        setCaretPosition(e.target, e.target.value.length);
      }, 0);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target.selectionStart! < prefix.length) {
      setTimeout(() => {
        setCaretPosition(target, target.value.length);
      }, 0);
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    if (!inputValue.startsWith(prefix)) {
      inputValue = prefix;
    }

    let val = inputValue.slice(prefix.length).replace(/\D/g, "");
    let areaCode = val.slice(0, 2);
    let remaining = val.slice(2);

    const newValue = prefix + areaCode + (areaCode.length === 2 ? ") " : "") + formatPhoneNumber(remaining);
    setPhoneValue(newValue);
    
    setTimeout(() => {
      setCaretPosition(e.target, newValue.length);
    }, 0);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const target = e.target as HTMLInputElement;
      let position = target.selectionStart || 0;
      
      if (position <= prefix.length) {
        e.preventDefault();
        return;
      }
      
      if (phoneValue[position - 1] === " " ||
          phoneValue[position - 1] === "(" ||
          phoneValue[position - 1] === ")") {
        e.preventDefault();
        target.setSelectionRange(position - 1, position - 1);
      }
    }
  };

  const handlePhoneBlur = () => {
    const rawNumber = phoneValue.replace(/\D/g, "");
    if (rawNumber.length < 11) {
      if (phoneValue !== "" && phoneValue !== prefix) {
        setPhoneError("Geçerli bir telefon numarası giriniz");
      }
    } else {
      setPhoneError("");
    }
  };

  const isValidTRMobile = (val: string) => {
    const digits = (val || '').replace(/\D/g, '');
    return digits.length === 11 && digits.startsWith('05');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone
    if (!isValidTRMobile(phoneValue)) {
      setPhoneError('Geçerli bir telefon numarası giriniz');
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
        
        // Try to send purchase event immediately, then retry after a delay
        firePurchaseEvent(response.data);
        setTimeout(() => firePurchaseEvent(response.data), 1000);
      }
    } catch (error: any) {
      console.error('Order submission failed:', error);
      alert(error.response?.data?.message || 'Sipariş gönderilirken bir hata oluştu.');
    }
  };

  
  const firePurchaseEvent = (orderData: any) => {
    try {
      // Check if already sent within 24 hours
      const purchaseEvent = localStorage.getItem('purchase_event');
      if (purchaseEvent) {
        const purchaseEventData = JSON.parse(purchaseEvent);
        const lastSent = new Date(purchaseEventData.timestamp);
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        if (lastSent > oneDayAgo) {
          console.log('🔒 Purchase event already sent within 24 hours, skipping...');
          return;
        }
      }

      const value = totalPrice;
      const pid = apiProduct?.id?.toString() || '';
      const pname = apiProduct?.name || '';
      const qty = Number(selectedQuantity) || 1;

      // Facebook Pixel Purchase Event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value,
          currency: 'TRY',
          content_ids: [pid],
          content_type: 'product',
          content_name: pname,
          num_items: qty
        });
        console.log('💰 Facebook Purchase event sent!');
      }

      // TikTok Pixel Purchase Event
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('CompletePayment', {
          value,
          currency: 'TRY',
          content_id: pid,
          content_type: 'product',
          content_name: pname,
          quantity: qty
        });
        console.log('💰 TikTok CompletePayment event sent!');

        (window as any).ttq.track('PlaceAnOrder', {
          value,
          currency: 'TRY',
          content_id: pid,
          content_type: 'product',
          content_name: pname,
          quantity: qty
        });
        console.log('💰 TikTok PlaceAnOrder event sent!');
      }

      // Cache with timestamp
      localStorage.setItem('purchase_event', JSON.stringify({
        timestamp: new Date().toISOString(),
        event: 'Purchase'
      }));
      console.log('📦 Purchase event cached for 24 hours');
    } catch (error) {
      console.error('❌ Error sending purchase events:', error);
    }
  };

  if (orderSuccess) {
    return (
      <div>
        <div style={{ width: '100%' }} id="">
          <img style={{ width: '100%', maxWidth: '100%' }} src="/TwoStepImages/torder1.jpg" alt="Order Success 1" />
        </div>
        <div style={{ width: '100%' }} id="">
          <a href={`/product/${slug}`}>
            <img style={{ width: '100%', maxWidth: '100%' }} src="/TwoStepImages/torder2.jpg" alt="Order Success 2" />
          </a>
        </div>
        <div style={{ width: '100%' }} id="">
          <a href="#">
            <img style={{ width: '100%', maxWidth: '100%' }} src="/TwoStepImages/torder3.jpg" alt="Order Success 3" />
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
                src="/TwoStepImages/indirim.gif" 
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
                  onChange={handlePhoneInput}
                  onFocus={handlePhoneFocus}
                  onClick={handlePhoneClick}
                  onKeyDown={handlePhoneKeyDown}
                  onBlur={handlePhoneBlur}
                  placeholder="0 (5__) ___ __ __"
                  autoComplete="off"
                  minLength={13}
                  inputMode="numeric"
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
