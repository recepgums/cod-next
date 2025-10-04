'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

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

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          headers: {
            'Content-Type': 'application/json',
            'Origin': typeof window !== 'undefined' ? window.location.origin : '',
            'Referer': typeof window !== 'undefined' ? window.location.href : ''
          }
        });
        
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link href="/" className="navbar-brand">
            <Image
              src="/images/logo.png"
              alt="TrendyGoods"
              width={185}
              height={50}
              style={{height: '50px'}}
              priority
            />
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">Anasayfa</a>
              </li>
              
              <li className="nav-item dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Kategoriler
                </a>
                <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  zIndex: 1000,
                  minWidth: '200px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <a 
                        className="dropdown-item" 
                        href={`/category/${category.slug}`}
                        style={{ 
                          padding: '8px 16px',
                          fontSize: '14px',
                          textDecoration: 'none',
                          color: '#333',
                          display: 'block'
                        }}
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              
              <li className="nav-item">
                <a className="nav-link" href={`/kargo-takip`}>Kargo Takip</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">İletişim</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
} 