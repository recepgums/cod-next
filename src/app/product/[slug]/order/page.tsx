import OrderTemplate from './OrderTemplate';
import PixelScripts from '../PixelScripts';
import Header from '../../components/Header';
import { headers } from 'next/headers';

async function fetchProductData(slug: string) {
  const h = await headers();
  const forwardedHost = h.get('x-forwarded-host');
  const host = forwardedHost || h.get('host') || 'localhost';
  const proto = h.get('x-forwarded-proto') || 'https';
  const origin = `${proto}://${host}`;
  const referer = `${origin}/product/${slug}/order`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': origin,
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
      },
      ...(process.env.NEXT_IS_LOCAL === 'local'
        ? { cache: 'no-store' as const }
        : { next: { revalidate: 300 as const } }),
    }
  );
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();
  // Pixel bilgilerini product'a ekle
  return {
    ...data.product,
    pixels: data.pixels || []
  };
}

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductData(slug);
  return (
    <>
      <Header />
      <OrderTemplate slug={slug} product={product} />
      <PixelScripts pixels={product?.pixels || []} product={product} />
    </>
  );
}