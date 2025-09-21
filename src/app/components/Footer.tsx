'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const footerLinks = [
  { label: 'Gizlilik Politikası', href: '#', key: 'privacy-policy' },
  { label: 'Kargo Politikası', href: '#', key: 'shipping-policy' },
  { label: 'Para İade Politikası', href: '#', key: 'refund-policy' },
  { label: 'Hizmet ve Şartlar', href: '#', key: 'terms-and-conditions' },
  { label: 'İletişim', href: '#', key: 'contact' },
  { label: 'Yasal Bildirim', href: '#', key: 'legal-notice' },
];

interface LegalContent {
  title: string;
  html: string;
}

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLegalContent = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/legal/${key}`);
      const data = await response.json();
      setModalContent(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching legal content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    e.preventDefault();
    fetchLegalContent(key);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <footer className="main" style={{backgroundColor: '#1a1a1a', paddingTop: '30px', paddingBottom: '100px'}}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul style={{listStyle: 'none', padding: 0}}>
              {footerLinks.map((link, idx) => (
                <li key={link.label} style={{marginBottom: '12px'}}>
                  <a 
                    href={link.href} 
                    className="legal-link" 
                    data-key={link.key}
                    onClick={(e) => handleLinkClick(e, link.key)}
                    style={{
                      color: '#888', 
                      textDecoration: 'none', 
                      fontSize: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      transition: 'color 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-angle-right" style={{color: '#FF6A00', marginRight: '8px'}}></i>
                    <span style={{flexGrow: 1}}>{link.label}</span>
                    <i className="fas fa-external-link-alt" style={{fontSize: '12px', marginLeft: '8px', opacity: 0.6}}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Content Modal */}
      {showModal && (
        <>
          {/* Modal Backdrop */}
          <div 
            className="modal-backdrop show" 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040
            }}
            onClick={closeModal}
          />

          {/* Modal */}
          <div 
            className="modal fade show" 
            style={{ display: 'block', zIndex: 1050 }} 
            tabIndex={-1} 
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6' }}>
                  <h5 className="modal-title">
                    {loading ? 'Yükleniyor...' : modalContent?.title || 'Yasal Bilgi'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={closeModal}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      padding: '0',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Yükleniyor...</span>
                      </div>
                    </div>
                  ) : modalContent ? (
                    <div 
                      className="legal-content" 
                      dangerouslySetInnerHTML={{ __html: modalContent.html }}
                    />
                  ) : (
                    <p>İçerik yüklenirken bir hata oluştu.</p>
                  )}
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={closeModal}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        footer a:hover { 
          color: #FF6A00 !important; 
        }
        footer a:hover .fa-external-link-alt { 
          opacity: 1 !important; 
        }
        .legal-content { 
          padding: 15px; 
          line-height: 1.6; 
        }
        .legal-content p {
          margin-bottom: 1rem;
        }
        .legal-content h1, 
        .legal-content h2, 
        .legal-content h3 {
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
        }
        .legal-content h1:first-child,
        .legal-content h2:first-child,
        .legal-content h3:first-child {
          margin-top: 0;
        }
        .modal-backdrop {
          backdrop-filter: blur(2px);
        }
      `}</style>
    </footer>
  );
} 