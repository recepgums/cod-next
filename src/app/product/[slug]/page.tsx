'use client';

import React, { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductGrid from '../../components/ProductGrid';
import ProductCard from '../../components/ProductCard';
import BuyMoreOptions from '../../components/BuyMoreOptions';
import ReviewCard from '../../components/ReviewCard';
import ReviewGrid from '../../components/ReviewGrid';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Dummy product data (to be replaced with real data source)
const products = [
  {
    slug: 'miknatisli-lamba',
    name: 'MagnoGlow Lamba',
    images: [
      '/images/1.webp',
      '/images/1.webp',
      '/images/1.webp',
      '/images/1.webp',
      '/images/1.webp',
      '/images/1.webp',
      '/images/1.webp',
      '/images/1.webp',
    ],
    rating: 4.8,
    reviewCount: 9,
    price: '499.00₺',
    oldPrice: '700.00₺',
    discount: '29%',
    sold: 43,
    features: [
      '💡 Üç Farklı Işık Rengi',
      '🔋 Kablosuz ve Şarj Edilebilir',
      '🧲 Her yere kolayca yapışır',
      '🏠 Kolay Kurulum ve Taşınabilir',
      '🔌 USB ile Hızlı Şarj',
      '📏 30 cm uzunluğunda',
      '📦 Hızlı Teslimat ve Kapıda Ödeme',
    ],
    reviews: [
      { name: 'Zeynep B.', comment: 'Ürünü gece 1 gibi sipariş ettim 13 saat sonra elime ulaştı. Çok sağlam bir şekilde paketlenmişti. Çok kaliteli, çocukların ilgisini çeken bir ürün', image: '/images/reviews/1.webp' },
      { name: 'Şevval T.', comment: 'Çok pratik kesinlikle tavsiye ediyorum kızımın masasına aldım.Şarjı da çok iyi bir kaç kademesi var.göz yormuyor çok faydalı.kutudan usb şarj kablosu çıkıyor.Biz çok sevdik.Pişman olmazsınız.', image: '/images/reviews/2.webp' },
      { name: 'Ahmet K.', comment: 'Hafif bir ürün. Yapıştırması çok kolay. Işığı yeterli geldi bize. Şarjı 5 saat kadar gidiyor parlaklığını ayarlayabiliyorsunuz. Sarı ve beyaz ışık fotoğraflarını ekledim. Biz memnun kaldık, teşekkür ederiz.', image: '/images/reviews/3.webp' },
      { name: 'Elif Y.', comment: 'Kızımın çalışma masası için aldık, çok beğendi. Kurulumu çok kolaydı ve ışığı göz yormuyor. Tavsiye ederim.', image: '/images/reviews/4.webp' },
      { name: 'Murat D.', comment: 'Ürün beklediğimden hızlı geldi. Paketleme çok iyiydi. Işık seviyesi gayet yeterli. Fiyat performans ürünü.', image: '/images/reviews/5.webp' },
      { name: 'Emre T.', comment: 'Ürün anlatıldığı gibi, kurulumu çok kolay. Işık seçenekleri çok kullanışlı. Memnun kaldık.' },
      { name: 'Fatma Z.', comment: 'Çalışma masam için aldım, çok memnunum. Göz yormayan ışığı var. Tavsiye ederim.' },
      { name: 'Selim P.', comment: 'Siparişim hızlıca elime ulaştı. Ürün kaliteli ve kullanışlı. Fiyatı da uygun.' },
    ],
  },
  // ... other products ...
];

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<svg key={i} className="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>);
    } else if (rating > i - 1) {
      stars.push(<svg key={i} className="w-4 h-4 text-yellow-400 inline" viewBox="0 0 20 20"><defs><linearGradient id={`half${i}`}><stop offset="50%" stopColor="#facc15"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path fill={`url(#half${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>);
    } else {
      stars.push(<svg key={i} className="w-4 h-4 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>);
    }
  }
  return <span>{stars}</span>;
}

const marqueeText = [
  <span key="1" className="text-yellow-400">💰 Kapıda Ödeme Seçeneği</span>,
  <span key="2" className="text-red-400">❤️ Şeffaf Kargolu ❤️</span>,
  <span key="3" className="text-yellow-400">⭐ +10.000 Mutlu Müşteri ⭐</span>,
];

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find(p => p.slug === slug);
  if (!product) return notFound();

  const [mainImg, setMainImg] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  function scrollThumbnails(dir: number) {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: dir * 100, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-[600px] mx-auto flex flex-col min-h-screen">
        {/* Top Info Bar with marquee */}
        <div className="w-full bg-black text-white text-sm py-2 overflow-hidden relative">
          <div className="whitespace-nowrap flex items-center gap-8 animate-marquee">
            {marqueeText}
            {marqueeText}
            {marqueeText}
          </div>
        </div>
        {/* Centered Logo */}
        <div className="flex justify-center items-center py-4">
          <Image src="/images/logo.png" alt="TrendyGoods Logo" width={180} height={50} className="object-contain" priority />
        </div>
        <main className="flex-1">
          {/* Gallery */}
          <div className="flex flex-col items-center w-full">
            {/* Main Image */}
            <div className="w-full h-[375px] bg-gray-100 flex items-center justify-center mb-2">
              <Image src={product.images[mainImg]} alt={product.name} width={600} height={375} className="object-cover w-full h-full" />
            </div>
            {/* Thumbnails with arrows and scrollable container */}
            <div className="flex items-center justify-center w-full mb-4" style={{height: 120}}>
              <span className="arrow cursor-pointer text-3xl px-3 select-none text-gray-700" style={{lineHeight: '100px'}} onClick={() => scrollThumbnails(-1)}>❮</span>
              <div
                className="flex overflow-x-auto whitespace-nowrap gap-4 scrollbar-hide items-center w-full"
                ref={thumbnailRef}
                style={{ scrollBehavior: 'smooth' }}
              >
                {product.images.map((img, idx) => (
                  <img
                    key={img+idx}
                    src={img}
                    alt="thumbnail image"
                    height={100}
                    width={100}
                    onClick={() => setMainImg(idx)}
                    className="inline-block w-24 h-24 rounded-xl object-cover cursor-pointer border border-gray-200 transition-all"
                  />
                ))}
              </div>
              <span className="arrow cursor-pointer text-3xl px-3 select-none text-gray-700" style={{lineHeight: '100px'}} onClick={() => scrollThumbnails(1)}>❯</span>
            </div>
            {/* Flash Sale Bar - pixel-perfect gradient, rounded, bold white text */}
            <div className="w-[500px] mx-auto rounded-2xl shadow-lg px-6 py-3 mb-4 flex justify-between items-center" style={{background: 'linear-gradient(90deg, #ff6600 0%, #ff0080 100%)'}}>
            <img src="/images/assets/flash.png" alt="clock" width={60} height={60} className="mr-1" />
              {/* Left column */}
              <div className="flex flex-col items-start">
              
                <span className="font-bold text-white text-base mb-1">Flaş İndirim</span>
                <span className="bg-white text-black font-mono px-3 py-1 rounded text-base">01:31:52</span>
              </div>
              {/* Right column */}
              <div className="flex flex-col items-end flex-1">
                <span className="font-bold text-white text-base mb-1">58 adet satıldı</span>
                <div className="w-40 h-2 bg-pink-300 rounded-full overflow-hidden">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </div>
          {/* Product Info - left-aligned, tight spacing */}
          <div className="w-full px-1 mb-4">
            <h1 className="text-2xl font-bold mb-1 text-gray-900">{product.name}</h1>
            <div className="flex items-center mb-1">
              <span className="text-green-700 font-bold text-lg mr-1">4.8</span>
              <StarRating rating={product.rating} />
              <span className="ml-2 text-gray-500 text-sm">({product.reviewCount} değerlendirme)</span>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-bold text-green-600">{product.price}</span>
              <span className="text-lg text-gray-400 line-through">{product.oldPrice}</span>
              <span className="bg-pink-500 text-white px-2 py-1 rounded text-sm font-semibold">29% indirim</span>
            </div>
          </div>
          {/* Features List */}
          <ul className="mb-6 space-y-2 w-full px-1">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-center text-base text-gray-800 font-semibold">
                <span className="mr-2 text-xl">{f.split(' ')[0]}</span>
                <span className="font-bold">{f.split(' ').slice(1).join(' ')}</span>
              </li>
            ))}
          </ul>
          <hr className="border-t border-gray-200 mb-6" />
          {/* ÇOK AL & AZ ÖDE Section */}
          <div className="w-full mb-6">
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-red-500" />
              <span className="mx-4 text-lg font-bold text-gray-700">ÇOK AL & AZ ÖDE</span>
              <div className="flex-1 h-px bg-red-500" />
            </div>
            <BuyMoreOptions />
          </div>
          {/* Order Info and Buttons */}
          <div className="w-full flex flex-col items-center mb-6">
            <div className="flex flex-col items-center text-center mb-4">
              <span className="text-2xl text-gray-700 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 19v-2.5M3 16.5V8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25v8.25M3 16.5l2.25-2.25m0 0l2.25 2.25m-2.25-2.25V19m13.5-2.25l2.25 2.25m-2.25-2.25l-2.25 2.25m2.25-2.25V19" />
                </svg>
              </span>
              <span className="text-sm text-gray-700">Şimdi sipariş verirsen</span>
              <span className="font-bold text-sm text-gray-900">16 Temmuz Çarşamba - 18 Temmuz Cuma</span>
              <span className="text-sm text-gray-700 mb-1">tarihleri arasında siparişin kapında!</span>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-2 text-lg transition">Kapıda Ödemeli Sipariş Ver</button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition">Şimdi Sipariş Ver</button>
          </div>
          {/* Reviews Section Title */}
          <div className="flex items-center w-full mb-4 mt-8">
            <div className="flex-1 h-px bg-red-500" />
            <span className="mx-4 text-lg font-bold text-gray-700">Tüm Değerlendirmeler ({product.reviewCount})</span>
            <div className="flex-1 h-px bg-red-500" />
          </div>
          {/* Reviews */}
          <ReviewGrid reviews={product.reviews} />
          {/* Order Summary Card Divider */}
          <div className="flex items-center w-full mb-2">
            <div className="flex-1 h-px bg-red-500" />
          </div>
          {/* Order Summary Card */}
          <div className="w-full bg-gray-50 rounded shadow p-3 flex items-center">
            <span className="font-bold text-gray-800 mr-2">MagnoGlow Lamba</span>
            <span className="text-gray-400 line-through mr-2">700.00TL</span>
            <span className="text-pink-600 font-bold">499.00TL</span>
          </div>
        </main>
        <Footer />
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
} 