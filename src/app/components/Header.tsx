import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
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
                            <a className="nav-link" href={process.env.NEXT_PUBLIC_WEBSITE_URL}>Anasayfa</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/kargo-takip`}>Kargo Takip</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact-section">İletişim</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
} 