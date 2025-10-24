import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


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
  // Categories are now passed from parent
  let categories: Category[] = Array.isArray(categoriesProp) ? categoriesProp : [];
  let resolvedLogoSrc: string | undefined = logoSrc;


  return (

    <header className="header">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link href="/" className="navbar-brand">
            <Image
              src={resolvedLogoSrc || "/images/logo.png"}
              alt="TrendyGoods"
              width={185}
              height={50}
              style={{ height: '50px' }}
              priority
            />
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
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
        </nav>
      </div>
    </header>
  );
} 