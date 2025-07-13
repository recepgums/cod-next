import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white py-6 flex flex-col items-center shadow-sm">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center mb-4 md:mb-0 select-none">
          <Image
            src="/images/logo.png"
            alt="TrendyGoods Logo"
            width={185}
            height={50}
            className="rounded"
            priority
          />
        </Link>
        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium text-lg">
            <li><a href="#" className="hover:text-pink-600 transition">Anasayfa</a></li>
            <li><a href="#" className="hover:text-pink-600 transition">Kargo Takip</a></li>
            <li><a href="#" className="hover:text-pink-600 transition">İletişim</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 