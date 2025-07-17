'use client';

import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

export default function ThankYouPage() {

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 mt-[20px] pb-16">
        <div className="max-w-[800px] mx-auto px-4 py-16">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-6xl text-green-600" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Spartan, sans-serif' }}>
              Teşekkürler!
            </h1>
            <p className="text-xl text-gray-600 mb-6" style={{ fontFamily: 'Spartan, sans-serif' }}>
              Siparişiniz başarıyla alındı
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: 'Spartan, sans-serif' }}>
              Siparişiniz için teşekkür ederiz. Siparişiniz işleme alınmıştır ve en kısa sürede kargoya verilecektir. 
              Sipariş durumunuzu takip etmek için e-posta adresinizi kontrol edin.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="w-full bg-[#fafbfc] text-[#212529] rounded-xl shadow-sm px-6 py-8 mb-10">
            <h3 className="font-bold text-center mb-6" style={{ fontFamily: 'Spartan, sans-serif', fontSize: '24px' }}>
              Sipariş Detayları
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Alıcı Adı:</span>
                <span>Recep Gümüş</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Sipariş Numarası:</span>
                <span className="font-bold text-black">#100014458</span>
              </div>
              <div className="flex mb-2">
                <span className="font-semibold min-w-[120px]">Sipariş İçeriği:</span>
                <span className="text-right">[10] 1 X Cosmos Yıldız Yağmuru 1 X Duvara Yapışan Tuvalet Fırçası</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Toplam Tutar:</span>
                <span className="font-bold">1371₺</span>
              </div>
              <div className="flex mb-2">
                <span className="font-semibold min-w-[120px]">Adres:</span>
                <span className="text-right">EYMÜR Silahtarağa mahallesi- Lala Mehmet Paşa sokağı numara 1<br />Daire 20 DEMİRÖZÜ/BAYBURT</span>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </main>
      
    
    </div>
  );
}