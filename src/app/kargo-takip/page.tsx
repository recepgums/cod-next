'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import React, { useState, useEffect } from 'react';

export default function CargoTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoSrc, setLogoSrc] = useState<string | undefined>(undefined);

  // Fetch merchant logo on component mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const text = await response.text();
          const data = JSON.parse(text);
          const logoUrl = data?.logoUrl || data?.merchant?.logo_url || null;
          if (logoUrl) {
            setLogoSrc(logoUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching merchant logo:', err);
      }
    };

    fetchLogo();
  }, []);

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Lütfen telefon numaranızı giriniz.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-track?phone=${trackingNumber}`);

      if (!response.ok) {
        throw new Error('Sipariş bulunamadı');
      }

      const data = await response.json();
      
      if (!data.success || !data.order) {
        throw new Error('Sipariş bulunamadı');
      }
      
      setTrackingResult(data.order);
    } catch (err) {
      setError('Sipariş bulunamadı. Lütfen telefon numaranızı kontrol ediniz.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (isDone: number) => {
    switch (isDone) {
      case 1:
        return '#28a745'; // Yeşil - Tamamlandı
      case 0:
        return '#ffc107'; // Sarı - Beklemede
      default:
        return '#6c757d'; // Gri - Bilinmiyor
    }
  };

  const getStatusText = (isDone: number) => {
    switch (isDone) {
      case 1:
        return 'Sipariş Tamamlandı';
      case 0:
        return 'Sipariş Hazırlanıyor';
      default:
        return 'Durum Bilinmiyor';
    }
  };

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header logoSrc={logoSrc} />
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
                     Telefon numaranızı girerek sipariş durumunuzu takip edebilirsiniz
                   </p>
                </div>
                
                <div className="card-body p-4">
                  <form onSubmit={handleTrackingSubmit}>
                    <div className="mb-4">
                       <label htmlFor="trackingNumber" className="form-label fw-bold">
                         <i className="fas fa-phone me-2 text-primary"></i>
                         Telefon Numarası
                       </label>
                       <div className="input-group">
                         <input
                           type="tel"
                           className="form-control form-control-lg"
                           id="trackingNumber"
                           placeholder="053123456"
                           value={trackingNumber}
                           onChange={(e) => {
                             // Sadece sayısal karakterleri kabul et
                             const value = e.target.value.replace(/\D/g, '');
                             setTrackingNumber(value);
                           }}
                           style={{ borderRadius: '10px 0 0 10px', border: '2px solid #e9ecef' }}
                         />
                        <button
                          type="submit"
                          className="btn btn-lg"
                          disabled={isLoading}
                          style={{
                            background: 'linear-gradient(90deg, #FF6A00 0%, #EE0979 100%)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '0 10px 10px 0',
                            minWidth: '120px'
                          }}
                        >
                          {isLoading ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              Aranıyor...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-search me-2"></i>
                              Sorgula
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  {trackingResult && (
                    <div className="mt-4">
                      <div className="card" style={{ border: '2px solid #e9ecef', borderRadius: '12px' }}>
                        <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px 10px 0 0' }}>
                          <h5 className="mb-0">
                            <i className="fas fa-box me-2 text-primary"></i>
                            Sipariş Detayları
                          </h5>
                        </div>
                         <div className="card-body">
                           <div className="row">
                             <div className="col-md-6">
                               <p><strong>Sipariş No:</strong> {trackingResult.id}</p>
                               <p><strong>Sipariş Tarihi:</strong> {new Date(trackingResult.created_at).toLocaleDateString('tr-TR')}</p>
                               <p><strong>Müşteri:</strong> {trackingResult.name}</p>
                               {trackingResult.branch_code && (
                                 <p><strong>Şube Kodu:</strong> {trackingResult.branch_code}</p>
                               )}
                             </div>
                             <div className="col-md-6">
                               <p><strong>Telefon:</strong> {trackingResult.phone}</p>
                               <p><strong>Adres:</strong> {trackingResult.address}</p>
                               <p><strong>Toplam:</strong> <span className="text-success fw-bold">{trackingResult.total_price} TL</span></p>
                               <p><strong>Ödeme:</strong> <span className="text-info">{trackingResult.amount_type}</span></p>
                             </div>
                           </div>
                           
                           {trackingResult.products && (
                             <div className="row">
                               <div className="col-12">
                                 <p><strong>Ürünler:</strong> {trackingResult.products}</p>
                               </div>
                             </div>
                           )}
                           
                           {trackingResult.tracking_number && (
                             <div className="row">
                               <div className="col-12">
                                 <p><strong>Kargo Takip No:</strong> <span className="text-primary">{trackingResult.tracking_number}</span></p>
                               </div>
                             </div>
                           )}
                           
                           <hr />
                           
                           <div className="text-center">
                             <div 
                               className="badge fs-6 px-3 py-2"
                               style={{ 
                                 backgroundColor: getStatusColor(trackingResult.is_done),
                                 color: 'white'
                               }}
                             >
                               <i className="fas fa-info-circle me-2"></i>
                               {getStatusText(trackingResult.is_done)}
                             </div>
                           </div>

                           {trackingResult.note && (
                             <div className="mt-4">
                               <h6><i className="fas fa-sticky-note me-2"></i>Sipariş Notu:</h6>
                               <div className="alert alert-info">
                                 <i className="fas fa-info-circle me-2"></i>
                                 {trackingResult.note}
                               </div>
                             </div>
                           )}

                           {trackingResult.tracking_number && (
                             <div className="mt-4">
                               <h6><i className="fas fa-route me-2"></i>Kargo Durumu:</h6>
                               <div className="alert alert-success">
                                 <i className="fas fa-shipping-fast me-2"></i>
                                 Siparişiniz kargoya verilmiştir. Takip numarası: <strong>{trackingResult.tracking_number}</strong>
                               </div>
                             </div>
                           )}

                           {trackingResult.cargo_tracking_url && (
                             <div className="mt-4">
                               <h6><i className="fas fa-info-circle me-2"></i>Kargo Takip Detayları:</h6>
                               <div className="text-center">
                                 <a 
                                   href={trackingResult.cargo_tracking_url} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="btn btn-lg"
                                   style={{
                                     background: 'linear-gradient(90deg, #17a2b8 0%, #007bff 100%)',
                                     border: 'none',
                                     color: 'white',
                                     borderRadius: '10px',
                                     minWidth: '200px',
                                     padding: '12px 24px'
                                   }}
                                 >
                                   <i className="fas fa-external-link-alt me-2"></i>
                                   Detaylar
                                 </a>
                                 <p className="small text-muted mt-2 mb-0">
                                   Kargo firmasının sitesinde detaylı takip bilgilerini görüntüleyebilirsiniz
                                 </p>
                               </div>
                             </div>
                           )}

                           {trackingResult.order_items && trackingResult.order_items.length > 0 && (
                             <div className="mt-4">
                               <h6><i className="fas fa-list me-2"></i>Sipariş Detayları:</h6>
                               <div className="table-responsive">
                                 <table className="table table-sm">
                                   <thead>
                                     <tr>
                                       <th>Ürün</th>
                                       <th>Adet</th>
                                       <th>Fiyat</th>
                                     </tr>
                                   </thead>
                                   <tbody>
                                     {trackingResult.order_items.map((item: any, index: number) => (
                                       <tr key={index}>
                                         <td> {item.product?.name || 'Ürün'}</td>
                                         <td>{item.quantity}</td>
                                         <td>{item.price} TL</td>
                                       </tr>
                                     ))}
                                   </tbody>
                                 </table>
                               </div>
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  )}

                   <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                     <h6><i className="fas fa-info-circle me-2 text-info"></i>Bilgilendirme</h6>
                     <ul className="mb-0 small text-muted">
                       <li>Telefon numaranızla sipariş sorgulayabilirsiniz</li>
                       <li>Kargo takip bilgileri 24 saat içinde güncellenebilir</li>
                       <li>Herhangi bir sorun yaşarsanız müşteri hizmetlerimizle iletişime geçiniz</li>
                       <li>Sipariş durumu: Hazırlanıyor = Sipariş işleme alındı, Tamamlandı = Kargoya verildi</li>
                     </ul>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
