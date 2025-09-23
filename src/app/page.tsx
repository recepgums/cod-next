import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import React from 'react';

// Server Component - SSR ile veri çekme
async function fetchProducts() {
  try {
    console.log('🔍 Fetching products from API...');
    
    // Önce direkt Laravel API'yi dene (proxy sorunlarını bypass et)
    const directRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!directRes.ok) {
      console.warn('⚠️ Laravel API failed:', directRes.status, directRes.statusText);
      throw new Error(`Laravel API failed: ${directRes.status}`);
    }
    
    const directData = await directRes.json();
    console.log('✅ API Response received:', {
      productsCount: directData.products?.length || 0,
      firstProduct: directData.products?.[0] ? Object.keys(directData.products[0]) : 'No products'
    });
    
    const productsArray = directData.products || [];
    
    if (productsArray.length === 0) {
      console.warn('⚠️ No products found in API response');
      return [];
    }
    
    const mappedProducts = productsArray.map((item: any, index: number) => {
      console.log(`📦 Processing product ${index + 1}:`, {
        name: item.name,
        slug: item.slug,
        hasImage: !!item.productImg,
        imageUrl: item.productImg
      });
      
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
    return mappedProducts;
    
  } catch (error) {
    console.warn('⚠️ API fetch failed:', error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback: Boş array yerine test verisi döndür
    console.log('🔄 Returning fallback test data...');
    return [
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
     ];
  }
}

export default async function Home() {
  console.log('🏠 Home page rendering...');
  
  // Server-side'da veri çek
  const products = await fetchProducts();
  
  console.log('📊 Final products for render:', products.length);

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header />
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