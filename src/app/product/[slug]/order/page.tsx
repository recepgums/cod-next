import OrderTemplate from './OrderTemplate';
import PixelScripts from '../PixelScripts';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { isBotRequest } from '../../../utils/botDetection';

async function fetchProductData(slug: string) {
  // Get the current domain from headers
  const h = await headers();
  const host = h.get('host');
  const protocol = h.get('x-forwarded-proto') || 'https';
  const baseUrl = process.env.NEXT_IS_LOCAL == "true" ?  "https://trendygoods.com.tr" : `${protocol}://${host}`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/product/${slug}/order`,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
      },
      cache: 'no-store', // Türkçe karakter sorunu nedeniyle cache kapalı
    }
  );
  if (!response.ok) throw new Error('Failed to fetch product');
  // Türkçe karakter sorununu önlemek için text olarak alıp parse ediyoruz
  const text = await response.text();
  const data = JSON.parse(text);
  
  // Parse settings JSON to extract cloaker_url
  let cloakerUrl = data.cloaker_url || data.product?.cloaker_url;
  
  if (data.product?.settings) {
    try {
      const settingsStr = typeof data.product.settings === 'string' 
        ? data.product.settings 
        : JSON.stringify(data.product.settings);
      
      const parsedSettings = JSON.parse(settingsStr);
      cloakerUrl = parsedSettings.cloaker_url || cloakerUrl;
      
    } catch (error) {
      console.error('❌ Error parsing settings JSON:', error);
    }
  }
  
  // Pixel bilgilerini ve merchant'ı product'a ekle
  return {
    ...data.product,
    pixels: data.pixels || [],
    cloaker_url: cloakerUrl,
    merchant: data.merchant || null
  };
}

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProductData(slug);

  // Bot tespiti ve cloaker_url redirect kontrolü
  const isBot = await isBotRequest();
  
  if (isBot && product.cloaker_url) {
    redirect(product.cloaker_url);
  }

  return (
    <>
      <OrderTemplate slug={slug} product={product} />
      <PixelScripts pixels={product?.pixels || []} product={product} />
    </>
  );
}