import OrderTemplate from './OrderTemplate';
import PixelScripts from '../PixelScripts';

async function fetchProductData(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
    {
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
    }
  );
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();
  return data.product;
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