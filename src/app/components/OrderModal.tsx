'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faClock } from '@fortawesome/free-solid-svg-icons';

interface ProductOption {
  quantity: number;
  price: number;
  original?: number;
  discount: number;
  badge: string;
  isCampaign?: boolean;
  unit?: string;
  displayText?: string;
  finalDiscount?: number;
  title?: string;
}

interface ProductImage {
  thumbnail: string;
  medium: string;
  large: string;
  mobile: string;
  original: string;
}

interface ShippingOption {
  code: string;
  company: string;
  paymentType?: 'card' | 'cash';
}

const normalizeCompanyName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

const getShippingLogo = (company: string): string => {
  const key = normalizeCompanyName(company);
  if (key.includes('aras')) return '/aras.png';
  if (key.includes('ptt')) return '/ptt.png';
  if (key.includes('kargoturk') || key.includes('kargoturk')) return '/kargotürk.png';
  if (key.includes('hepsijet')) return '/hepsijet.jpg';
  return '/images/placeholder.svg';
};

interface OrderModalProps {
  showModal: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    images: ProductImage[];
    options: ProductOption[];
    cities?: any[];
    settings?: string; // Added settings to product prop
    shipping?: ShippingOption[];
    is_modal?: boolean;
  };
  selectedOption?: ProductOption | null;
  onOptionSelect: (option: ProductOption) => void;
  selectedVariants?: any[];
  onVariantChange?: (variants: any[]) => void;
}

