import Footer from "../../components/Footer";
import React from "react";
import { headers } from 'next/headers';

async function fetchOrderByPhone(phone: string) {
  try {
    // Get the current domain from headers
    const h = await headers();
    const host = h.get('host');
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_IS_LOCAL == "true" ?  "https://trendygoods.com.tr" : `${protocol}://${host}`;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-track?phone=${encodeURIComponent(phone)}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': baseUrl,
          'Referer': `${baseUrl}/`,
          'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) return { error: 'Sipariş bulunamadı' };
    const data = await res.json();
    if (!data?.success || !data?.order) return { error: 'Sipariş bulunamadı' };
    return { order: data.order };
  } catch {
    return { error: 'Bağlantı hatası. Lütfen tekrar deneyin.' };
  }
}

function getStatusColor(isDone: number) {
  switch (isDone) {
    case 1:
      return '#28a745';
    case 0:
      return '#ffc107';
    default:
      return '#6c757d';
  }
}

function getStatusText(isDone: number) {
  switch (isDone) {
    case 1:
      return 'Sipariş Tamamlandı';
    case 0:
      return 'Sipariş Hazırlanıyor';
    default:
      return 'Durum Bilinmiyor';
  }
}

export default async function CargoTrackingByPhone({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  const { order, error } = await fetchOrderByPhone(phone);

  if (error) {
    return (
      <div className="min-vh-100 bg-white d-flex flex-column">
        <main className="flex-fill d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">{error}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <main className="flex-fill mt-4 pb-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="card shadow-sm" style={{ borderRadius: '15px', border: 'none' }}>
                <div className="card-header text-center" style={{ 
                  background: 'linear-gradient(90deg, #FF6A00 0%, #EE0979 100%)',
                  color: 'white',
                  borderRadius: '15px 15px 0 0',
                  padding: '20px'
                }}>
                  <h2 className="mb-0">
                    <i className="fas fa-truck me-2"></i>
                    Kargo Takip
                  </h2>
                  <p className="mb-0 mt-2" style={{ opacity: 0.9 }}>
                    Telefon: {order.phone}
                  </p>
                </div>

                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Sipariş No:</strong> {order.id}</p>
                      <p><strong>Sipariş Tarihi:</strong> {new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                      <p><strong>Müşteri:</strong> {order.name}</p>
                      {order.branch_code && (
                        <p><strong>Şube Kodu:</strong> {order.branch_code}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <p><strong>Telefon:</strong> {order.phone}</p>
                      <p><strong>Adres:</strong> {order.address}</p>
                      <p><strong>Toplam:</strong> <span className="text-success fw-bold">{order.total_price} TL</span></p>
                      <p><strong>Ödeme:</strong> <span className="text-info">{order.amount_type}</span></p>
                    </div>
                  </div>

                  {order.products && (
                    <div className="row">
                      <div className="col-12">
                        <p><strong>Ürünler:</strong> {order.products}</p>
                      </div>
                    </div>
                  )}

                  {order.tracking_number && (
                    <div className="row">
                      <div className="col-12">
                        <p><strong>Kargo Takip No:</strong> <span className="text-primary">{order.tracking_number}</span></p>
                      </div>
                    </div>
                  )}

                  <hr />
                  <div className="text-center">
                    <div 
                      className="badge fs-6 px-3 py-2"
                      style={{ backgroundColor: getStatusColor(order.is_done), color: 'white' }}
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      {getStatusText(order.is_done)}
                    </div>
                  </div>

                  {order.note && (
                    <div className="mt-4">
                      <h6><i className="fas fa-sticky-note me-2"></i>Sipariş Notu:</h6>
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        {order.note}
                      </div>
                    </div>
                  )}

                  {order.tracking_number && (
                    <div className="mt-4">
                      <h6><i className="fas fa-route me-2"></i>Kargo Durumu:</h6>
                      <div className="alert alert-success">
                        <i className="fas fa-shipping-fast me-2"></i>
                        Siparişiniz kargoya verilmiştir. Takip numarası: <strong>{order.tracking_number}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


