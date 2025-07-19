'use client';

import React, { useState, useEffect } from 'react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 100) { // Reduced from 300 to 100 for testing
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Check initial state
    toggleVisibility();
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <a
          id="scrollUp"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          style={{
            position: 'fixed',
            width: '40px',
            height: '40px',
            backgroundColor: '#088178',
            color: '#ffffff',
            right: '30px',
            bottom: '30px',
            borderRadius: '5px',
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#066d66';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#088178';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <i 
            className="fi-rs-arrow-up"
            style={{
              display: 'block',
              lineHeight: '40px',
              fontSize: '16px',
            }}
          ></i>
        </a>
      )}
    </>
  );
};

export default ScrollToTop; 