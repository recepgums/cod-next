import OrderTemplate from './OrderTemplate';
import PixelScripts from '../PixelScripts';
import { headers } from 'next/headers';

async function fetchProductData(slug: string) {
  // Get the current domain from headers
  const h = await headers();
  const host = h.get('host') || 'trendygoods.com.tr';
  const protocol = h.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/product/${slug}/order`,
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
      <OrderTemplate slug={slug} product={product} />
      <PixelScripts pixels={product?.pixels || []} product={product} />
    </>
  );
}