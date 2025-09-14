import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Server-side data fetching
async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://codpanel.com.tr/api';
    console.log('Fetching from:', `${apiUrl}/homepage`);
    
    const res = await fetch(`${apiUrl}/homepage`, {
      cache: 'no-store', // Her istekte fresh data almak için
      headers: {
        'User-Agent': 'Next.js Server',
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('API Response:', data);
    
    const productsArray = data.products || [];
    return productsArray.map((item: any) => ({
      name: item.name,
      imgSrc: (item.images && item.images.length > 0 && item.images[0].thumbnail) 
        ? item.images[0].thumbnail 
        : item.productImg || '/images/1.webp', // fallback image
      productLink: item.productLink || '',
      slug: item.slug || '',
      rating: item.rating || null,
      priceCurrent: item.priceCurrent,
      priceOriginal: item.priceOriginal || null,
    }));
  } catch (e) {
    console.error('Error fetching products:', e);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

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
