'use client';

import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

export default function ThankYouPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 mt-10 pt-10 text-[#212529]">
        <div className="max-w-[600px] mx-auto px-4 py-16">
          {/* Thank You Message */}
          <div>
            <h1 className="font-bold mb-4" style={{ fontFamily: 'Spartan, sans-serif', fontSize: '40px' }}>
              Teşekkür Ederiz!
            </h1>
            <p className="mb-4" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px' }}>
              Siparişiniz başarıyla alınmıştır ve en kısa sürede sizinle iletişime geçip kargoya vereceğiz 😊
            </p>
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <h3 className="font-bold" style={{ fontFamily: 'Spartan, sans-serif', fontSize: '28px', marginBottom: '15px' }}>
              Sipariş Detayları
            </h3>
            <ul className="space-y-2 text-left">
              <li><strong>Alıcı Adı:</strong> Recep Gümüş</li>
              <li><strong>Sipariş Numarası:</strong> #100014458</li>
              <li><strong>Sipariş İçeriği:</strong> ["10"] 1 X Cosmos Yıldız Yağmuru 1 X Duvara Yapışan Tuvalet Fırçası</li>
              <li><strong>Toplam Tutar:</strong> 1371₺</li>
              <li><strong>Adres:</strong> EYMÜR Silahtarağa mahallesi- Lala Mehmet Paşa sokağı numara 1 Daire 20 DEMİRÖZÜ/BAYBURT</li>
            </ul>
          </div>
          <Footer />
        </div>
      </main>
    
    </div>
  );
} 