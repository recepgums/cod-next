'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, ProductOption } from '../types/product';

interface OrderModalProps {
  showModal: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    options: ProductOption[];
    cities?: any[];
    settings?: any; // Changed from string to any since it's already parsed
  };
  selectedOption?: ProductOption | null;
  onOptionSelect: (option: ProductOption) => void;
}

export default function OrderModal({ 
  showModal, 
  onClose, 
  product, 
  selectedOption, 
  onOptionSelect 
}: OrderModalProps) {
  
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [phoneError, setPhoneError] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("nakit");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);

  // Use cities from product prop
  const cities = product.cities || [];

  // Calculate total price including payment method cost
  const calculateTotalPrice = () => {
    const basePrice = selectedOption?.price || product?.price || 0;
    const paymentCost = selectedPaymentType === "kart" ? 
      (parseFloat(product.settings?.card_payment_cost) || 19.00) : 
      (parseFloat(product.settings?.cash_payment_cost) || 0);
    return Number(basePrice) + Number(paymentCost);
  };

  // Get payment cost for display
  const getPaymentCost = (type: string) => {
    if (type === "kart") {
      return parseFloat(product.settings?.card_payment_cost) || 19.00;
    } else {
      return parseFloat(product.settings?.cash_payment_cost) || 0;
    }
  };

  // Check if product is campaign
  const isCampaign = product.settings?.is_campaign || false;
  const unit = product.settings?.unit || 'Adet';

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
    const isValid = validatePhone(phone);
    setIsPhoneValid(isValid);
    setPhoneError(isValid ? "" : "Geçerli bir telefon numarası giriniz (05XXXXXXXXX)");
  };

  // Load variants from product settings
  useEffect(() => {
    if (product && product.settings) {
      try {
        const settings = product.settings;
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

  // Update variant fields when quantity changes
  useEffect(() => {
    if (selectedOption && Object.keys(variants).length > 0) {
      const quantity = selectedOption.quantity;
      const newSelectedVariants = Array(quantity).fill(null).map(() => ({}));
      setSelectedVariants(newSelectedVariants);
    }
  }, [selectedOption, variants]);

  // Debug variant rendering
  useEffect(() => {
  }, [variants, selectedVariants]);

  // Auto-select first product option when modal opens
  useEffect(() => {
    if (showModal && product && product.options && product.options.length > 0 && !selectedOption) {
      onOptionSelect(product.options[0]);
    }
  }, [showModal, product, selectedOption, onOptionSelect]);

  const handleVariantChange = (index: number, type: string, value: string) => {
    const newSelectedVariants = [...selectedVariants];
    newSelectedVariants[index] = { ...newSelectedVariants[index], [type]: value };
    setSelectedVariants(newSelectedVariants);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const formData = new FormData(e.target as HTMLFormElement);
    
    // Collect variant data
    const variantsData = selectedVariants.filter(variant => 
      Object.keys(variant).length > 0 && Object.values(variant).some(value => value)
    );
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        name: formData.get('name'),
        phone: formData.get('phone'),
        city_id: formData.get('city_id'),
        district_id: formData.get('district_id'),
        neighborhood_id: formData.get('neighborhood_id'),
        address: formData.get('address'),
        amount_type: formData.get('amount_type'),
        quantity: selectedOption?.quantity || 1,
        total_price: selectedOption?.price || product.price,
        product_id: product.id,
        products: product.name,
        ref_url: window.location.href,
        variants: variantsData // Include variant data in the request
      });

      if (response.data.success) {
        // Redirect to promotion page
        window.location.href = `/order/${response.data.order_id}/promosyon`;
      } else {
        setSubmitError(response.data.message || "Sipariş gönderilirken bir hata oluştu.");
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Sipariş gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup in case component unmounts while modal is open
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  return (
    <>
      {/* Modal Backdrop */}
      {showModal && (
        <div 
          className="modal-backdrop show" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1040
          }}
          onClick={onClose}
        />
      )}

      {/* Order Modal */}
      <div className={`modal fade${showModal ? ' show' : ''}`} id="fullScreenModal" tabIndex={-1} role="dialog" aria-labelledby="fullScreenModalLabel" aria-hidden="true" style={{display: showModal ? 'block' : 'none'}}>
        <div className="modal-dialog modal-dialog-centered modal-fullscreen" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center" id="fullScreenModalLabel">Sipariş Formu</h5>
              <button type="button" className="close" onClick={onClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{overflow: 'scroll'}}>
              <form method="post" className="order-form" id="order-form" onSubmit={handleFormSubmit}>
                <input type="hidden" name="ref_url" id="ref_url" />
                <input type="hidden" name="quantity" id="quantity" value={selectedOption?.quantity || 1} />
                <input type="hidden" name="total_price" id="total_price" value={selectedOption?.price.toFixed(2) || product.price.toFixed(2)} />
                <input type="hidden" name="products" value={product.name} />
                <input type="hidden" name="product_id" value={product.id} />
                <div>
                  {/* Product Options in Modal */}
                  {product.options.map((opt, idx) => (
                    <div key={opt.quantity} className={`product-option d-flex align-items-center mb-1${opt.quantity === selectedOption?.quantity ? ' active' : ''}`} data-quantity={opt.quantity} onClick={() => onOptionSelect(opt)}>
                      <img src={product.images[0]} width={60} height={60} className="img-fluid" alt="product image" />
                      <div className="details">
                        <div className="info">
                          <span className="title">
                            {opt.displayText || `${opt.quantity} ${unit}`}
                            
                            {isCampaign && (
                              <>
                                <p style={{color: 'red', fontWeight: 'bold', fontSize: '.9rem'}}>
                                  Alana {opt.quantity} {unit} BEDAVA
                                </p>
                              </>
                            )}
                            
                            <small className="kargo-bedava">Ücretsiz Kargo</small>
                            
                            {!isCampaign && opt.discount > 0 && (
                              <div className="discount" style={{maxWidth: 115}}>
                                Tanesi {Math.round(opt.price / opt.quantity)}TL
                              </div>
                            )}
                            
                            {opt.discount > 0 && (
                              <div className="discount-badge" style={{color: 'red', fontWeight: 'bold', fontSize: '.8rem'}}>
                                %{Math.round((opt.discount / (opt.original || (product.price * opt.quantity))) * 100)} İndirim
                              </div>
                            )}
                          </span>
                          <span className="price">
                            {opt.price.toFixed(2)}TL
                            <br />
                            {opt.original && opt.original > opt.price && (
                              <div className="original-price">{opt.original.toFixed(2)}TL</div>
                            )}
                            {opt.quantity > 1 && (product.price * opt.quantity) > opt.price && (
                              <div className="original-price">{(product.price * opt.quantity).toFixed(2)}TL</div>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Variant Selection */}
                  {(() => {
                    return Object.keys(variants).length > 0 && (
                      <div className="variant-selection mb-3">
                        <div id="variant-container">
                          {selectedVariants.map((selectedVariant, index) => (
                            <div key={index} className="variant-item mb-3">
                              <div className="variant-item-title mb-2">{index + 1}. Ürün</div>
                              <div className="variant-options">
                                {Object.entries(variants).map(([type, variantData]: [string, any]) => (
                                  <select
                                    key={type}
                                    name={`variants[${index}][${type}]`}
                                    className="form-control mb-2"
                                    required
                                    value={selectedVariant[type] || ''}
                                    onChange={(e) => handleVariantChange(index, type, e.target.value)}
                                  >
                                    <option value="">{variantData.title || type} Seçin</option>
                                    {variantData.options.map((option: string) => (
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
                      <div className="col-4 value text-end">{(selectedOption?.price || product?.price || 0).toFixed(2)}TL</div>
                    </div>
                    <div className="row justify-content-between">
                      <div className="col-8 label">Kargo</div>
                      <div className="col-4 value text-end" id="shipping-cost">Ücretsiz</div>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="row justify-content-between" id="discounts">
                        <div className="col-8 label">İndirimler</div>
                        <div className="col-4 discount text-end" id="discount_amount">
                          -{calculateDiscount().toFixed(2)}TL ({getDiscountPercentage()}%)
                        </div>
                      </div>
                    )}
                    <div className="row justify-content-between total-row mt-2 pt-2 border-top">
                      <div className="col-8 label">Toplam</div>
                      <div className="col-4 total text-end" id="total-price">{calculateTotalPrice().toFixed(2)}TL</div>
                    </div>
                  </div>
                  {/* Shipping Section */}
                  <div className="shipping-section mb-3">
                    <div className={`form-check ${selectedPaymentType === "nakit" ? "active" : ""}`}>
                      <label className="form-check-label">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          value="nakit" 
                          name="amount_type" 
                          data-additional-cost={getPaymentCost("nakit")} 
                          checked={selectedPaymentType === "nakit"}
                          onChange={() => handlePaymentTypeChange("nakit")}
                        />
                        <span>Kapıda Nakit Ödeme</span>
                        <span>{getPaymentCost("nakit") > 0 ? `${getPaymentCost("nakit")}TL` : 'Ücretsiz'}</span>
                      </label>
                    </div>
                    <div className={`form-check ${selectedPaymentType === "kart" ? "active" : ""}`}>
                      <label className="form-check-label">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          value="kart" 
                          name="amount_type" 
                          data-additional-cost={getPaymentCost("kart")}
                          checked={selectedPaymentType === "kart"}
                          onChange={() => handlePaymentTypeChange("kart")}
                        />
                        <span>Kapıda Kartlı Ödeme</span>
                        <span>{getPaymentCost("kart")}TL</span>
                      </label>
                    </div>
                  </div>
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
                        type="tel" 
                        className={`form-control ${phoneError ? 'is-invalid' : isPhoneValid ? 'is-valid' : ''}`}
                        id="phoneInput" 
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
                        {cities.map((city: any) => (
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
                        {districts.map((district: any) => (
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
                        {neighborhoods.map((neighborhood: any) => (
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
                        `SİPARİŞİ TAMAMLAYIN - ${calculateTotalPrice().toFixed(2)}TL`
                      )}
                    </button>
                  </div>
                  
                  {submitError && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="mt-3 text-center">
                    Lütfen teslim almayacağınız siparişleri VERMEYİN!
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