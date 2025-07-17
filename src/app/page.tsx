'use client';

import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://cod.laravel/api/merchant/products');
        const data = await res.json();
        const productsArray = data.data || [];
        const mapped = productsArray.map((item: any) => ({
          name: item.name,
          imgSrc: item.productImg,
          productLink: item.productLink || '',
          slug: item.slug || '',
          rating: item.rating || null,
          priceCurrent: item.priceCurrent,
          priceOriginal: item.priceOriginal || null,
        }));
        setProducts(mapped);
      } catch (e) {
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  function scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 mt-[20px] pb-16">
        <ProductGrid products={products} />
      </main>
      <Footer />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Sayfanın başına dön"
          id="scrollToTopBtn"
        >
          <i className="fi-rs-arrow-up"></i>
        </button>
      )}
    </div>
  );
}
