'use client';

import React, { useState, useEffect } from 'react';

interface LegalLink {
  key: string;
  title: string;
}

interface FooterProps {
  legalLinks?: LegalLink[];
}

export default function Footer({ legalLinks: propLegalLinks }: FooterProps) {
  const [legalLinks, setLegalLinks] = useState<LegalLink[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch legal links if not provided as props
  useEffect(() => {
    if (propLegalLinks && propLegalLinks.length > 0) {
      setLegalLinks(propLegalLinks);
    } else {
      // For now, use default legal links since the API endpoint doesn't exist yet
      const defaultLegalLinks = [
        { key: 'privacy-policy', title: 'Gizlilik Politikası' },
        { key: 'shipping-policy', title: 'Kargo Politikası' },
        { key: 'refund-policy', title: 'Para İade Politikası' },
        { key: 'terms-and-conditions', title: 'Hizmet ve Şartlar' },
        { key: 'contact', title: 'İletişim' },
        { key: 'legal-notice', title: 'Yasal Bildirim' },
      ];
      setLegalLinks(defaultLegalLinks);
    }
  }, [propLegalLinks]);

  const handleLegalLinkClick = async (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setIsLoading(true);
    setShowModal(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/legal/${key}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setModalTitle(data.title);
      setModalContent(data.html);
    } catch (error) {
      console.error('Error:', error);
      setModalTitle('Hata');
      setModalContent('<div class="alert alert-danger">İçerik yüklenirken bir hata oluştu.</div>');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalTitle('');
    setModalContent('');
  };

  return (
    <>
      <footer className="main" style={{backgroundColor: '#1a1a1a', paddingTop: '30px', paddingBottom: '100px'}}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Legal Links */}
              <ul style={{listStyle: 'none', padding: 0}}>
                {legalLinks.map((link) => (
                  <li key={link.key} style={{marginBottom: '12px'}}>
                    <a 
                      href="#" 
                      className="legal-link" 
                      data-key={link.key}
                      onClick={(e) => handleLegalLinkClick(e, link.key)}
                      style={{
                        color: '#888', 
                        textDecoration: 'none', 
                        fontSize: '14px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        transition: 'color 0.3s ease'
                      }}
                    >
                      <i className="fas fa-angle-right" style={{color: '#FF6A00', marginRight: '8px'}}></i>
                      <span style={{flexGrow: 1}}>{link.title}</span>
                      <i className="fas fa-external-link-alt" style={{fontSize: '12px', marginLeft: '8px', opacity: 0.6}}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>

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
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1040
            }}
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="modal fade show" style={{display: 'block'}} tabIndex={-1} aria-labelledby="contentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="contentModalLabel">{modalTitle}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                  )}
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
      `}</style>
    </>
  );
} 