import React from 'react';
import Header from '../../components/Header';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

// Server Component - SSR ile veri çekme
async function fetchCategoryProducts(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${slug}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://trendygoods.com.tr',
        'Referer': `${process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://trendygoods.com.tr'}/`,
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

    // Response robust mapping
    const categoryName = payload?.name || payload?.category?.name || slug;

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

    return { categoryName, products: mappedProducts };
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
  const { categoryName, products } = await fetchCategoryProducts(resolvedParams.slug);
  
  console.log('📊 Final products for render:', products.length);

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header />
      <main className="flex-fill mt-3 pb-4">
        <div className="container py-4">
          <h1 className="text-center mb-4">{categoryName}</h1>
          {products.length > 0 ? (
            <ProductGrid products={products} />
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
