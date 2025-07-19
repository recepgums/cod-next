'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '../custom.css'

// --- DATA OBJECTS ---
const product = {
  id: 1,
  name: 'MagnoGlow Lamba',
  price: 499,
  oldPrice: 700,
  discount: '29%',
  images: [
    'https://trendygoods.com.tr/storage/1/1.webp',
    'https://trendygoods.com.tr/storage/13/amzn.jpg',
    'https://trendygoods.com.tr/storage/14/usage.gif',
    'https://trendygoods.com.tr/storage/10/6.webp',
    'https://trendygoods.com.tr/storage/11/7.webp',
    'https://trendygoods.com.tr/storage/9/5.webp',
    '/storage/3/1_org_zoom-(2).webp',
    '/storage/6/2.webp',
    '/storage/7/3.webp',
    '/storage/2/1_org_zoom-(1).webp',
    '/storage/8/4.webp',
  ],
  options: [
    { quantity: 1, price: 499, original: 499, discount: 0, badge: 'Ücretsiz Kargo' },
    { quantity: 2, price: 699, original: 998, discount: 299, badge: 'Tanesi 350TL' },
    { quantity: 3, price: 899, original: 1497, discount: 598, badge: 'Tanesi 300TL' },
  ],
  features: [
    '💡 Üç Farklı Işık Rengi',
    '🔋 Kablosuz ve Şarj Edilebilir',
    '🧲 Her yere kolayca yapışır',
    '🏠 Kolay Kurulum ve Taşınabilir',
    '🔌 USB ile Hızlı Şarj',
    '📏 30 cm uzunluğunda',
    '📦 Hızlı Teslimat ve Kapıda Ödeme',
  ],
  rating: 4.8,
  reviewCount: 9,
  reviews: [
    { name: 'Zeynep B.', rating: 5, text: 'Ürünü gece 1 gibi sipariş ettim 13 saat sonra elime ulaştı. Çok sağlam bir şekilde paketlenmişti. Çok kaliteli, çocukların ilgisini çeken bir ürün', img: '/assets/imgs/products/miknatisli-lamba/reviews/8.webp' },
    { name: '***** *', rating: 5, text: 'Hafif bir ürün. Yapıştırması çok kolay. Işığı yeterli geldi bize. Şarjı 5 saat kadar gidiyor parlaklığını ayarlayabiliyorsunuz Sarı ve beyaz ışıklı fotoğraflarını ekledim. Biz memnun kaldık, teşekkür ederiz.', img: '/assets/imgs/products/miknatisli-lamba/reviews/1.webp' },
    { name: 'Şevval T.', rating: 5, text: 'Çok pratik kesinlikle tavsiye ediyorum kızımın masasına aldım.Şarjı da çok iyi bir kaç kademesi var.göz yormuyor çok faydalı.kutudan usb şarj kablosu çıkıyor.Biz çok sevdik.Pişman olmazsınız.', img: '/assets/imgs/products/miknatisli-lamba/reviews/6.webp' },
    { name: 'Bahri K.', rating: 5, text: 'Ürün çok iyi kaliteli düşünmeden alabilirsiniz çift taraflı yapışkanı var 30cm civarı gerek ışık kalitesi gerek görüntüsü ışık modları beyaz,sarı,beyaz-sarı ve Çakar şeklinde yanıp sönen beyaz sarı ışık hepsinin aydınlatması çok güzel asla pişman etmez', img: '/assets/imgs/products/miknatisli-lamba/reviews/9.webp' },
    { name: 'Ayşegül T. Ü.', rating: 4, text: 'çok beğendim tam yerini buldu', img: '/assets/imgs/products/miknatisli-lamba/reviews/7.webp' },
    { name: 'hilal ö.', rating: 4, text: 'Mutfağa çok iyi oldu. Çok beğendik. 3 tane daha sipariş vereceğim.', img: '/assets/imgs/products/miknatisli-lamba/reviews/3.webp' },
    { name: 'F** A**', rating: 5, text: 'alıp tekrar sipariş verdim çok güzel bir ürün', img: '/assets/imgs/products/miknatisli-lamba/reviews/8.webp' },
    { name: 'Ş** K**', rating: 5, text: 'Makyaj aynama taktım , artık rahatlıkla makyaj yapabiliyorum 🧡💓💗', img: '/assets/imgs/products/miknatisli-lamba/reviews/8.webp' },
    { name: 'S** K**', rating: 5, text: 'çok memnun kaldım. Çok yeterli ışik veriyor tavsiye ederim', img: '/assets/imgs/products/miknatisli-lamba/reviews/8.webp' },
  ],
};

const announcementTexts = [
  '💰 Kapıda Ödeme Seçeneği 💰',
  '❤️ Şeffaf Kargolu ❤️',
  '⭐ +10.000 Mutlu Müşteri ⭐',
];

