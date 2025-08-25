'use client';

import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  href: string;
}

interface NovaHeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  categories?: Category[];
  backgroundColor?: string;
  textColor?: string;
}

export default function NovaHeader({
  logoSrc = "/images/logo.png",
  logoAlt = "REXING",
  categories = [],
  backgroundColor = "#ffffff",
  textColor = "#000000"
}: NovaHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header 
        className="nova-header"
        style={{
          backgroundColor,
          color: textColor,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <div className="desktop-header d-none d-lg-block">
          <div className="container">
            <div className="row" style={{paddingBlock:"20px"}}>
              <div className="col-sm-2 d-flex align-items-center justify-content-center">
                <img src={logoSrc} alt={logoAlt} style={{ maxWidth: "120px" }} />
              </div>
              <div className="align-items-center col-sm-9 d-flex">
                <nav className="nova-header-nav">
                  <ul>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <a href={category.href}>{category.name}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-header d-lg-none">
          <div 
            className="mobile-header-top"
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '60px'
            }}
          >
            <button
              onClick={toggleMobileMenu}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: textColor
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M3 12H21M3 6H21M3 18H21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="mobile-logo">
              <img 
                src={logoSrc} 
                alt={logoAlt} 
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  objectFit: 'contain'
                }} 
              />
            </div>

            <div style={{ width: '40px' }}></div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay d-lg-none"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001
          }}
          onClick={toggleMobileMenu}
        />
      )}
      <div 
        className={`mobile-menu d-lg-none ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: mobileMenuOpen ? 0 : '-280px',
          width: '280px',
          height: '100vh',
          backgroundColor: '#fff',
          zIndex: 1002,
          transition: 'left 0.3s ease',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          overflowY: 'auto'
        }}
      >
        <div 
          style={{
            padding: '20px 16px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Menu</h3>
          <button
            onClick={toggleMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: textColor
            }}
          >
            ×
          </button>
        </div>

        <div className="mobile-menu-categories" style={{ padding: '16px 0' }}>
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.href}
              style={{
                display: 'block',
                padding: '12px 16px',
                textDecoration: 'none',
                color: textColor,
                fontSize: '16px',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={toggleMobileMenu}
            >
              {category.name}
            </a>
          ))}
        </div>

        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#666'
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle 
                cx="12" 
                cy="7" 
                r="4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: '14px' }}>Oturum aç</span>
          </div>
        </div>
      </div>
    </>
  );
}
