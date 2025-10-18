import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

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
}

export default async function Header({ logoSrc }: HeaderProps) {
  // Fetch categories on the server so they render with initial HTML
  let categories: Category[] = [];
  let resolvedLogoSrc: string | undefined = logoSrc;
  
  // Get the current domain from headers
  const h = await headers();
  const host = h.get('host') || 'trendygoods.com.tr';
  const protocol = h.get('x-forwarded-proto') || 'https';
  const baseUrl = process.env.NEXT_IS_LOCAL == "true" ?  "https://trendygoods.com.tr" : `${protocol}://${host}`;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/`,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
      },
      // Force server-side caching; do not make client-side fetches
      cache: 'force-cache',
      next: { revalidate: 300 },
    });
    if (res.ok) {
      categories = await res.json();
    }

    // If logo not provided, try to read from homepage payload once (server-side)
    if (!resolvedLogoSrc) {
      const homepageRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': baseUrl,
          'Referer': `${baseUrl}/`,
          'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
        },
        cache: 'force-cache',
        next: { revalidate: 300 },
      });
      if (homepageRes.ok) {
        const hp = await homepageRes.json();
        resolvedLogoSrc = hp?.logoUrl || undefined;
      }
    }
  } catch (err) {
    // fail silently; render without categories
  }

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