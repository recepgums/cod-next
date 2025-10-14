'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PixelScripts = dynamic(() => import('../../../product/[slug]/PixelScripts'), { ssr: false });

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
  product_id?: number;
  products?: string;
  quantity?: number;
  pixels?: { platform: string; pixel_id: string }[];
}

interface ApiResponse {
  order: Order;
  legal_links: Array<{
    key: string;
    title: string;
  }>;
  pixels?: { platform: string; pixel_id: string }[];
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

  // Purchase eventi gönder (tek seferlik - 1 gün içinde)
  useEffect(() => {
    if (!order || !order.pixels) return;

    // Pixel scriptlerinin yüklenmesini bekle
    const sendPurchaseEvent = () => {
      try {
        // Daha önce gönderilmiş mi kontrol et (1 gün içinde)
        const cached = localStorage.getItem('purchase_event');
        if (cached) {
          const data = JSON.parse(cached);
          const lastSent = new Date(data.timestamp);
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          
          if (lastSent > oneDayAgo && data.order_id === order.id) {
            console.log('Purchase event already sent within 24 hours for this order, skipping...');
            return; // 1 gün içinde aynı sipariş için gönderilmiş
          }
        }

        const value = parseFloat(order.total_price.toString()) || 0;
        const pid = order.product_id?.toString?.() || '';
        const pname = order.products || '';
        const qty = parseInt(order.quantity?.toString() || '1') || 1;

        // Facebook Pixel Purchase Event
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', {
            value,
            currency: 'TRY',
            content_ids: [pid],
            content_type: 'product',
            content_name: pname,
            num_items: qty
          });
        }

        // TikTok Pixel Purchase Event
        if (typeof window !== 'undefined' && (window as any).ttq) {
          (window as any).ttq.track('CompletePayment', {
            value,
            currency: 'TRY',
            content_id: pid,
            content_type: 'product',
            content_name: pname,
            quantity: qty
          });

          (window as any).ttq.track('PlaceAnOrder', {
            value,
            currency: 'TRY',
            content_id: pid,
            content_type: 'product',
            content_name: pname,
            quantity: qty
          });
        }

        // Cache'e kaydet (timestamp ile)
        localStorage.setItem('purchase_event', JSON.stringify({
          timestamp: new Date().toISOString(),
          event: 'Purchase',
          order_id: order.id
        }));

        console.log('Purchase events sent:', {
          facebook: { event: 'Purchase', value, content_ids: [pid], content_name: pname },
          tiktok: { event: 'CompletePayment', value, content_id: pid, content_name: pname },
          order_id: order.id
        });
      } catch (error) {
        console.error('Error sending Purchase events:', error);
      }
    };

    // Pixel scriptlerinin yüklenmesini bekle
    const checkPixelsLoaded = () => {
      if ((window as any).fbq || (window as any).ttq) {
        sendPurchaseEvent();
      } else {
        // 2 saniye sonra tekrar kontrol et
        setTimeout(checkPixelsLoaded, 2000);
      }
    };

    // 1 saniye bekle, sonra kontrol et
    setTimeout(checkPixelsLoaded, 1000);
  }, [order]);

  const loadOrderData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/thanks`);
      if (response.ok) {
        const data: ApiResponse = await response.json();
        // Pixel bilgilerini order'a ekle
        const orderWithPixels = {
          ...data.order,
          pixels: data.pixels || []
        };
        setOrder(orderWithPixels);
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
        <Header />
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
        <Header />
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
      <Header />
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

      {/* Pixel Scripts */}
      {order && order.pixels && (
        <PixelScripts 
          pixels={order.pixels} 
          product={{
            id: order.product_id || 0,
            name: order.products || '',
            price: parseFloat(order.total_price.toString()) || 0
          }} 
        />
      )}
    </div>
  );
} 