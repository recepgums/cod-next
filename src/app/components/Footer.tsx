'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const footerLinks = [
  { label: 'Gizlilik Politikası', href: '#' },
  { label: 'Kargo Politikası', href: '#', highlight: true },
  { label: 'Para İade Politikası', href: '#' },
  { label: 'Hizmet ve Şartlar', href: '#' },
  { label: 'İletişim', href: '#' },
  { label: 'Yasal Bildirim', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] w-full py-10 mt-10 relative">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left & Right: Synchronized hover using group */}
        <ul className="flex-1 flex flex-col gap-2 text-base">
          {footerLinks.map((link, idx) => (
            <li key={link.label} className="flex items-center group">
              <a
                href={link.href}
                className={`flex items-center gap-2 transition-colors text-gray-200 hover:text-orange-400 ${link.highlight ? 'hover:font-bold' : ''}`}
              >
                <svg className={`w-5 h-5 mr-2 text-orange-400 group-hover:text-orange-500`} fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" /></svg>
                <span className="text-[14px] text-gray-500 group-hover:text-orange-400 transition-colors" style={{ fontFamily: 'Lato, sans-serif' }}>{link.label}</span>
              </a>
              {/* Right icon, synchronized hover */}
              <a
                href={link.href}
                className="p-1 ml-auto hidden md:inline group"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[12px] text-gray-500 group-hover:text-orange-400 transition-colors"/>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
} 