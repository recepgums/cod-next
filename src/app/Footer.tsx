'use client';

import React from 'react';

const footerLinks = [
  { label: 'Gizlilik Politikası', href: '#' },
  { label: 'Kargo Politikası', href: '#', highlight: true },
  { label: 'Para İade Politikası', href: '#' },
  { label: 'Hizmet ve Şartlar', href: '#' },
  { label: 'İletişim', href: '#' },
  { label: 'Yasal Bildirim', href: '#' },
];

function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export default function Footer() {
  return (
    <footer className="bg-[#232323] w-full py-10 mt-10 relative">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left & Right: Synchronized hover using group */}
        <ul className="flex-1 flex flex-col gap-2 text-base">
          {footerLinks.map((link, idx) => (
            <li key={link.label} className="flex items-center group">
              <a
                href={link.href}
                className={`flex items-center gap-2 transition-colors text-gray-200 hover:text-orange-400 ${link.highlight ? 'hover:font-bold' : ''}`}
              >
                <svg className={`w-3 h-3 mr-2 text-orange-400 group-hover:text-orange-500`} fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg>
                <span>{link.label}</span>
              </a>
              {/* Right icon, synchronized hover */}
              <a
                href={link.href}
                className="p-1 ml-auto hidden md:inline group"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h6m5-1l-7 7m7-7V3" /></svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Scroll to top button: rounded square */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-lg transition"
        aria-label="Sayfanın başına dön"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
      </button>
    </footer>
  );
} 