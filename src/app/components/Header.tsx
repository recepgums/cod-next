import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full h-[81px] flex justify-center items-center bg-white px-6">
      <div className="w-full max-w-[1320px] flex flex-row items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center select-none">
          <Image
            src="/images/logo.png"
            alt="TrendyGoods Logo"
            width={185}
            height={50}
            className="rounded"
            priority
          />
        </Link>
        {/* Navbar */}
        <nav>
          <ul className="flex navbar-nav">
            <li className="nav-item">
              <a className="nav-link block px-3 py-2 text-[14px] font-medium no-underline text-[#0000008C] hover:text-black transition-colors" style={{ fontFamily: 'Lato, sans-serif' }} href="https://trendygoods.com.tr">Anasayfa</a>
            </li>
            <li className="nav-item">
              <a className="nav-link block px-3 py-2 text-[14px] font-medium no-underline text-[#0000008C] hover:text-black transition-colors" style={{ fontFamily: 'Lato, sans-serif' }} href="https://trendygoods.com.tr/kargo-takip">Kargo Takip</a>
            </li>
            <li className="nav-item">
              <a className="nav-link block px-3 py-2 text-[14px] font-medium no-underline text-[#0000008C] hover:text-black transition-colors" style={{ fontFamily: 'Lato, sans-serif' }} href="#contact-section">İletişim</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 