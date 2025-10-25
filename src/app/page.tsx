import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
 

// Server Component - SSR ile veri çekme
async function fetchProducts() {
  try {
    // Get the current domain from headers
    const h = await headers();
    const host = h.get('host') || 'trendygoods.com.tr';
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl =  process.env.NEXT_IS_LOCAL == "true" ?  "https://trendygoods.com.tr" : `${protocol}://${host}`;

    const directRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
      // next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)', // Daha gerçekçi user-agent
      },
    });
    console.log("api url", process.env.NEXT_PUBLIC_API_URL);
    
    if (!directRes.ok) {
      console.warn('⚠️ Laravel API failed:', directRes.status, directRes.statusText);
      throw new Error(`Laravel API failed: ${directRes.status}`);
    }
    
    const directData = await directRes.json();
    console.log(directData.categories);

    if (directData?.main_product_slug) {
      console.log('✅ Redirecting to main product:', directData.main_product_slug);
      const targetSlug = String(directData.main_product_slug);
      redirect(`/product/${targetSlug}`);
    } else {
      console.log('✅ No main product slug found');
    }
    
    const productsArray = directData.products || [directData?.product];
    
    if (productsArray.length === 0) {
      console.warn('⚠️ No products found in API response');
      return { products: [], logoSrc: directData?.logoUrl || null };
    }
    
    const mappedProducts = productsArray.map((item: any, index: number) => {
      
      return {
        name: item.name || `Ürün ${index + 1}`,
        imgSrc: item.productImg || '/images/placeholder.svg',
        productLink: `/product/${item.slug}`,
        slug: item.slug || `product-${index + 1}`,
        rating: item.rating ? parseFloat(item.rating) : null, // String'den number'a çevir
        priceCurrent: item.price || item.priceCurrent || 'Fiyat Belirtilmemiş',
        priceOriginal: item.originalPrice || item.priceOriginal || null,
      };
    });
    
    console.log('✅ Products mapped successfully:', mappedProducts.length);
    return { products: mappedProducts, logoSrc: directData?.logoUrl || null, categories: directData?.categories };
    
  } catch (error: any) {
    console.log(error);
    // Allow Next.js redirects to bubble up (do not swallow)
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.warn('⚠️ API fetch failed:', error instanceof Error ? error.message : 'Unknown error');
    // Fallback: Boş array yerine test verisi döndür
    console.log('🔄 Returning fallback test data...');
    return { products: [
       {
         name: 'Test Ürün 1',
         imgSrc: '/images/placeholder.svg',
         productLink: '/product/test-urun-1',
         slug: 'test-urun-1',
         rating: 4.5, // Number olarak
         priceCurrent: '99.99 TL',
         priceOriginal: null,
       },
       {
         name: 'Test Ürün 2',
         imgSrc: '/images/placeholder.svg',
         productLink: '/product/test-urun-2',
         slug: 'test-urun-2',
         rating: null,
         priceCurrent: '149.99 TL',
         priceOriginal: '199.99 TL',
       }
     ], logoSrc: null };
  }
}

export default async function Home() {
  console.log('🏠 Home page rendering...');
  
  // Server-side'da veri çek
  const {products, logoSrc, categories} = await fetchProducts();
  
  console.log('📊 Final products for render:', products.length);

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header logoSrc={logoSrc || undefined} categories={categories} />
      <main className="flex-fill mt-3 pb-4">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="container text-center py-5">
            <h3>Ürünler yükleniyor...</h3>
            <p>API'den veri alınamadı. Lütfen daha sonra tekrar deneyin.</p>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}