'use client';

import React from 'react';
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

export default function Footer() {
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
                    <span style={{flexGrow: 1}}>{link.label}</span>
                    <i className="fas fa-external-link-alt" style={{fontSize: '12px', marginLeft: '8px', opacity: 0.6}}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
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
    </footer>
  );
} 