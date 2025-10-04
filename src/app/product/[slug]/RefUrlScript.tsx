'use client';

import { useEffect } from 'react';

export default function RefUrlScript() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Referrer URL'i al
    const referrer = document.referrer || '';
    // Tam URL'i al (query parametreleri dahil)
    const fullUrl = window.location.href;
    
    // Şu anki timestamp
    const timestamp = new Date().toISOString();

    // Local storage'a kaydet
    localStorage.setItem('ref_url_data', JSON.stringify({
      referrer,
      fullUrl,
      timestamp,
      pathname: window.location.pathname,
      search: window.location.search
    }));

  }, []); // Sadece component mount olduğunda çalışsın

  return null; // Bu component görsel render etmiyor
}
