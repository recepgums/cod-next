'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Header.css';


interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  merchant_id: number;
  created_at: string;
  updated_at: string;
  products: any[];
}

interface HeaderProps {
  logoSrc?: string;
  categories?: Category[];
}

export default function Header({ logoSrc, categories: categoriesProp }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Categories are now passed from parent
  let categories: Category[] = Array.isArray(categoriesProp) ? categoriesProp : [];
  let resolvedLogoSrc: string | undefined = logoSrc;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">
            <Link href="/" className="navbar-brand">
              <Image
                src={resolvedLogoSrc || "/images/logo.png"}
                alt="logo"
                width={185}
                height={50}
                style={{ height: '50px' }}
                priority
              />
            </Link>
            
            {/* Desktop Menu */}
            <div className="d-none d-lg-block">
              <ul className="navbar-nav d-flex flex-row">
                <li className="nav-item">
                  <a className="nav-link" href="/">Anasayfa</a>
                </li>
                {categories.map((category) => (
                  <li className="nav-item" key={category.id}>
                    <Link
                      className="nav-link text-capitalize"
                      href={`/category/${category.slug}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li className="nav-item">
                  <a className="nav-link" href={`/kargo-takip`}>Kargo Takip</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">İletişim</a>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="navbar-toggler d-lg-none" 
              type="button" 
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menü</h3>
          <button 
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li className="sidebar-item">
              <a className="sidebar-link" href="/" onClick={closeSidebar}>
                Anasayfa
              </a>
            </li>
            {categories.map((category) => (
              <li className="sidebar-item" key={category.id}>
                <Link
                  className="sidebar-link text-capitalize"
                  href={`/category/${category.slug}`}
                  onClick={closeSidebar}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li className="sidebar-item">
              <a className="sidebar-link" href={`/kargo-takip`} onClick={closeSidebar}>
                Kargo Takip
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="#" onClick={closeSidebar}>
                İletişim
              </a>
            </li>
          </ul>
        </div>
      </div>

    </>
  );
} 