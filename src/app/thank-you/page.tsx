'use client';

import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

export default function ThankYouPage() {

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <main className="flex-fill mt-3 pb-4">
        <div className="container mx-auto px-3 py-5" style={{maxWidth: '600px'}}>
          {/* Success Icon */}
          <div className="d-flex justify-content-center mb-4">
            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '96px', height: '96px'}}>
              <FaCheckCircle className="text-success" style={{fontSize: '3rem'}} />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mb-5">
            <h1 className="display-4 font-weight-bold text-dark mb-3" style={{ fontFamily: 'Spartan, sans-serif' }}>
              Teşekkürler!
            </h1>
            <p className="h4 text-muted mb-4" style={{ fontFamily: 'Spartan, sans-serif' }}>
              Siparişiniz başarıyla alındı
            </p>
            <p className="lead text-muted mx-auto" style={{ fontFamily: 'Spartan, sans-serif', maxWidth: '600px' }}>
              Siparişiniz için teşekkür ederiz. Siparişiniz işleme alınmıştır ve en kısa sürede kargoya verilecektir. 
              Sipariş durumunuzu takip etmek için e-posta adresinizi kontrol edin.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="card shadow-sm mb-5">
            <div className="card-body p-4">
              <h3 className="font-weight-bold text-center mb-4" style={{ fontFamily: 'Spartan, sans-serif', fontSize: '24px' }}>
                Sipariş Detayları
              </h3>
              <div className="bg-white rounded border p-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <div className="row mb-2">
                  <div className="col-6 font-weight-bold">Alıcı Adı:</div>
                  <div className="col-6 text-right">Recep Gümüş</div>
                </div>
                <div className="row mb-2">
                  <div className="col-6 font-weight-bold">Sipariş Numarası:</div>
                  <div className="col-6 text-right font-weight-bold text-dark">#100014458</div>
                </div>
                <div className="row mb-2">
                  <div className="col-4 font-weight-bold">Sipariş İçeriği:</div>
                  <div className="col-8 text-right">[10] 1 X Cosmos Yıldız Yağmuru 1 X Duvara Yapışan Tuvalet Fırçası</div>
                </div>
                <div className="row mb-2">
                  <div className="col-6 font-weight-bold">Toplam Tutar:</div>
                  <div className="col-6 text-right font-weight-bold">1371₺</div>
                </div>
                <div className="row mb-2">
                  <div className="col-4 font-weight-bold">Adres:</div>
                  <div className="col-8 text-right">EYMÜR Silahtarağa mahallesi- Lala Mehmet Paşa sokağı numara 1<br />Daire 20 DEMİRÖZÜ/BAYBURT</div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}