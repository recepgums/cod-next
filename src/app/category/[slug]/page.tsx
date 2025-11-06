import React from 'react';
import { headers } from 'next/headers';
import Header from '../../components/Header';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

// Categories verisini çek
async function fetchCategories() {
  try {
    const h = await headers();
    const host = h.get('host');
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_IS_LOCAL == "true" ?  "https://vitalizma.com.tr" : `${protocol}://${host}`;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': baseUrl,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
      },
      ...(process.env.NEXT_IS_LOCAL === 'local'
        ? { cache: 'no-store' as const }
        : { next: { revalidate: 300 as const } }),
    });

    if (!response.ok) {
      console.error('Categories fetch failed:', response.status);
      return [];
    }

    const data = await response.json();
    console.log("asdasd",data)
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Server Component - SSR ile veri çekme
async function fetchCategoryProducts(slug: string) {
  try {
    // Get the current domain from headers
    const h = await headers();
    const host = h.get('host');
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_IS_LOCAL == "true" ?  "https://vitalizma.com.tr" : `${protocol}://${host}`;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${slug}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/category/${slug}`,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
      },
      ...(process.env.NEXT_IS_LOCAL === 'local'
        ? { cache: 'no-store' as const }
        : { next: { revalidate: 300 as const } }),
    });

    if (!response.ok) {
      console.warn('⚠️ Category API failed:', response.status, response.statusText);
      throw new Error(`Category API failed: ${response.status}`);
    }

    const payload = await response.json();
    console.log('✅ Category API success:', payload);
    const logoUrl = payload?.merchant?.logo_url;
    // Response robust mapping
    const categoryName = payload?.name || payload?.category?.name || slug;

    // Products could be under payload.products or payload.data
    const rawProducts = Array.isArray(payload?.products)
      ? payload.products
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    console.log('Kategori ürünleri:', rawProducts);

    const mappedProducts = rawProducts.map((item: any, index: number) => {
      // Media array'inden ilk resmi al
      const firstImage = item.media && item.media.length > 0 
        ? item.media[0].original_url 
        : '/images/placeholder.svg';
      
      return {
        name: item.name || `Ürün ${index + 1}`,
        imgSrc: firstImage,
        productLink: `/product/${item.slug}`,
        slug: item.slug || `product-${index + 1}`,
        rating: item.rating ? parseFloat(item.rating) : null,
        priceCurrent: item.price || item.priceCurrent || 'Fiyat Belirtilmemiş',
        priceOriginal: item.old_price || item.priceOriginal || null,
      };
    });

    return { categoryName, products: mappedProducts, logoUrl };
  } catch (error: any) {
    console.warn('⚠️ Category fetch failed:', error instanceof Error ? error.message : 'Unknown error');
    return { 
      categoryName: slug, 
      products: [] 
    };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  console.log('📂 Category page rendering...', resolvedParams.slug);
  
  // Server-side'da veri çek
  const { categoryName, products, logoUrl } = await fetchCategoryProducts(resolvedParams.slug);
  const categories = await fetchCategories();
  
  console.log('📊 Final products for render:', products.length);

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header categories={categories}  logoSrc={logoUrl}/>
      <main className="flex-fill mt-3 pb-4">
        <div className="container py-4">
          <h1 className="text-center mb-4 text-capitalize">{categoryName}</h1>
          {products.length > 0 ? (
            <ProductGrid products={products} productType="default" />
          ) : (
            <div className="container text-center py-5">
              <h3>Bu kategoride ürün bulunamadı</h3>
              <p>Lütfen daha sonra tekrar deneyin.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
