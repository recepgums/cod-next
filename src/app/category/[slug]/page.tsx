'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ProductGrid from '../../components/ProductGrid';

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('Kategori Ürünleri');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/${params.slug}`, {
          headers: {
            'Content-Type': 'application/json',
            'Origin': typeof window !== 'undefined' ? window.location.origin : '',
            'Referer': typeof window !== 'undefined' ? window.location.href : ''
          }
        });
        console.log(response.data);

        // Response robust mapping
        const payload = response.data;
        setCategoryName(payload?.name || payload?.category?.name || String(params.slug));

        // Products could be under payload.products or payload.data
        const rawProducts = Array.isArray(payload?.products)
          ? payload.products
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        console.log('Kategori ürünleri:', rawProducts);

        const mappedProducts = rawProducts.map((item: any, index: number) => ({
          name: item.name || `Ürün ${index + 1}`,
          imgSrc: item.productImg || '/images/placeholder.svg',
          productLink: `/product/${item.slug}`,
          slug: item.slug || `product-${index + 1}`,
          rating: item.rating ? parseFloat(item.rating) : null,
          priceCurrent: item.price || item.priceCurrent || 'Fiyat Belirtilmemiş',
          priceOriginal: item.originalPrice || item.priceOriginal || null,
        }));

        setProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProducts();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">{categoryName}</h1>
      <ProductGrid products={products} />
    </div>
  );
}
