'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Footer from '../../../components/Footer';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

interface Order {
  id: number;
  name: string;
  phone: string;
  city_id: string;
  district_id: string;
  neighborhood_id: string;
  address: string;
  total_price: string;
  is_done: number;
  note: string | null;
  barcode: string | null;
  package_no: string | null;
  tracking_number: string | null;
  status_code: string | null;
  created_at: string;
}

interface ApiResponse {
  order: Order;
  legal_links: Array<{
    key: string;
    title: string;
  }>;
}

export default function ThankYouPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [legalLinks, setLegalLinks] = useState<Array<{key: string, title: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/thanks`);
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setOrder(data.order);
        setLegalLinks(data.legal_links);
      } else {
        setError("Sipariş bilgileri yüklenemedi.");
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-white d-flex flex-column">
        <main className="flex-fill d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
            <p className="mt-3">Sipariş bilgileri yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-white d-flex flex-column">
        <main className="flex-fill d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          {order && (
            <div className="card shadow-sm mb-5">
              <div className="card-body p-4">
                <h3 className="font-weight-bold text-center mb-4" style={{ fontFamily: 'Spartan, sans-serif', fontSize: '24px' }}>
                  Sipariş Detayları
                </h3>
                <div className="bg-white rounded border p-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  <div className="row mb-2">
                    <div className="col-6 font-weight-bold">Alıcı Adı:</div>
                    <div className="col-6 text-right">{order.name}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6 font-weight-bold">Telefon:</div>
                    <div className="col-6 text-right">{order.phone}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6 font-weight-bold">Sipariş Numarası:</div>
                    <div className="col-6 text-right font-weight-bold text-dark">#{order.id}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6 font-weight-bold">Toplam Tutar:</div>
                    <div className="col-6 text-right font-weight-bold">{order.total_price}₺</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-4 font-weight-bold">Adres:</div>
                    <div className="col-8 text-right">{order.address}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6 font-weight-bold">Sipariş Tarihi:</div>
                    <div className="col-6 text-right">{new Date(order.created_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
} 