'use client';

import '../Nova.css';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import '../product-details.css'
import Footer from '../../components/Footer';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
import CommentsSection from './components/CommentsSection';
import Header from '@/app/components/Header';
import { faR } from '@fortawesome/free-solid-svg-icons';

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

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

interface ProductComment {
  id: number;
  author: string;
  content: string;
  rating: number;
  photo?: string;
  order?: number | null;
}

interface ProductImage {
  thumbnail: string;
  medium: string;
  large: string;
  mobile: string;
  original: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  images: ProductImage[];
  options: ProductOption[];
  features: string[];
  rating: number;
  commentCount: number;
  comments: ProductComment[];
  cities: any[];
  categories: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string;
  logoUrl?: string;
  content?: string;
  settings?: string;
  merchant_phone?: string;
  is_whatsapp_homepage?: string;
}

interface ReviewTemplateProps {
  product: Product;
}

const announcementTexts = [
  '💰 Kapıda Ödeme Seçeneği 💰',
  '❤️ Şeffaf Kargolu ❤️',
  '⭐ +10.000 Mutlu Müşteri ⭐',
];

export default function ReviewTemplate({ product }: ReviewTemplateProps) {
  const [mainImg, setMainImg] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [timer, setTimer] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [deliveryDates, setDeliveryDates] = useState({ start: '', end: '' });
  const [variants, setVariants] = useState<any>({});
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);
  const commentGridRef = useRef<HTMLDivElement>(null);
  const orderModalRef = useRef<HTMLDivElement>(null);

  // Memoize product content to prevent unnecessary re-renders
  const memoizedProductContent = useMemo(() => {
    return product.content ? { __html: product.content } : null;
  }, [product.content]);

  // Settings'i parse et
  const parsedSettings = useMemo(() => {
    try {
      const settings = product?.settings;
      const parsed = settings && typeof settings === 'string' ? JSON.parse(settings) : settings;
      return parsed || {};
    } catch (error) {
      console.error('❌ Error parsing settings:', error);
      return {};
    }
  }, [product?.settings]);

  let is_modal = useMemo(() => {
    const modal_type = typeof (parsedSettings as any)?.modal_type === 'string'
      ? String((parsedSettings as any).modal_type).toLowerCase()
      : undefined;
    if (modal_type === 'bottom') {
      return false;
    }
    return true;
  }, [parsedSettings]);


  const openModal = () => {
    setShowModal(true);
    // If is_modal is false, scroll to OrderModal after state update
    if (!is_modal) {
      setTimeout(() => {
        if (orderModalRef.current) {
          orderModalRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const selectOption = (option: any) => {
    setSelectedOption(option);
  };

  const handleVariantChange = (index: number, type: string, value: string) => {
    const newSelectedVariants = [...selectedVariants];
    newSelectedVariants[index] = { ...newSelectedVariants[index], [type]: value };
    setSelectedVariants(newSelectedVariants);
  };

  const handleOrderModalVariantChange = (newVariants: any[]) => {
    setSelectedVariants(newVariants);
  };

  const randomCounts = () => {
    const dateString = localStorage.getItem('date');
    const dateObject = JSON.parse(dateString);
    if (dateString) {
      const date = new Date(JSON.parse(dateString).date);
      const now = new Date();
      const fark = now.getHours() - date.getHours();
      if (fark > 0) {
        const percentage = randomNumber(1, 100);
        let son24saat: number, sevilen: number, sepetinde: number;
        if (percentage < 70) {
          son24saat = Number(dateObject.son24saat.split(",")[1].split("B")[0]) + 1;
          sevilen = Number(dateObject.sevilen.split(",")[1].split("B")[0]) + 1;
          sepetinde = Number(dateObject.sepetinde.split(",")[1].split("B")[0]) + 1;
        }
        else {
          son24saat = Number(dateObject.son24saat.split(",")[1].split("B")[0]) - 1;
          sevilen = Number(dateObject.sevilen.split(",")[1].split("B")[0]) - 1;
          sepetinde = Number(dateObject.sepetinde.split(",")[1].split("B")[0]) - 1;
        }
        localStorage.setItem('date', JSON.stringify({
          date: new Date().toISOString(),
          son24saat: "1," + son24saat + "B",
          sevilen: "9," + sevilen + "B",
          sepetinde: "1," + sepetinde + "B"
        }));
        return {
          son24saat: dateObject.son24saat,
          sevilen: dateObject.sevilen,
          sepetinde: dateObject.sepetinde
        }
      }

      else {
        return {
          son24saat: dateObject.son24saat,
          sevilen: dateObject.sevilen,
          sepetinde: dateObject.sepetinde
        }
      }
    }

    else {
      localStorage.setItem('date', JSON.stringify({ date: new Date().toISOString(), son24saat: "1,7B", sevilen: "9,6B", sepetinde: "1,4B" }));
      return {
        son24saat: "1,7B",
        sevilen: "9,6B",
        sepetinde: "1,4B"
      }
    }

  }

  const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Timer state - optimized to prevent unnecessary re-renders
  useEffect(() => {

    randomCounts();

    let countdownEndTime = Math.floor(Date.now() / 1000) + 2 * 60 * 60 + Math.floor(Math.random() * 59 + 1) * 60;
    let intervalId: NodeJS.Timeout;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      let timeLeft = countdownEndTime - now;

      if (timeLeft <= 0) {
        const randomMinutes = Math.floor(Math.random() * 59) + 1;
        countdownEndTime = now + (2 * 60 * 60) + (randomMinutes * 60);
        timeLeft = countdownEndTime - now;
      }

      const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');

      // Only update state if values actually changed
      setTimer(prev => {
        if (prev.hours !== hours || prev.minutes !== minutes || prev.seconds !== seconds) {
          return { hours, minutes, seconds };
        }
        return prev;
      });
    };

    updateTimer();
    intervalId = setInterval(updateTimer, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Calculate delivery dates
  useEffect(() => {
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const today = new Date();

    // Function to calculate delivery dates, skipping Sunday
    function calculateDeliveryDate(startDate: Date, offsetDays: number) {
      let deliveryDate = new Date(startDate);
      let addedDays = 0;
      while (addedDays < offsetDays) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        if (deliveryDate.getDay() !== 0) { // Skip Sundays
          addedDays++;
        }
      }
      return deliveryDate;
    }

    // Calculate the dates
    const firstDeliveryDate = calculateDeliveryDate(today, 1);
    const lastDeliveryDate = calculateDeliveryDate(today, 3);

    // Format the dates
    const firstDate = `${firstDeliveryDate.getDate()} ${monthNames[firstDeliveryDate.getMonth()]} ${dayNames[firstDeliveryDate.getDay()]}`;
    const lastDate = `${lastDeliveryDate.getDate()} ${monthNames[lastDeliveryDate.getMonth()]} ${dayNames[lastDeliveryDate.getDay()]}`;

    setDeliveryDates({
      start: firstDate,
      end: lastDate
    });

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

  // Scrolling text animation control
  useEffect(() => {
    const scrollingText = document.querySelector('.scrolling-text') as HTMLElement;
    if (scrollingText) {
      const handleMouseOver = () => {
        scrollingText.style.animationPlayState = 'paused';
      };

      const handleMouseOut = () => {
        scrollingText.style.animationPlayState = 'running';
      };

      scrollingText.addEventListener('mouseover', handleMouseOver);
      scrollingText.addEventListener('mouseout', handleMouseOut);

      return () => {
        scrollingText.removeEventListener('mouseover', handleMouseOver);
        scrollingText.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, []);

  useEffect(() => {
    if (!commentGridRef.current || !product?.comments?.length) return;

    const init = () => {
      const MasonryCtor = (window as any).Masonry;
      if (MasonryCtor && commentGridRef.current) {
        new MasonryCtor(commentGridRef.current, {
          itemSelector: '.comment-item',
          columnWidth: '.comment-item',
          percentPosition: true,
          gutter: 16,
        });
      }
    };

    if ((window as any).Masonry) {
      init();
      return;
    }

    const timer = setTimeout(() => {
      if ((window as any).Masonry) {
        init();
      } else {
        const checkMasonry = setInterval(() => {
          if ((window as any).Masonry) {
            clearInterval(checkMasonry);
            init();
          }
        }, 50);

        setTimeout(() => clearInterval(checkMasonry), 10000);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [product?.comments]);

  // Variants'ları parse et
  useEffect(() => {
    if (!parsedSettings?.variants) return;
    try {
      let rawVariants = parsedSettings.variants;

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
        const grouped: Record<string, { title: string; options: string[]; stock: Record<string, string> }> = {};
        rawVariants.forEach((v: any) => {
          const typeKey = (v?.type || 'Seçenek').toString();
          const optionName = (v?.name || '').toString();
          const stockValue = (v?.stock || '0').toString();
          if (!grouped[typeKey]) {
            grouped[typeKey] = { title: typeKey, options: [], stock: {} };
          }
          if (optionName && !grouped[typeKey].options.includes(optionName)) {
            grouped[typeKey].options.push(optionName);
            grouped[typeKey].stock[optionName] = stockValue;
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
      console.error('❌ Error parsing variants:', error);
    }
  }, [parsedSettings?.variants]);

  // Update variant fields when quantity changes
  useEffect(() => {
    if (selectedOption && Object.keys(variants).length > 0) {
      const quantity = selectedOption.quantity;
      const newSelectedVariants = Array(quantity).fill(null)?.map(() => ({}));
      setSelectedVariants(newSelectedVariants);
    }
  }, [selectedOption, variants]);

  // Auto-select first option
  useEffect(() => {
    if (product.options && product.options.length > 0) {
      setSelectedOption(product.options[0]);
    }
  }, [product.options]);

  useEffect(() => {
    const previousTitle = document.title;
    if (product?.name) {
      document.title = product.name;
    }
    return () => {
      document.title = previousTitle;
    };
  }, [product?.name]);

  // Social proof animation - optimized with CSS to prevent re-renders
  useEffect(() => {
    const socialProofElement = document.querySelector('.social-proof-social-proof') as HTMLElement;
    if (socialProofElement) {
      socialProofElement.style.animation = 'socialProofSlide 12s infinite';
    }
  }, []);

  return (
    <div className="product-details-container">
      <Header logoSrc={product.logoUrl} categories={product.categories || []} />
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="scrolling-text">
          {announcementTexts.map((t, i) => <span key={i}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 10}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 20}>{t}</span>)}
        </div>
      </div>
      {/* Gallery */}
      <div className="gallery-container">
        <div className="header text-center mx-auto d-none">
          <a href="/"><img style={{ height: 50 }} src={product.logoUrl || "/images/logo.png"} alt="Logo" /></a>
        </div>
        <div className="main-image-container">
          <img id="mainImage" src={product.images && product.images.length > 0 ? (product.images[mainImg]?.large || product.images[0]?.large) : '/images/default-product.png'} height={400} alt="product image" loading="lazy" />
        </div>
        <div className="thumbnail-wrapper">
          <span className="arrow" onClick={() => scrollThumbnails('left')}>&#10094;</span>
          <div className="thumbnail-container" ref={thumbnailRef}>
            {product.images && product.images.length > 0 && product.images.map((img: ProductImage, idx: number) => (
              <img
                key={img.medium + idx}
                src={product.images[idx]?.thumbnail}
                height={100}
                alt="thumbnail image"
                onClick={() => setMainImg(idx)}
                style={{ cursor: 'pointer' }}
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
        <h2 className="title-detail" style={{ marginBottom: 0 }}>{product.name}</h2>
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
        <div>
          <section className="social-proof-social-proof-wrapper">
            <div className="social-proof-social-proof">
              <div className="social-proof-item-social-proof-item">
                <img alt="basket-count" height="16"
                  src="https://cdn.dsmcdn.com/mnresize/30/30/mobile/pdp/Additional/basket3.png" width="16"
                  data-testid="image" />
                <p className="social-proof-content"><span className="social-proof-item-focused-text">{randomCounts().sepetinde} kişinin</span> sepetinde,
                  tükenmeden al!</p>
              </div>
              <div className="social-proof-item-social-proof-item">
                <img alt="favorite-count" height="16"
                  src="https://cdn.dsmcdn.com/mnresize/30/30/mobile/pdp/Additional/orange-heart_1f9e1.png" width="16"
                  data-testid="image" />
                <p className="social-proof-content">Sevilen ürün! <span className="social-proof-item-focused-text">{randomCounts().sevilen}</span> kişi
                  favoriledi!</p>
              </div>
              <div className="social-proof-item-social-proof-item">
                <img alt="page-view-count" height="16"
                  src="https://cdn.dsmcdn.com/mnresize/30/30/mobile/pdp/Additional/view3.png" width="16"
                  data-testid="image" />
                <p className="social-proof-content">Son 24 saatte <span
                  className="social-proof-item-focused-text">{randomCounts().son24saat} kişi</span> görüntüledi!</p>
              </div>
              <div className="social-proof-item-social-proof-item">
                <img alt="basket-count" height="16"
                  src="https://cdn.dsmcdn.com/mnresize/30/30/mobile/pdp/Additional/basket3.png" width="16"
                  data-testid="image" />
                <p className="social-proof-content"><span className="social-proof-item-focused-text">{randomCounts().sepetinde} kişinin</span> sepetinde,
                  tükenmeden al!</p>
              </div>
            </div>
          </section>
        </div>

        <div className="clearfix product-price-cover my-3">
          <div className="product-price primary-color">
            <span className="text-brand h4">{product.price?.toFixed(2)}₺</span>
            <ins><span className="old-price font-md ml-3 text-muted">{product.oldPrice.toFixed(2)}₺</span></ins>
            <span className="save-price font-md ml-3 text-white bg-danger p-1 rounded">{product.discount}</span>
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
          {product.options?.map((opt, idx) => (
            <div
              key={opt.quantity}
              className={`product-option d-flex align-items-center mb-1${selectedOption?.quantity === opt.quantity ? ' active' : ''}`}
              data-quantity={opt.quantity}
              onClick={() => selectOption(opt)}
            >
              <Image
                src={product.images[0]?.medium || '/images/default-product.png'}
                width={60}
                height={60}
                className="img-fluid"
                alt="product image"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
              <div className="details">
                <div className="info">
                  <span className="title">
                    {opt.title || `${opt.quantity} Adet`}

                    {opt.isCampaign && (
                      <p style={{ color: 'red', fontWeight: 'bold', fontSize: '.9rem' }}>
                        {opt.quantity} {opt.unit || 'Adet'} BEDAVA
                      </p>
                    )}

                    <small className="kargo-bedava mx-2">Ücretsiz Kargo</small>
                    {opt.discount > 0 && (
                      <div className="discount" style={{ maxWidth: "max-content" }}>
                        Tanesi {Math.ceil((opt.price - opt.discount) / opt.quantity)}TL
                      </div>
                    )}
                  </span>
                  <span className="price">
                    {(opt.price - opt.discount).toFixed(2)}TL
                    <br />
                    {opt.discount > 0 && (
                      <div className="original-price">{opt.price.toFixed(2)}TL</div>
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

      
        <div className="product-extra-link2 mb-3 w-100">
          <button type="button" className="btn btn-success btn-block w-100 bounce" onClick={openModal}>
            Kapıda Ödemeli Sipariş Ver
          </button>
        </div>

      {/* Product Content */}
      {memoizedProductContent && (
        <div className="container product-content mb-3" dangerouslySetInnerHTML={memoizedProductContent} />
      )}

        <div className="product-extra-link2 mb-3 w-100">
          <button type="button" className="btn btn-success btn-block w-100 bounce" onClick={openModal}>
            Şimdi Sipariş Ver
          </button>
        </div>
      

      <CommentsSection comments={product.comments || []} count={product.commentCount || 0} commentGridRef={commentGridRef} />

      {/* Order Modal */}
      <div ref={orderModalRef}>
        <OrderModal
          showModal={showModal}
          onClose={closeModal}
          product={{
            ...product,
            cities: product.cities,
            is_modal: is_modal,
          }}
          selectedOption={selectedOption}
          onOptionSelect={selectOption}
          selectedVariants={selectedVariants}
          onVariantChange={handleOrderModalVariantChange}
        />
      </div>

      {product?.is_whatsapp_homepage === "on" && (
      <div className="whatsapp-icon-container">
        <a
          href={`https://wa.me/${product.merchant_phone}?text=Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-icon"
          title="WhatsApp ile iletişime geç"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z" />
          </svg>
        </a>
      </div>
      )}
      
        <div className="sticky-footer">
          <div className="product-info">
            <div className="product-name">{product.name}</div>
            <div className="product-price">
              <span className="original-price">{product.oldPrice.toFixed(2)}TL</span>
              <span className="text-danger" style={{ fontWeight: 'bolder', fontSize: '1.1rem' }}>{product.price.toFixed(2)}TL</span>
            </div>
          </div>
          <button className="add-to-cart-btn" onClick={openModal}>Sipariş Ver</button>
        </div>
     


      {/* Footer */}
      <Footer />
      {product && product.pixels && (
        <PixelScripts pixels={product.pixels} product={product} />
      )}
    </div>
  );
}