export default function OrderModal({
  showModal,
  onClose,
  product,
  selectedOption,
  onOptionSelect,
  selectedVariants = [],
  onVariantChange
}: OrderModalProps) {

  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [phoneError, setPhoneError] = useState<string>("");
  const [inputPhone, setInputPhone] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("nakit");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [deliveryDates, setDeliveryDates] = useState({ start: '', end: '' });
  const [variants, setVariants] = useState<any>({});
  // selectedVariants artık prop olarak geliyor
  const [selectedShippingCode, setSelectedShippingCode] = useState<string>("360");
  const [showShippingError, setShowShippingError] = useState<boolean>(false);
  const shippingSectionRef = useRef<HTMLDivElement>(null);

  const PROTECTED_SHIPPING_AVAILABLE = false;
  const PROTECTED_SHIPPING_PRICE = 89.00;
  const [isProtectedShippingEnabled, setIsProtectedShippingEnabled] = useState<boolean>(false);

  // Use cities from product prop
  const cities = product.cities || [];

  // Calculate total price including payment method cost - memoized to prevent flickering
  const totalPrice = useMemo(() => {
    const basePrice = selectedOption
      ? (selectedOption.price - selectedOption.discount)
      : (product?.price || 0);

    const cardPaymentCost = product?.shipping?.find((opt) => opt.code === selectedShippingCode)?.paymentType === "card"
      ? parseFloat(JSON.parse(product.settings || '{}').card_payment_cost || "0")
      : parseFloat(JSON.parse(product.settings || '{}').cash_payment_cost || "0");

    const protectedShippingCost = isProtectedShippingEnabled ? PROTECTED_SHIPPING_PRICE : 0;

    return basePrice + cardPaymentCost + protectedShippingCost;
  }, [selectedOption, selectedShippingCode, product.price, product.settings, isProtectedShippingEnabled]);

  // Memoized values for form inputs to prevent flickering
  const memoizedQuantity = useMemo(() => selectedOption?.quantity || 1, [selectedOption?.quantity]);
  const memoizedTotalPrice = useMemo(() => totalPrice.toFixed(2), [totalPrice]);
  const memoizedProductName = useMemo(() => product.name, [product.name]);
  const memoizedProductId = useMemo(() => product.id, [product.id]);
  const memorizedShippingCost = useMemo(() => {
    return product?.shipping?.find((opt) => opt.code === selectedShippingCode)?.paymentType === "card"
    ? parseFloat(JSON.parse(product.settings || '{}').card_payment_cost || "0")
    : parseFloat(JSON.parse(product.settings || '{}').cash_payment_cost || "0");
  }, [product?.settings]);

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!selectedOption) return 0;

    // Calculate original total price (price * quantity)
    const originalTotal = (product.price * selectedOption.quantity);
    // Calculate discounted total
    const discountedTotal = selectedOption.price;
    // Return discount amount
    return originalTotal - discountedTotal;
  };

  // Get discount percentage
  const getDiscountPercentage = () => {
    if (!selectedOption) return 0;
    const discount = calculateDiscount();
    const originalTotal = (product.price * selectedOption.quantity);
    return originalTotal > 0 ? Math.round((discount / originalTotal) * 100) : 0;
  };

  const handlePaymentTypeChange = (paymentType: string) => {
    setSelectedPaymentType(paymentType);
  };

  const handleCityChange = async (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedDistrict("");
    setSelectedNeighborhood("");
    setDistricts([]);
    setNeighborhoods([]);

    if (cityId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities/${cityId}/districts`);
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error('Error loading districts:', error);
      }
    }
  };

  // Load neighborhoods when district changes
  const handleDistrictChange = async (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedNeighborhood("");
    setNeighborhoods([]);

    if (districtId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/districts/${districtId}/neighborhoods`);
        const data = await response.json();
        setNeighborhoods(data);
      } catch (error) {
        console.error('Error loading neighborhoods:', error);
      }
    }
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^05[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    console.log(phone);
    const isValid = validatePhone(phone);
    setIsPhoneValid(isValid);
    setPhoneError(isValid ? "" : "Geçerli bir telefon numarası giriniz (05XXXXXXXXX)");
    if ((phone?.[0] == "0" && phone.length < 2) || phone?.[1] == "5") {
      setInputPhone(phone);
    }
  };

  // Safely read card payment cost from settings
  const getCardPaymentCostText = () => {
    try {
      const settings = typeof product.settings === 'string' ? JSON.parse(product.settings) : (product.settings || {});
      const raw = settings?.card_payment_cost;
      const num = raw == null || raw === '' ? 0 : Number(raw);
      if (!isFinite(num) || num <= 0) return 'Ücretsiz';
      return `${num.toFixed(2)}TL`;
    } catch {
      return 'Ücretsiz';
    }
  };

  const getCashPaymentCostText = () => {
    try {
      const settings = typeof product.settings === 'string' ? JSON.parse(product.settings) : (product.settings || {});
      const raw = settings?.cash_payment_cost;
      const num = raw == null || raw === '' ? 0 : Number(raw);
      if (!isFinite(num) || num <= 0) return 'Ücretsiz';
      return `${num.toFixed(2)}TL`;
    } catch {
      return 'Ücretsiz';
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
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_ids: [product.id.toString()],
          content_type: 'product',
          content_name: product.name,
          num_items: selectedOption?.quantity || 1
        });
      }

      // TikTok Pixel Purchase Event
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('CompletePayment', {
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_id: product.id.toString(),
          content_type: 'product',
          content_name: product.name,
          quantity: selectedOption?.quantity || 1
        });

        (window as any).ttq.track('PlaceAnOrder', {
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_id: product.id.toString(),
          content_type: 'product',
          content_name: product.name,
          quantity: selectedOption?.quantity || 1
        });
      }

      console.log('Purchase events sent:', {
        facebook: {
          event: 'Purchase',
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_ids: [product.id.toString()],
          content_name: product.name
        },
        tiktok: {
          event: 'CompletePayment',
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_id: product.id.toString(),
          content_name: product.name
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


  // Load variants from product settings (supports array or object structures)
  useEffect(() => {
    if (!product?.settings) return;
    try {
      const settings = typeof product.settings === 'string' ? JSON.parse(product.settings) : product.settings;
      let rawVariants = settings?.variants;

      // If variants is a JSON string, parse it
      if (typeof rawVariants === 'string') {
        try {
          rawVariants = JSON.parse(rawVariants);
        } catch {
          rawVariants = undefined;
        }
      }

      // If variants is an array like [{ name, type, stock, alias }, ...],
      // group by type to build select options per type.
      if (Array.isArray(rawVariants)) {
        const grouped: Record<string, { title: string; options: string[] }> = {};
        rawVariants.forEach((v: any) => {
          const typeKey = (v?.type || 'Seçenek').toString();
          const optionName = (v?.name || '').toString();
          if (!grouped[typeKey]) grouped[typeKey] = { title: typeKey, options: [] };
          if (optionName && !grouped[typeKey].options.includes(optionName)) {
            grouped[typeKey].options.push(optionName);
          }
        });
        setVariants(grouped);
        return;
      }

      // If variants is already an object map { type: { title, options[] }, ... }
      if (rawVariants && typeof rawVariants === 'object') {
        setVariants(rawVariants);
      }
    } catch (error) {
      console.error('Error parsing variants:', error);
    }
  }, [product]);

  // Auto-select first product option when modal opens
  useEffect(() => {
    if (showModal && product && product.options && product.options.length > 0 && !selectedOption) {
      onOptionSelect(product.options[0]);
    }
  }, [showModal, product, selectedOption, onOptionSelect]);

  const handleVariantChange = (index: number, type: string, value: string) => {
    if (!onVariantChange) return;

    const newSelectedVariants = [...selectedVariants];
    newSelectedVariants[index] = { ...newSelectedVariants[index], [type]: value };
    onVariantChange(newSelectedVariants);
    console.log('🔄 OrderModal variant changed:', { index, type, value, selectedVariants: newSelectedVariants });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Validate phone before proceeding
    if (!validatePhone(inputPhone)) {
      setIsSubmitting(false);
      setIsPhoneValid(false);
      setPhoneError('Geçerli bir telefon numarası giriniz (05XXXXXXXXX)');
      try {
        const el = document.getElementById('phoneInput') as HTMLInputElement | null;
        el?.focus();
      } catch { }
      return;
    }

    // Require shipping selection when options exist
    if (Array.isArray(product?.shipping) && product?.shipping?.length > 0 && !selectedShippingCode) {
      setIsSubmitting(false);
      setShowShippingError(true);
      setSubmitError('Lütfen bir kargo firması seçiniz.');
      try {
        shippingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch { }
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        name: formData.get('name'),
        phone: formData.get('phone'),
        city_id: formData.get('city_id'),
        district_id: formData.get('district_id'),
        neighborhood_id: formData.get('neighborhood_id'),
        address: formData.get('address'),
        amount_type: product?.shipping?.find((opt) => opt.code === selectedShippingCode)?.paymentType == "card" ? "kart" : "nakit",
        quantity: selectedOption?.quantity || 1,
        total_price: totalPrice,
        product_id: product.id,
        products: product.name,
        ref_url: window.location.href,
        protected_shipping: isProtectedShippingEnabled,
        protected_shipping_cost: isProtectedShippingEnabled ? PROTECTED_SHIPPING_PRICE : 0,
        shipping_code: selectedShippingCode || null
      });

      if (response.data.success) {

        try {
          await axios.post('/api/order-log', {
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            quantity: selectedOption?.quantity || 1,
            total_price: totalPrice,
            product_id: product.id,
            products: product.name,
            ref_url: window.location.href,
            order_id: response.data.order_id,
          });
        } catch { }
        // Redirect to promotion page
        sendPurchaseEvent(response.data);
        window.location.href = `/order/${response.data.order_id}/promosyon`;
      } else {
        setSubmitError(response.data.message || "Sipariş gönderilirken bir hata oluştu.");
      }
    } catch (error: any) {

      try {
        await axios.post('/api/order-log', {
          name: formData.get('name') ?? null,
          phone: formData.get('phone') ?? null,
          address: formData.get('address') ?? null,
          quantity: selectedOption?.quantity ?? null,
          total_price: typeof totalPrice !== 'undefined' ? totalPrice : null,
          product_id: product?.id ?? null,
          products: product?.name ?? null,
          ref_url: typeof window !== 'undefined' && window.location ? window.location.href : null,
          order_id: "sipariş oluşmadı",
        });
      } catch { }

      setSubmitError(error.response?.data?.message || "Sipariş gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate delivery dates
  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 3);

    setDeliveryDates({
      start: startDate.toLocaleDateString('tr-TR'),
      end: endDate.toLocaleDateString('tr-TR')
    });
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if(process.env.NEXT_IS_LOCAL = "true"){
      // product.is_modal = true
    }

    if (showModal && product?.is_modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup in case component unmounts while modal is open
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal, product?.is_modal]);

  return (
    <>
      {/* Modal Backdrop */}
      {showModal && (
        <div
          className={product?.is_modal ? `modal-backdrop show` : 'd-none'}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1040
          }}
          onClick={product?.is_modal ? onClose : undefined}
        />
      )}

      {/* Order Modal */}
      <div
        className={product?.is_modal ? `modal fade${showModal ? ' show' : ''}` : 'ssss'}
        id={product?.is_modal ? `fullScreenModal` : ''}
        tabIndex={product?.is_modal ? -1 : undefined}
        role="dialog"
        aria-labelledby={product?.is_modal ? `fullScreenModalLabel` : ''}
        aria-hidden="true"
        style={{ display: product?.is_modal ? (showModal ? 'block' : 'none') : 'block' }}
        onClick={product?.is_modal ? onClose : undefined}
      >
        <div className={product?.is_modal ? `modal-dialog modal-dialog-centered modal-fullscreen` : ''} role="document" onClick={(e) => e.stopPropagation()}>
          <div className={"modal-content p-0" + product?.is_modal ? "": "bottom" } onClick={(e) => e.stopPropagation()}>
            <div className={product?.is_modal ? `modal-header py-2` : 'd-none'}>
              <h5 className="modal-title text-center" id="fullScreenModalLabel">Sipariş Formu</h5>
              <button type="button" className="close" onClick={onClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body p-2" style={{ overflow: 'scroll' }}>
              <form method="post" className="order-form" id="order-form" onSubmit={handleFormSubmit}>
                <input type="hidden" name="ref_url" id="ref_url" />
                <input type="hidden" name="quantity" id="quantity" value={memoizedQuantity} />
                <input type="hidden" name="total_price" id="total_price" value={memoizedTotalPrice} />
                <input type="hidden" name="products" value={memoizedProductName} />
                <input type="hidden" name="product_id" value={memoizedProductId} />
                <div>
                  {/* Product Options in Modal */}
                  {product.options?.map((opt, idx) => (
                    <div key={opt.quantity} style={{ padding: '3px' }} className={`product-option d-flex align-items-center mb-1${opt.quantity === selectedOption?.quantity ? ' active' : ''}`} data-quantity={opt.quantity} onClick={() => onOptionSelect(opt)}>
                      <img src={product.images[0]?.thumbnail || '/placeholder-product.jpg'} width={60} height={60} className="img-fluid" alt="product image" />
                      <div className="details">
                        <div className="info">
                          <span className="title">
                            <span>
                              {opt.title || `${opt.quantity} Adet`}
                            </span>

                            {opt.isCampaign && (
                              <span style={{ color: 'red', fontWeight: 'bold', fontSize: '.9rem' }}>
                                {opt.quantity} {opt.unit || 'Adet'} BEDAVA
                              </span>
                            )}
                            {memorizedShippingCost == 0 && (
                              <span className="kargo-bedava mx-2">Ücretsiz Kargo</span>
                            )}

                            {opt.discount > 0 && (
                              <div className="discount" style={{ maxWidth: "max-content" }}>
                                Tanesi {Math.ceil((opt.price - opt.discount) / opt.quantity)}TL
                              </div>
                            )}


                            {opt.quantity > 1 && (product.price * opt.quantity) > opt.price && (
                              <div className="discount-badge" style={{ color: 'red', fontWeight: 'bold', fontSize: '.8rem' }}>
                                %{Math.round(((product.price * opt.quantity - opt.price) / (product.price * opt.quantity)) * 100)} İndirim
                              </div>
                            )}
                          </span>
                          <span className="price">
                            {(opt.price - opt.discount)?.toFixed(2)}TL
                            <br />
                            {opt.discount > 0 && (
                              <div className="original-price">{opt.price?.toFixed(2)}TL</div>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Variant Selection */}
                  {(() => {
                    return Object.keys(variants || {}).length > 0 && (
                      <div className="variant-selection mb-3">
                        <div id="variant-container">
                          {(selectedVariants ?? []).map((selectedVariant, index) => (
                            <div key={index} className="variant-item mb-3">
                              <div className="variant-item-title mb-2">{index + 1}. Ürün</div>
                              <div className="variant-options">
                                {(Object.entries(variants ?? {}) as [string, any][])?.map(([type, variantData]) => (
                                  <select
                                    key={type}
                                    name={`variants[${index}][${type}]`}
                                    className="form-control mb-2"
                                    required
                                    value={(selectedVariant?.[type] ?? '')}
                                    onChange={(e) => handleVariantChange(index, type, e.target.value)}
                                  >
                                    <option value="">{variantData?.title || type} Seçin</option>
                                    {(variantData?.options ?? []).map((option: string) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Total Section */}
                  <div className="total-section mb-1">
                    <div className="row justify-content-between">
                      <div className="col-8 label">Ara Toplam</div>
                      <div className="col-4 value text-end">{totalPrice?.toFixed(2)}TL</div>
                    </div>
                    <div className="row justify-content-between">
                      <div className="col-8 label">Kargo</div>
                      <div className="col-4 value text-end" id="shipping-cost">
                        {(() => {
                          const p = product?.shipping?.find((opt) => opt.code === selectedShippingCode)?.paymentType;
                          if (!p) return 'Seçiniz';
                          return p === 'card' ? getCardPaymentCostText() : getCashPaymentCostText();
                        })()}
                      </div>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="row justify-content-between" id="discounts">
                        <div className="col-8 label">İndirimler</div>
                        <div className="col-4 discount text-end" id="discount_amount">
                          -{calculateDiscount()?.toFixed(2)}TL ({getDiscountPercentage()}%)
                        </div>
                      </div>
                    )}
                    <div className="row justify-content-between total-row mt-2 pt-2 border-top">
                      <div className="col-8 label">Toplam</div>
                      <div className="col-4 total text-end" id="total-price">{totalPrice?.toFixed(2)}TL</div>
                    </div>
                  </div>

                  {/* Shipping Company Selection */}
                  {Array.isArray(product?.shipping) && product?.shipping?.length > 0 && (
                    <div className="mb-3" ref={shippingSectionRef}>
                      <span className="mb-2 fw-bold">Kargo Seçiniz</span>
                      {showShippingError && (
                        <span className="text-danger mt-2 ms-2" style={{ fontWeight: 'bold' }} role="alert">Lütfen bir kargo firması seçiniz.</span>
                      )}
                      <div className="d-flex flex-column gap-2">
                        {product?.shipping?.map((opt) => {
                          const isSelected = selectedShippingCode === opt.code;
                          const pType = (opt.paymentType);
                          const accepts = pType === 'card'
                            ? { cash: true, card: true }
                            : { cash: true, card: false };
                          const badge = accepts.cash && accepts.card
                            ? { text: 'Kapıda Kart/Nakit', bg: '#22a05a', color: '#fff' }
                            : accepts.card
                              ? { text: 'Sadece Kart', bg: '#d8a11d', color: '#fff' }
                              : { text: 'Kapıda Nakit', bg: '#0d6efd', color: '#fff' };
                          const priceText = (() => {
                            const p = (opt.paymentType);
                            if (p === 'card') return getCardPaymentCostText();
                            return getCashPaymentCostText();
                          })();
                          return (
                            <div
                              key={opt.code}
                              className={`d-flex align-items-center justify-content-between p-3 rounded`}
                              style={{ background: '#f7f7f9' }}
                              onClick={() => { setSelectedShippingCode(opt.code); setShowShippingError(false); setSubmitError(''); }}
                            >
                              <div className="d-flex align-items-center" style={{ gap: 12 }}>
                                {/* Custom radio */}
                                <span
                                  aria-hidden
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: '50%',
                                    border: `2px solid ${isSelected ? '#20c997' : '#c9c9ce'}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  {isSelected && (
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#20c997' }} />
                                  )}
                                </span>
                                <img src={getShippingLogo(opt.company)} alt={`${opt.company} logo`} style={{ width: 58, height: 'auto' }} />
                                <div>
                                  <div className="fw-semibold" style={{ lineHeight: 1.1 }}>{opt.company}</div>
                                  <div
                                    style={{
                                      display: 'inline-block',
                                      padding: '4px 10px',
                                      borderRadius: 999,
                                      background: badge.bg,
                                      color: badge.color,
                                      fontSize: 12,
                                      marginTop: 6
                                    }}
                                  >
                                    {badge.text}
                                  </div>
                                </div>
                              </div>
                              <div className="fw-semibold" style={{ color: '#404040' }}>{priceText}</div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}
                  {/* Shipping Section */}
                  {/* <div className="shipping-section mb-3">
                    <div className={`form-check ${selectedPaymentType === "nakit" ? "active" : ""}`}>
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          value="nakit"
                          name="paymentType"
                          data-additional-cost=".00TL"
                          checked={selectedPaymentType === "nakit"}
                          onChange={() => handlePaymentTypeChange("nakit")}
                        />
                        <span>Kapıda Nakit Ödeme</span>
                        <span>
                          {getCashPaymentCostText()}
                        </span>
                      </label>
                    </div>
                    <div className={`form-check ${selectedPaymentType === "kart" ? "active" : ""}`}>
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          value="kart"
                          name="paymentType"
                          data-additional-cost="19.00"
                          checked={selectedPaymentType === "kart"}
                          onChange={() => handlePaymentTypeChange("kart")}
                        />
                        <span>Kapıda Kartlı Ödeme</span>
                         <span>{getCardPaymentCostText()}</span>
                      </label>
                    </div>
                  </div> */}

                  {/* Protected Shipping Section (Korumalı Kargo) */}
                  {PROTECTED_SHIPPING_AVAILABLE && (
                    <div className="protected-shipping-section mb-3">
                      <div className="protected-shipping-item d-flex align-items-center justify-content-between p-3 border rounded">
                        <div className="d-flex align-items-center">
                          <div className="protected-shipping-icon me-3 position-relative">
                            <div className="shield-icon" style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: '#e3f2fd',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }}>
                              <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#1976d2', fontSize: '20px' }} />
                              <div style={{
                                position: 'absolute',
                                bottom: '-2px',
                                right: '-2px',
                                width: '16px',
                                height: '16px',
                                backgroundColor: '#1976d2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <FontAwesomeIcon icon={faClock} style={{ color: 'white', fontSize: '8px' }} />
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="fw-bold">Korumalı Kargo</div>
                            <div className="text-muted small">
                              Siparişini kargolama esnasında oluşabilecek hasar, kayıp veya hırsızlıktan koru
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="me-3 fw-bold text-primary">{PROTECTED_SHIPPING_PRICE.toFixed(2)}TL</span>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="protectedShipping"
                              checked={isProtectedShippingEnabled}
                              onChange={(e) => setIsProtectedShippingEnabled(e.target.checked)}
                              style={{
                                width: '50px',
                                height: '25px',
                                backgroundColor: isProtectedShippingEnabled ? '#28a745' : '#6c757d'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-user"></i></span>
                      <input name="name" type="text" required className="form-control" placeholder="Adınız Soyadınız" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-phone"></i></span>
                      <input
                        name="phone"
                        autoComplete="off"
                        required
                        value={inputPhone}
                        type="tel"
                        className={`form-control ${phoneError ? 'is-invalid' : isPhoneValid ? 'is-valid' : ''}`}
                        id="phoneInput"
                        pattern="^05[0-9]{9}$"
                        placeholder="05XXXXXXXXX"
                        onChange={handlePhoneChange}
                        maxLength={11}
                      />
                    </div>
                    <div className="invalid-feedback" id="phoneError">{phoneError}</div>
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-map-marker"></i></span>
                      <select
                        required
                        name="city_id"
                        className="form-control"
                        id="citySelect"
                        value={selectedCity}
                        onChange={e => handleCityChange(e.target.value)}
                      >
                        <option value="">İl Seçiniz</option>
                        {cities?.map((city: any) => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-map-marker"></i></span>
                      <select
                        required
                        name="district_id"
                        className="form-control"
                        id="districtSelect"
                        value={selectedDistrict}
                        onChange={e => handleDistrictChange(e.target.value)}
                        disabled={!selectedCity}
                      >
                        <option value="">İlçe Seçiniz</option>
                        {districts?.map((district: any) => (
                          <option key={district.id || district.fest_id} value={district.id || district.fest_id}>{district.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-1">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-map-marker"></i></span>
                      <select
                        name="neighborhood_id"
                        className="form-control"
                        id="neighborhoodSelect"
                        value={selectedNeighborhood}
                        onChange={e => setSelectedNeighborhood(e.target.value)}
                        disabled={!selectedDistrict}
                      >
                        <option value="">Mahalle Seçiniz</option>
                        {neighborhoods?.map((neighborhood: any) => (
                          <option key={neighborhood.id || neighborhood.fest_id} value={neighborhood.id || neighborhood.fest_id}>{neighborhood.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <small className="text-info">Örn: Silahtarağa mah örnek sok no:1/20</small>
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-home"></i></span>
                      <textarea name="address" rows={2} required className="form-control" placeholder="Sokak, Kapı Numarası ve Daire" />
                    </div>
                  </div>


                  {submitError && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {submitError}
                    </div>
                  )}

                  <div className="pb-5 text-center">
                    Lütfen teslim almayacağınız siparişleri VERMEYİN!
                  </div>

                  <div className="product-extra-link2 fixed-bottom-button">
                    <button
                      type="submit"
                      className="btn btn-success btn-block complete-order"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sipariş Gönderiliyor...
                        </>
                      ) : (
                        `SİPARİŞİ TAMAMLAYIN - ${totalPrice?.toFixed(2)}TL`
                      )}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Add styles for variants
const variantStyles = `
  .variant-item {
    margin-bottom: 20px;
  }

  .variant-item-title {
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .variant-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  option:disabled {
    color: #999;
    font-style: italic;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = variantStyles;
  document.head.appendChild(styleElement);
} 