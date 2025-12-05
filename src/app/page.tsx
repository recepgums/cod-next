import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
 

// Server Component - SSR ile veri çekme
async function fetchProducts() {
  try {
    // Get the current domain from headers
    const h = await headers();
    const host = h.get('host');
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl =  process.env.NEXT_IS_LOCAL == "true" ?  "https://trendygoods.com.tr" : `${protocol}://${host}`;

    const directRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
      headers: {
        'Accept': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)', // Daha gerçekçi user-agent
      },
      cache: 'no-store', // Türkçe karakter sorunu nedeniyle cache kapalı
    });
    
    if (!directRes.ok) {
      throw new Error(`Laravel API failed: ${directRes.status}`);
    }
    
    // Türkçe karakter sorununu önlemek için text olarak alıp parse ediyoruz
    const text = await directRes.text();
    const directData = JSON.parse(text);

    if (directData?.main_product_slug) {
      const targetSlug = String(directData.main_product_slug);
      redirect(`/product/${targetSlug}`);
    } else {
    }
    
    const productsArray = directData.products || [directData?.product];
    
    if (productsArray.length === 0) {
      return { products: [], logoSrc: directData?.logoUrl || null };
    }
    
    const mappedProducts = productsArray.map((item: any, index: number) => {
      
      return {
        name: item.name || `Ürün ${index + 1}`,
        imgSrc: item.productImg || '/images/placeholder.svg',
        thumbnail_image_url: item.thumbnail_image_url,
        productLink: `/product/${item.slug}`,
        slug: item.slug || `product-${index + 1}`,
        rating: item.rating ? parseFloat(item.rating) : null, // String'den number'a çevir
        priceCurrent: item.price || item.priceCurrent || 'Fiyat Belirtilmemiş',
        priceOriginal: item.originalPrice || item.priceOriginal || null,
      };
    });
    
    return { products: mappedProducts, logoSrc: directData?.logoUrl || null, categories: directData?.categories, productType: directData?.merchant?.settings?.product_card_design == "modern" ? "tekstil": "type1" };
    
  } catch (error: any) {
    // Allow Next.js redirects to bubble up (do not swallow)
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.log(error);
    // Fallback: Boş array yerine test verisi döndür
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

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get('host');
  const protocol = h.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;
  
  try {
    const baseUrl = process.env.NEXT_IS_LOCAL == "true" ? "https://trendygoods.com.tr" : `${protocol}://${host}`;
    const directRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
      headers: {
        'Accept': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)',
      },
      cache: 'no-store', // Türkçe karakter sorunu nedeniyle cache kapalı
    });
    
    if (directRes.ok) {
      // Türkçe karakter sorununu önlemek için text olarak alıp parse ediyoruz
      const text = await directRes.text();
      const directData = JSON.parse(text);
      const merchantLogo = directData?.logoUrl || directData?.merchant?.logo_url || null;
      
      return {
        title: directData?.merchant?.name || 'Kapıda Ödemeli Alışveriş',
        description: `${directData?.merchant?.name || 'Online'} - Kapıda ödemeli alışveriş`,
        openGraph: {
          title: directData?.merchant?.name || 'Kapıda Ödemeli Alışveriş',
          description: `${directData?.merchant?.name || 'Online'} - Kapıda ödemeli alışveriş`,
          url: origin,
          siteName: directData?.merchant?.name || 'Site',
          locale: 'tr_TR',
          type: 'website',
          images: merchantLogo ? [
            {
              url: merchantLogo,
              width: 1200,
              height: 630,
              alt: directData?.merchant?.name || 'Logo',
            }
          ] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: directData?.merchant?.name || 'Kapıda Ödemeli Alışveriş',
          description: `${directData?.merchant?.name || 'Online'} - Kapıda ödemeli alışveriş`,
          images: merchantLogo ? [merchantLogo] : [],
        },
      };
    }
  } catch {}
  
  return {
    title: 'Kapıda Ödemeli Alışveriş',
    description: 'Kapıda ödemeli alışveriş',
  };
}

export default async function Home() {
  
  // Server-side'da veri çek
  const {products, logoSrc, categories, productType} = await fetchProducts();
  

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Header logoSrc={logoSrc || undefined} categories={categories} />
      <main className="flex-fill mt-3 pb-4">
        {products.length > 0 ? (
          <ProductGrid products={products} productType={productType} />
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