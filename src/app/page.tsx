'use client';

import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import React, { useEffect, useState } from 'react';
import { HomepageProduct } from './types/product';
import './home.css';

export default function Home() {
  const [products, setProducts] = useState<HomepageProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`);
        const data = await res.json();
        const productsArray = data.products || [];
        const mapped: HomepageProduct[] = productsArray.map((item: any) => ({
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
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <Header />
      <main className="home-main">
        {loading ? (
          <div className="product-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid-container">
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="product-empty">
            <h3>Ürün bulunamadı</h3>
            <p>Şu anda gösterilecek ürün bulunmuyor.</p>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
