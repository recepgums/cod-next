'use client';

import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/merchant/products`);
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

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header />
      <main className="flex-fill mt-3 pb-4">
        <ProductGrid products={products} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
