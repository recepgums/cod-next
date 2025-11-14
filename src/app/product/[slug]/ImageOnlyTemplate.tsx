'use client';

import '../Nova.css';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import Header from '../../components/Header';
import dynamic from 'next/dynamic';

// Lazy load components that are not immediately visible
const Footer = dynamic(() => import('../../components/Footer'), {
  ssr: true,
  loading: () => <div style={{ height: '200px' }} />
});

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

interface ProductImage {
  thumbnail: string;
  medium: string;
  large: string;
  mobile: string;
  original: string;
}

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
  comments: any[];
  cities: any[];
  categories?: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string;
  logoUrl?: string;
  settings?:string;
}

const announcementTexts = [
  '💰 Kapıda Ödeme Seçeneği 💰',
  '❤️ Şeffaf Kargolu ❤️',
  '⭐ +10.000 Mutlu Müşteri ⭐',
];

// Shimmer effect for image loading
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

// Lazy Image Component with Intersection Observer
interface LazyImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  blurDataURL: string;
  onClick?: () => void;
  index: number;
}

function LazyImage({ src, alt, priority = false, quality = 75, blurDataURL, onClick, index }: LazyImageProps) {

  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // 200px önden yüklemeye başla
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  return (
    <div
      ref={imgRef}
      style={{
        width: '100%',
        position: 'relative',
        backgroundColor: '#f6f7f8',
      }}
    >
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          style={{
            width: '100%',
            height: 'auto',
            cursor: 'pointer',
            display: 'block'
          }}
          onClick={onClick}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          placeholder="blur"
          blurDataURL={blurDataURL}
          quality={quality}
          sizes="(max-width: 600px) 100vw, 600px"
          {...(index === 0 && { fetchPriority: 'high' as const })}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            aspectRatio: '4/3',
            background: `url("${blurDataURL}") no-repeat center`,
            backgroundSize: 'cover'
          }}
        />
      )}
    </div>
  );
}

interface ImageOnlyTemplateProps {
  product: Product;
}

export default function ImageOnlyTemplate({ product }: ImageOnlyTemplateProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [variants, setVariants] = useState<any>({});
  const [selectedVariants, setSelectedVariants] = useState<any[]>([]);
  const orderModalRef = useRef<HTMLDivElement>(null);

  // Memoize blur data URL to avoid recreating on every render
  const blurDataURL = useMemo(() => `data:image/svg+xml;base64,${toBase64(shimmer(800, 600))}`, []);
  const parsedSettings = useMemo(() => {
    if (!product?.settings) return {};
    try {
      const raw = typeof product.settings === 'string' ? JSON.parse(product.settings) : product.settings;
      return raw && typeof raw === 'object' ? raw : {};
    } catch (error) {
      console.error('❌ Failed to parse product.settings:', error);
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
        console.log('🎨 ImageOnlyTemplate: Variants grouped:', grouped);
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
      console.log('🛍️ ImageOnlyTemplate: Updated selected variants for quantity:', quantity, newSelectedVariants);
    }
  }, [selectedOption, variants]);

  // Preload first image for better LCP (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && product.images && product.images.length > 0) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';


      link.href = `/_next/image?url=${encodeURIComponent(product.images[0].large)}&w=640&q=90`;
      link.imageSrcset = `/_next/image?url=${encodeURIComponent(product.images[0].large)}&w=640&q=90 640w, /_next/image?url=${encodeURIComponent(product.images[0].large)}&w=750&q=90 750w, /_next/image?url=${encodeURIComponent(product.images[0].large)}&w=828&q=90 828w`;
      link.imageSizes = '(max-width: 600px) 100vw, 600px';


      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [product.images]);

  // Add to Cart eventi gönderme fonksiyonu
  const sendAddToCartEvent = () => {
    try {
      // Facebook Pixel AddToCart Event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_ids: [product.id.toString()],
          content_type: 'product',
          content_name: product.name,
          num_items: selectedOption?.quantity || 1
        });
      }

      // TikTok Pixel AddToCart Event
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.track('AddToCart', {
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_id: product.id.toString(),
          content_type: 'product',
          content_name: product.name,
          quantity: selectedOption?.quantity || 1
        });
      }

      console.log('AddToCart events sent:', {
        facebook: {
          event: 'AddToCart',
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_ids: [product.id.toString()],
          content_name: product.name
        },
        tiktok: {
          event: 'AddToCart',
          value: selectedOption?.price || product.price,
          currency: 'TRY',
          content_id: product.id.toString(),
          content_name: product.name
        }
      });
    } catch (error) {
      console.error('Error sending AddToCart events:', error);
    }
  };


  const openModal = () => {
    setShowModal(true);
    sendAddToCartEvent();
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

  const selectOption = (option: ProductOption) => {
    setSelectedOption(option);
  };

  const handleVariantChange = (index: number, type: string, value: string) => {
    const newSelectedVariants = [...selectedVariants];
    newSelectedVariants[index] = { ...newSelectedVariants[index], [type]: value };
    setSelectedVariants(newSelectedVariants);
    console.log('🔄 ImageOnlyTemplate: variant changed:', { index, type, value, selectedVariants: newSelectedVariants });
  };

  const handleOrderModalVariantChange = (newVariants: any[]) => {
    setSelectedVariants(newVariants);
    console.log('🔄 ImageOnlyTemplate: OrderModal variant change received:', newVariants);
  };

  return (
    <div className="image-only-template" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Header logoSrc={product.logoUrl} categories={product.categories} />
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="scrolling-text">
          {announcementTexts?.map((t, i) => <span key={i}>{t}</span>)}
          {announcementTexts?.map((t, i) => <span key={i + 10}>{t}</span>)}
          {announcementTexts?.map((t, i) => <span key={i + 20}>{t}</span>)}
        </div>
      </div>

      {/* Gallery Container */}
      <div className="gallery-container">
        <div className="header text-center mx-auto d-none">
          <a href="/">
            <Image
              src={product.logoUrl || "/images/logo.png"}
              alt="Logo"
              width={200}
              height={50}
              style={{ height: 50, width: 'auto' }}
              priority
              quality={90}
              sizes="200px"
            />
          </a>
        </div>

        {/* Full-width images stacked vertically with true lazy loading */}
        {product.images && product.images.length > 0 && product.images?.map((img: ProductImage, idx: number) => {
          // Sadece ilk resim hemen yüklensin, yüksek kalitede
          const isPriority = idx === 0;

          return (
            <LazyImage
              key={img.large + idx}
              src={img.large}
              alt={`${product.name} - Görsel ${idx + 1}`}
              priority={isPriority}
              quality={isPriority ? 90 : 75}
              blurDataURL={blurDataURL}
              onClick={openModal}
              index={idx}
            />
          );
        })}

        {/* Direct Order Button */}
          <div className="product-extra-link2 my-3" style={{ width: '100%' }}>
            <button
              type="button"
              className="btn btn-success btn-block bounce w-100"
              onClick={openModal}
            >
              Sipariş Ver - {product.price.toFixed(2)}TL
            </button>
          </div>

      </div>

      {/* Sticky Footer */}
      <StickyFooter
        product={product}
          selectedOption={selectedOption}
          onOrderClick={openModal}
        />

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

      {/* Footer */}
      <Footer />
      {product && product.pixels && (
        <PixelScripts pixels={product.pixels} product={product} />
      )}
    </div>
  );
}