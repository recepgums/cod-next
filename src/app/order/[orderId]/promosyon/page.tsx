"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// Header/Footer are now rendered by route-specific layout.tsx
import './promotion.css';

interface ProductVariant {
  type: string;
  name: string;
  stock: number;
}

interface ProductImage {
  thumbnail: string;
  medium: string;
  large: string;
  mobile: string;
  original: string;
}

interface UpsellProduct {
  id: number;
  name: string;
  priceCurrent: number;
  priceOriginal: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  settings?: any;
  emoji_benefits?: string;
  content?: string;
}

interface Order {
  id: number;
  products: string;
  total_price: string;
  orderItems: any[];
}

export default function PromosyonPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<UpsellProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<{[productId: number]: {[type: string]: string}}>({});
  const [addingToCart, setAddingToCart] = useState<{[productId: number]: boolean}>({});
  const [addedToCart, setAddedToCart] = useState<{[productId: number]: boolean}>({});
  const [finishingOrder, setFinishingOrder] = useState(false);

  useEffect(() => {
    loadUpsellData();
  }, [orderId]);

  const loadUpsellData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/promotion`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setProducts(data.products || []);
        
      } else {
        setError("Sipariş bilgileri yüklenemedi.");
      }
    } catch (error) {
      console.error('Error loading upsell data:', error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (productId: number, type: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: value
      }
    }));
  };

  const validateVariants = (productId: number): boolean => {
    const product = products.find(p => p.id === productId);
    if (!product?.variants || product.variants.length === 0) return true;
    
    const productVariants = selectedVariants[productId] || {};
    return product.variants.every(variant => productVariants[variant.type]);
  };

  const addToCart = async (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Validate variants if product has them
    if (product.variants && product.variants.length > 0) {
      if (!validateVariants(productId)) {
        alert('Lütfen tüm varyant seçeneklerini seçiniz.');
        return;
      }
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      const formData = new FormData();
      formData.append('product_id', productId.toString());
      formData.append('product_name', product.settings?.alias || product.name);
      const promotionDiscount = parseInt(process.env.NEXT_PUBLIC_PROMOTION_DISCOUNT_AMOUNT || '0');
      formData.append('product_price', (product.priceCurrent - promotionDiscount).toString());
      formData.append('quantity', '1');
      
      if (product.variants && product.variants.length > 0) {
        const variants = selectedVariants[productId] || {};
        Object.entries(variants).forEach(([type, value]) => {
          formData.append(`variants[${type}]`, value);
        });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/add-to-cart`, {
        method: 'POST',
        body: formData,
      });

      // Console log the response
      console.log('Add to cart API response status:', response.status);
      console.log('Add to cart API response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Add to cart API response body:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Add to cart API parsed response:', result);
      } catch (e) {
        console.log('Add to cart API response is not JSON:', responseText);
      }

      if (response.ok) {
        setAddedToCart(prev => ({ ...prev, [productId]: true }));
        // Update order total if needed
        if (result && result.success) {
          // Optionally update the order total display
        }
      } else {
        alert('Ürün sepete eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const finishOrder = async () => {
    setFinishingOrder(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/finish-order`, {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to thank you page
        window.location.href = `/order/${orderId}/tesekkurler`;
      } else {
        alert('Sipariş tamamlanırken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Error finishing order:', error);
      alert('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setFinishingOrder(false);
    }
  };

  const createVariantFields = (product: UpsellProduct) => {
    if (!product.variants || product.variants.length === 0) return null;

    const groupedVariants: {[type: string]: ProductVariant[]} = {};
    product.variants.forEach(variant => {
      if (!groupedVariants[variant.type]) {
        groupedVariants[variant.type] = [];
      }
      groupedVariants[variant.type].push(variant);
    });

    return (
      <div className="variant-selection mb-3">
        <div className="variant-container">
          {Object.entries(groupedVariants).map(([type, options]) => (
            <div key={type} className="variant-item">
              <label className="variant-label">{type} Seçin</label>
              <select
                className={`form-control ${!selectedVariants[product.id]?.[type] && product.variants?.length ? 'is-invalid' : ''}`}
                value={selectedVariants[product.id]?.[type] || ''}
                onChange={(e) => handleVariantChange(product.id, type, e.target.value)}
                required
              >
                <option value="">{type} Seçin</option>
                {options.map((variant, index) => (
                  <option 
                    key={index} 
                    value={variant.name}
                    disabled={variant.stock <= 0}
                  >
                    {variant.name} {variant.stock <= 0 ? '(Tükendi)' : ''}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="flex-fill d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3">Sipariş bilgileri yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-fill d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </main>
    );
  }

  const promotionDiscount = parseInt(process.env.NEXT_PUBLIC_PROMOTION_DISCOUNT_AMOUNT || '0');

  return (
      <main className="flex-fill mt-3 pb-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="order-confirmation-box p-4" style={{backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e0e0e0'}}>
                <h2 style={{fontSize: '1.8em', color: '#0b8123', fontWeight: 'bold', marginBottom: '15px'}}>
                  <i className="fas fa-check-circle mr-2"></i>SİPARİŞİNİZ ALINDI
                </h2>

                <div className="points-box mt-4 p-3" style={{backgroundColor: '#fff8e1', borderRadius: '8px', borderLeft: '4px solid #ffc107'}}>
                  <h4 style={{color: '#ff6a00', fontWeight: 'bold'}}>
                    <i className="fas fa-gift mr-2"></i>Tebrikler! Aşağıdaki ürünleri indirimli fiyatarıyla almaya hak kazandınız
                  </h4>
                  <span className="mb-0" style={{fontSize: '0.9em'}}>
                    *Dilediğiniz ürünü <b>'Sepete Ekle'</b> tuşuna basarak sepetinize ekleyebilirsiniz
                  </span>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="row product-grid-3">
                {products.map((product) => (
                  <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 px-1">
                    <div className="product-cart-wrap mb-30">
                      <div className="product-img-action-wrap">
                        <div className="product-img product-img-zoom">
                          <img 
                            className="default-img"
                            src={product.images[0]?.large || '/placeholder-product.jpg'}
                            alt={product.name}
                            style={{width: '100%', height: 'auto', borderRadius: '10px'}}
                          />
                        </div>
                        <div className="product-badges product-badges-position product-badges-mrg">
                          <span className="hot">İndirimli</span>
                        </div>
                      </div>
                      
                      <div className="product-content-wrap pt-2">
                        <h2 style={{fontSize: '1rem', marginBottom: '10px', fontWeight: '600'}}>
                          {product.name}
                        </h2>
                        
                        <div className="rating-result" title="96%">
                          <span>
                            <span style={{fontSize: '0.9em', color: '#f39c12'}}>
                              {(() => {
                                const rating = 4.5;
                                const stars = [];
                                for (let i = 1; i <= 5; i++) {
                                  
                                  if (rating >= i) {
                                    stars.push(
                                      <svg key={i} className="text-warning" style={{width: '16px', height: '16px'}} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                    );
                                  } else if (rating > i - 1) {
                                    stars.push(
                                      <svg key={i} className="text-warning" style={{width: '16px', height: '16px'}} viewBox="0 0 20 20"><defs><linearGradient id={`half${i}`}><stop offset="50%" stopColor="#f39c12"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path fill={`url(#half${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                    );
                                  } else {
                                    stars.push(
                                      <svg key={i} className="text-muted" style={{width: '16px', height: '16px'}} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                                    );
                                  }
                                }
                                return <span>{stars} {rating.toFixed(1)}</span>;
                              })()}
                            </span>
                          </span>
                        </div>
                        
                        <div className="product-price">
                          <span className="old-price">{product.priceOriginal}.00TL</span>
                          <span style={{color: '#bb0000', fontWeight: '600', fontSize: '1.1rem'}}>
                            {product.priceCurrent - promotionDiscount},00TL
                          </span>
                        </div>
                      </div>
                      
                      <div className="row mb-30 mx-auto px-0">
                        {createVariantFields(product)}
                        
                        <div className="col-12 pr-1">
                          <button 
                            className={`btn w-100 btn-sm ${addedToCart[product.id] ? 'btn-success' : 'btn-primary'}`}
                            style={{
                              background: addedToCart[product.id] 
                                ? 'linear-gradient(180deg, #f27a1a 0%, #ff983f 100%)'
                                : 'linear-gradient(180deg, #f27a1a 0%, #ff983f 100%)',
                              fontWeight: '600',
                              fontSize: '14px',
                              border: '0 solid',
                              borderRadius: '5px',
                              padding: '10px 15px'
                            }}
                            onClick={() => addToCart(product.id)}
                            disabled={addingToCart[product.id] || addedToCart[product.id]}
                            data-product-name={product.settings?.alias || product.name}
                            data-product-id={product.id}
                            data-product-price={product.priceCurrent - promotionDiscount}
                          >
                            {addingToCart[product.id] ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Ekleniyor...
                              </>
                            ) : addedToCart[product.id] ? (
                              <>
                                <i className="fas fa-check mr-2"></i>Sepete Eklendi
                              </>
                            ) : (
                              <>
                                <i className="fas fa-shopping-bag mr-2"></i>Sepete Ekle
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); finishOrder(); }}>
            <button 
              type="submit" 
              className="btn w-100 btn-sm btn-success"
              disabled={finishingOrder}
            >
              {finishingOrder ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Sipariş Tamamlanıyor...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Siparişimi Tamamla
                </>
              )}
            </button>
          </form>
        </div>
      </main>
  );
} 