export default function ProductDetailPage() {
  // State for gallery
  const [mainImg, setMainImg] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [timer, setTimer] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(product.options[0]);
  const [deliveryDates, setDeliveryDates] = useState({ start: '', end: '' });



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
          <img id="mainImage" src={product.images[mainImg]} height={375} alt="product image" loading="lazy" />
              </div>
        <div className="thumbnail-wrapper">
          <span className="arrow" onClick={() => scrollThumbnails('left')}>&#10094;</span>
          <div className="thumbnail-container" ref={thumbnailRef}>
            {product.images.map((img, idx) => (
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
            <a className="font-small ml-3 text-muted" href="#reviews">( {product.reviewCount} değerlendirme)</a>
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
                    {opt.quantity} Adet <small className="kargo-bedava">{opt.badge}</small>
                    {opt.discount > 0 && <div className="discount" style={{maxWidth: 115}}>{opt.badge}</div>}
                  </span>
                  <span className="price">
                    {opt.price.toFixed(2)}TL
                    <br />
                    {opt.discount > 0 && <div className="original-price">{opt.original.toFixed(2)}TL</div>}
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

            {/* Reviews Section Title */}
      <h6 className="section-title style-1 my-30 text-center" id="reviews">
        Tüm Değerlendirmeler ({product.reviewCount})
      </h6>
      <div className="comment-grid" id="comment-container">
        {product.reviews.map((review, idx) => (
          <div className="comment-item" key={idx}>
            <div className="comment-card">
              {review.img && <img src={review.img} className="comment-img" alt="Comment Image" />}
              <div className="comment-content">
                <div>
                  <div className="star-rating mb-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <i 
                        key={starIndex}
                        className={`fas fa-star${starIndex < review.rating ? '' : '-o'}`}
                        style={{ 
                          color: starIndex < review.rating ? '#FFD700' : '#ccc',
                          fontSize: '14px',
                          marginRight: '2px'
                        }}
                      />
                    ))}
            </div>
                  <h6 className="mb-1">{review.name}</h6>
            </div>
                <small>{review.text}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Continue with reviews and modal in next steps */}

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
                <input type="hidden" name="quantity" id="quantity" value={selectedOption.quantity} />
                <input type="hidden" name="total_price" id="total_price" value={selectedOption.price.toFixed(2)} />
                <input type="hidden" name="products" value={product.name} />
                <input type="hidden" name="product_id" value={product.id} />
                <div>
                  {/* Product Options in Modal */}
                  {product.options.map((opt, idx) => (
                    <div key={opt.quantity} className={`product-option d-flex align-items-center mb-1${opt.quantity === selectedOption.quantity ? ' active' : ''}`} data-quantity={opt.quantity} onClick={() => selectOption(opt)}>
                      <img src={product.images[0]} width={60} height={60} className="img-fluid" alt="product image" />
                      <div className="details">
                        <div className="info">
                          <span className="title">
                            {opt.quantity} Adet
                            <small className="kargo-bedava">Ücretsiz Kargo</small>
                            {opt.discount > 0 && <div className="discount" style={{maxWidth: 115}}>{opt.badge}</div>}
                          </span>
                          <span className="price">
                            {opt.price.toFixed(2)}TL
                            <br />
                            {opt.discount > 0 && <div className="original-price">{opt.original.toFixed(2)}TL</div>}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Total Section */}
                  <div className="total-section mb-1">
                    <div className="row justify-content-between">
                      <div className="col-6 label">Ara Toplam</div>
                      <div className="col-6 value text-right">{selectedOption.price.toFixed(2)}TL</div>
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
                      <div className="col-6 total text-right" id="total-price">{selectedOption.price.toFixed(2)}TL</div>
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
                      <select required name="city_id" className="form-control" id="citySelect">
                  <option value="">İl Seçiniz</option>
                        <option value="34">İSTANBUL</option>
                        <option value="6">ANKARA</option>
                        <option value="35">İZMİR</option>
                </select>
                    </div>
              </div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-map-marker"></i></span>
                      <select required name="district_id" className="form-control" id="districtSelect">
                  <option value="">İlçe Seçiniz</option>
                </select>
                    </div>
              </div>
                  <div className="mb-1">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-map-marker"></i></span>
                      <select name="neighborhood_id" className="form-control" id="neighborhoodSelect">
                  <option value="">Mahalle Seçiniz</option>
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
                      SİPARİŞİ TAMAMLAYIN - {selectedOption.price.toFixed(2)}TL
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
            <span className="text-danger" style={{fontWeight: 'bolder', fontSize: '1.1rem'}}>{selectedOption.price.toFixed(2)}TL</span>
          </div>
        </div>
        <button className="add-to-cart-btn" onClick={openModal}>Sipariş Ver</button>
      </div>
    </div>
  );
} 