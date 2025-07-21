'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../product-details.css'
import axios from 'axios';
import Footer from '../../components/Footer';

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
}

interface ProductComment {
  id: number;
  author: string;
  content: string;
  rating: number;
  photo?: string;
  order?: number | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  images: string[];
  options: ProductOption[];
  features: string[];
  rating: number;
  commentCount: number;
  comments: ProductComment[];
}


const announcementTexts = [
  '💰 Kapıda Ödeme Seçeneği 💰',
  '❤️ Şeffaf Kargolu ❤️',
  '⭐ +10.000 Mutlu Müşteri ⭐',
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // State for gallery
  const slug = React.use(params).slug;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  

  const [mainImg, setMainImg] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [timer, setTimer] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [deliveryDates, setDeliveryDates] = useState({ start: '', end: '' });
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("");
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

  const commentGridRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    console.log('Slug is:', slug);
    if (!slug) return; // Wait for router to be ready

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`)
      .then(res => {
        console.log(res.data);
        const productData = res.data.product;
        const commentsData = res.data.comments;
        const citiesData = res.data.cities || [];
        
        // Merge comments into product data
        const productWithComments = {
          ...productData,
          comments: commentsData || []
        };
        
        setProduct(productWithComments);
        setCities(citiesData);
        if (productData.options && productData.options.length > 0) {
          setSelectedOption(productData.options[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [slug]);


  // Timer state
  useEffect(() => {
    let countdownEndTime = Math.floor(Date.now() / 1000) + 2 * 60 * 60 + Math.floor(Math.random() * 59 + 1) * 60;
    const updateTimer = () => {
      let now = Math.floor(Date.now() / 1000);
      let timeLeft = countdownEndTime - now;
      if (timeLeft <= 0) {
        const randomMinutes = Math.floor(Math.random() * 59) + 1;
        countdownEndTime = now + (2 * 60 * 60) + (randomMinutes * 60);
        timeLeft = countdownEndTime - now;
      }
      const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');
      setTimer({ hours, minutes, seconds });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate delivery dates
  useEffect(() => {
    const calculateDeliveryDates = () => {
      const now = new Date();
      const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];

      // Calculate start date (3 business days from now)
      let startDate = new Date(now);
      let businessDaysAdded = 0;
      while (businessDaysAdded < 3) {
        startDate.setDate(startDate.getDate() + 1);
        if (startDate.getDay() !== 0 && startDate.getDay() !== 6) { // Skip weekends
          businessDaysAdded++;
        }
      }

      // Calculate end date (5 business days from now)
      let endDate = new Date(now);
      businessDaysAdded = 0;
      while (businessDaysAdded < 5) {
        endDate.setDate(endDate.getDate() + 1);
        if (endDate.getDay() !== 0 && endDate.getDay() !== 6) { // Skip weekends
          businessDaysAdded++;
        }
      }

      const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const dayName = dayNames[date.getDay()];
        return `${day} ${month} ${dayName}`;
      };

      setDeliveryDates({
        start: formatDate(startDate),
        end: formatDate(endDate)
      });
    };

    calculateDeliveryDates();
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]);
      setSelectedDistrict("");
      setSelectedNeighborhood("");
      return;
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cities/${selectedCity}/districts`)
      .then(res => {
        setDistricts(res.data || []);
        setSelectedDistrict("");
        setSelectedNeighborhood("");
      })
      .catch(() => {
        setDistricts([]);
        setSelectedDistrict("");
        setSelectedNeighborhood("");
      });
  }, [selectedCity]);

  // Fetch neighborhoods when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setNeighborhoods([]);
      setSelectedNeighborhood("");
      return;
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/districts/${selectedDistrict}/neighborhoods`)
      .then(res => {
        setNeighborhoods(res.data || []);
        setSelectedNeighborhood("");
      })
      .catch(() => {
        setNeighborhoods([]);
        setSelectedNeighborhood("");
      });
  }, [selectedDistrict]);

  // Gallery scroll
  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = 200;
      const currentScroll = thumbnailRef.current.scrollLeft;
      const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      thumbnailRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const selectOption = (option: any) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    if (commentGridRef.current) {
      import('masonry-layout').then((MasonryModule) => {
        const Masonry = MasonryModule.default;
        new Masonry(commentGridRef.current, {
          itemSelector: '.comment-item',
          columnWidth: '.comment-item',
          percentPosition: true,
          gutter: 16,
        });
      });
    }
  }, [product?.comments]); // re-run when comments change

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="text-center">
          <h4>Ürün bulunamadı</h4>
          <p>Lütfen tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="scrolling-text">
          {announcementTexts.map((t, i) => <span key={i}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 10}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 20}>{t}</span>)}
        </div>
      </div>
      {/* Gallery */}
      <div className="gallery-container mt-1">
        <div className="header text-center mx-auto">
          <a href="/"><img style={{height: 50}} src="/images/logo.png" alt="TrendyGoods" /></a>
              </div>
              <div className="main-image-container">
          <img id="mainImage" src={product.images?.[mainImg] || product.images?.[0]} height={375} alt="product image" loading="lazy" />
              </div>
        <div className="thumbnail-wrapper">
          <span className="arrow" onClick={() => scrollThumbnails('left')}>&#10094;</span>
          <div className="thumbnail-container" ref={thumbnailRef}>
            {product.images?.map((img: string, idx: number) => (
              <img
                key={img + idx}
                        src={img}
                height={100}
                        alt="thumbnail image"
                        onClick={() => setMainImg(idx)}
                style={{cursor: 'pointer'}}
                      />
                    ))}
                  </div>
          <span className="arrow" onClick={() => scrollThumbnails('right')}>&#10095;</span>
        </div>
      </div>
      {/* Flash Sale Bar with Timer */}
      <div className="flash-urunler">
        <div className="flash-header">
          <div className="icon">
            <img src="/images/assets/flash.png" alt="Flash Icon" />
          </div>
          <div className="title-timer">
            <div className="title">Flaş İndirim</div>
            <div className="timer">
              <span>{timer.hours}</span>:<span>{timer.minutes}</span>:<span>{timer.seconds}</span>
            </div>
                </div>
          <div className="sales-info">
            <span>57 adet satıldı</span>
            <div className="progress-bar">
              <div className="progress" />
            </div>
              </div>
                </div>
              </div>

      {/* Product Info Section */}
      <div className="container-fluid mt-4">
        <h2 className="title-detail" style={{marginBottom: 0}}>{product.name}</h2>
        <div className="product-detail-rating d-flex justify-content-between align-items-center mb-3">
          <div className="product-rate-cover text-end d-flex align-items-center">
            <span className="font-small ml-1 text-muted"><strong>{product.rating}</strong></span>
            <div className="star-rating d-inline-block mx-2">
              {[...Array(5)].map((_, starIndex) => (
                <i 
                  key={starIndex}
                  className={`fas fa-star${starIndex < product.rating ? '' : '-o'}`}
                  style={{ 
                    color: starIndex < product.rating ? '#F27A1A' : '#ccc',
                    fontSize: '14px',
                    marginRight: '1px'
                  }}
                />
              ))}
            </div>
            <a className="font-small ml-3 text-muted" href="#comments">( {product.commentCount || 0} değerlendirme)</a>
          </div>
        </div>
        <div className="clearfix product-price-cover my-3">
          <div className="product-price primary-color">
            <span className="text-brand h4">{product.price.toFixed(2)}₺</span>
            <ins><span className="old-price font-md ml-3 text-muted">{product.oldPrice.toFixed(2)}₺</span></ins>
            <span className="save-price font-md ml-3 text-white bg-danger p-1 rounded">{product.discount} indirim</span>
          </div>
        </div>
        {/* Features/Benefits */}
        <div className="short-desc mb-3">
          <div className="emoji-benefits-container">
            {product.features.map((f, i) => (
              <p key={i}><strong>{f}</strong></p>
            ))}
          </div>
        </div>
        {/* Section Title for Options */}
        <div className="section-title">
          <span>ÇOK AL & AZ ÖDE</span>
        </div>
        {/* Product Options */}
        <div>
          {product.options.map((opt, idx) => (
            <div key={opt.quantity} className={`product-option d-flex align-items-center mb-1${idx === 0 ? ' active' : ''}`} data-quantity={opt.quantity}>
              <img src={product.images[0]} width={60} height={60} className="img-fluid" alt="product image" />
              <div className="details">
                <div className="info">
                  <span className="title">
                    {opt.displayText || `${opt.quantity} Adet`}
                    
                    {opt.isCampaign && (
                      <p style={{color: 'red', fontWeight: 'bold', fontSize: '.9rem'}}>
                        {opt.quantity} {opt.unit || 'Adet'} BEDAVA
                      </p>
                    )}
                    
                    <small className="kargo-bedava">Ücretsiz Kargo</small>
                    
                    {opt.original && opt.original > opt.price && (
                      <div className="discount" style={{maxWidth: 115}}>
                        Tanesi {Math.round(opt.price / opt.quantity)}TL
                      </div>
                    )}
                  </span>
                  <span className="price">
                    {opt.price.toFixed(2)}TL
                    <br />
                    {opt.original && opt.original > opt.price && (
                      <div className="original-price">{opt.original.toFixed(2)}TL</div>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
              </div>
            </div>

            <div className="border-top my-3"></div>

      {/* Delivery Info */}
      <div className="delivery-info mb-4">
        <i className="fas fa-shipping-fast"></i>
        Şimdi sipariş verirsen <br />
        <small id="delivery-dates">{deliveryDates.start} - {deliveryDates.end}</small>
        <p>tarihleri arasında siparişin kapında!</p>
      </div>

      {/* Order Buttons */}
      <div className="product-extra-link2 mb-3 w-100">
        <button type="button" className="btn btn-success btn-block w-100 bounce" onClick={openModal}>
          Kapıda Ödemeli Sipariş Ver
        </button>
              </div>
      
      <div className="product-extra-link2 mb-3 w-100">
        <button type="button" className="btn btn-success btn-block w-100 bounce" onClick={openModal}>
          Şimdi Sipariş Ver
        </button>
            </div>

            {/* comments Section Title */}
      <h6 className="section-title style-1 my-30 text-center" id="comments">
        Tüm Değerlendirmeler ({product.commentCount || 0})
      </h6>
              <div className="comment-grid" id="comment-container" ref={commentGridRef}>
          {product.comments?.map((comment, idx) => (
            <div className="comment-item" key={idx}>
              <div className="comment-card">
                {comment.photo && <img src={comment.photo} className="comment-img" alt="Comment Image" />}
                <div className="comment-content">
                  <div>
                    <div className="star-rating mb-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <i 
                          key={starIndex}
                          className={`fas fa-star${starIndex < comment.rating ? '' : '-o'}`}
                          style={{ 
                            color: starIndex < comment.rating ? '#FFD700' : '#ccc',
                            fontSize: '14px',
                            marginRight: '2px'
                          }}
                        />
                      ))}
            </div>
                                      <h6 className="mb-1">{comment.author}</h6>
            </div>
                <small>{comment.content}</small>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center w-100">
              <p>Henüz yorum bulunmuyor.</p>
          </div>
          )}
      </div>
      {/* Continue with comments and modal in next steps */}

      {/* Order Modal */}
      <div className={`modal fade${showModal ? ' show' : ''}`} id="fullScreenModal" tabIndex={-1} role="dialog" aria-labelledby="fullScreenModalLabel" aria-hidden="true" style={{display: showModal ? 'block' : 'none'}}>
        <div className="modal-dialog modal-dialog-centered modal-fullscreen" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center" id="fullScreenModalLabel">Sipariş Formu</h5>
              <button type="button" className="close" onClick={closeModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{overflow: 'scroll'}}>
              <form method="post" className="order-form" id="order-form">
                <input type="hidden" name="ref_url" id="ref_url" />
                <input type="hidden" name="quantity" id="quantity" value={selectedOption?.quantity || 1} />
                <input type="hidden" name="total_price" id="total_price" value={selectedOption?.price.toFixed(2) || product.price.toFixed(2)} />
                <input type="hidden" name="products" value={product.name} />
                <input type="hidden" name="product_id" value={product.id} />
                <div>
                  {/* Product Options in Modal */}
                  {product.options.map((opt, idx) => (
                    <div key={opt.quantity} className={`product-option d-flex align-items-center mb-1${opt.quantity === selectedOption?.quantity ? ' active' : ''}`} data-quantity={opt.quantity} onClick={() => selectOption(opt)}>
                      <img src={product.images[0]} width={60} height={60} className="img-fluid" alt="product image" />
                      <div className="details">
                        <div className="info">
                          <span className="title">
                            {opt.displayText || `${opt.quantity} Adet`}
                            
                            {opt.isCampaign && (
                              <p style={{color: 'red', fontWeight: 'bold', fontSize: '.9rem'}}>
                                {opt.quantity} {opt.unit || 'Adet'} BEDAVA
                              </p>
                            )}
                            
                            <small className="kargo-bedava">Ücretsiz Kargo</small>
                            
                            {opt.discount > 0 && (
                              <div className="discount" style={{maxWidth: 115}}>
                                Tanesi {Math.round(opt.price / opt.quantity)}TL
                              </div>
                            )}
                          </span>
                          <span className="price">
                            {opt.price.toFixed(2)}TL
                            <br />
                            {opt.original && opt.original > opt.price && (
                              <div className="original-price">{opt.original.toFixed(2)}TL</div>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Total Section */}
                  <div className="total-section mb-1">
                    <div className="row justify-content-between">
                      <div className="col-6 label">Ara Toplam</div>
                      <div className="col-6 value text-right">{selectedOption?.price.toFixed(2) || product.price.toFixed(2)}TL</div>
                    </div>
                    <div className="row justify-content-between">
                      <div className="col-6 label">Kargo</div>
                      <div className="col-6 value text-right" id="shipping-cost">Ücretsiz</div>
                    </div>
                    <div className="row justify-content-between" id="discounts" style={{display: 'none'}}>
                      <div className="col-6 label">İndirimler</div>
                      <div className="col-6 discount text-right" id="discount_amount"></div>
                    </div>
                    <div className="row justify-content-between total-row mt-2 pt-2 border-top">
                      <div className="col-6 label">Toplam</div>
                      <div className="col-6 total text-right" id="total-price">{selectedOption?.price.toFixed(2) || product.price.toFixed(2)}TL</div>
                    </div>
                  </div>
                  {/* Shipping Section */}
                  <div className="shipping-section mb-3">
                    <div className="form-check active">
                      <label className="form-check-label">
                        <input type="radio" className="form-check-input" value="nakit" name="paymentType" data-additional-cost=".00TL" defaultChecked />
                        <span>Kapıda Nakit Ödeme</span>
                        <span>Ücretsiz</span>
                      </label>
            </div>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input type="radio" className="form-check-input" value="kart" name="paymentType" data-additional-cost="19.00" />
                        <span>Kapıda Kartlı Ödeme</span>
                        <span>19.00TL</span>
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
                      <input name="phone" autoComplete="off" required type="tel" className="form-control" id="phoneInput" placeholder="05XXXXXXXXX" />
              </div>
                    <div className="invalid-feedback" id="phoneError"></div>
              </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-map-marker"></i></span>
                      <select required name="city_id" className="form-control" id="citySelect" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
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
                      <select required name="district_id" className="form-control" id="districtSelect" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
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
                      <select name="neighborhood_id" className="form-control" id="neighborhoodSelect" value={selectedNeighborhood} onChange={e => setSelectedNeighborhood(e.target.value)}>
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
                    <button type="submit" className="btn btn-success btn-block complete-order">
                      SİPARİŞİ TAMAMLAYIN - {selectedOption?.price.toFixed(2) || product.price.toFixed(2)}TL
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    Lütfen teslim almayacağınız siparişleri VERMEYİN!
              </div>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>

            {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className="product-price">
            <span className="original-price">{product.oldPrice.toFixed(2)}TL</span>
            <span className="text-danger" style={{fontWeight: 'bolder', fontSize: '1.1rem'}}>{selectedOption?.price.toFixed(2) || product.price.toFixed(2)}TL</span>
          </div>
        </div>
        <button className="add-to-cart-btn" onClick={openModal}>Sipariş Ver</button>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 