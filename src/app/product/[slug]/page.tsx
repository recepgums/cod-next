import React from 'react';
import { headers } from 'next/headers';
import '../Nova.css';
import '../product-details.css'
import LightTemplate from './LightTemplate';
import RefUrlScript from './RefUrlScript';

// Regular imports for server components (no dynamic with ssr: false)
import PixelScripts from './PixelScripts';
import ImageOnlyTemplate from './ImageOnlyTemplate';
import TwoStepLandingTemplate from './TwoStepLandingTemplate';
import NovaTemplate from './NovaTemplate';
import ReviewTemplate from './ReviewTemplate';

interface ProductOption {
  quantity: number;
  price: number;
  original?: number;
  discount: number;
  badge: string;
  isCampaign?: boolean;
  unit?: string;
  displayText?: string;
  finalDiscount?: number;
}

interface ProductComment {
  id: number;
  author: string;
  content: string;
  rating: number;
  photo?: string;
  order?: number | null;
}

interface ProductImage {
  thumbnail: string;
  medium: string;
  large: string;
  mobile: string;
  original: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  images: ProductImage[];
  options: ProductOption[];
  features: string[];
  rating: number;
  commentCount: number;
  comments: ProductComment[];
  cities: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string;
  logoUrl?: string;
  content?: string;
  settings?: string;
}

import type { Metadata } from "next";

// Server-side data fetching
async function fetchProductData(slug: string) {
  try {
    // Get the current domain from headers
    const h = await headers();
    const host = h.get('host') || 'trendygoods.com.tr';
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/product/${slug}`,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)',
      },
      //  ...(process.env.NEXT_IS_LOCAL === 'local'
      //    ? { cache: 'no-store' as const }
      //    : { next: { revalidate: 300 as const } }),
    });

    if (!response.ok) {
      throw new Error(`Product API failed: ${response.status}`);
    }

    const data = await response.json();
    const productData = data.product;
    const commentsData = data.comments;
    const pixelsData = data.pixels;
    const templateData = data.template;
    console.log(`🔍 Fetching product data for slug:`,data);

    const citiesData = Array.isArray(data.cities) ? data.cities : [];
    
    // Merge all data into product object
    const product: Product = {
          ...productData,
          comments: Array.isArray(commentsData) ? commentsData : [],
          cities: Array.isArray(citiesData) ? citiesData : [],
          pixels: Array.isArray(pixelsData) ? pixelsData : [],
          template: templateData,
          // template: "nova",
      logoUrl: data.logoUrl,
    };

    return { product };
    
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return { product: null };
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;

  // Get the current domain from headers
  const h = await headers();
  const host = h.get('host') || 'trendygoods.com.tr';
  const protocol = h.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;
  
  const { product } = await fetchProductData(slug);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı - TrendyGoods',
      description: 'Aradığınız ürün bulunamadı.',
      openGraph: {
        title: 'Ürün Bulunamadı - TrendyGoods',
        description: 'Aradığınız ürün bulunamadı.',
        url: `${origin}/product/${slug}`,
        siteName: 'TrendyGoods',
        locale: 'tr_TR',
        type: 'website',
      },
    };
  }

  // Ürün açıklaması için content veya features kullan
  const description = product.content 
    ? product.content.substring(0, 160) 
    : product.features && product.features.length > 0 
      ? product.features.slice(0, 3).join(', ') 
      : `${product.name} ürününü TrendyGoods'da keşfedin. ${product.oldPrice ? `${product.price}₺ (${product.discount} indirim)` : `${product.price}₺`}`;

  // Ürün resmi URL'si
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].large 
    : `${origin}/images/placeholder.svg`;

  // Ürün URL'si
  const productUrl = `${origin}/product/${slug}`;

  return {
    title: `${product.name}`,
    description: description,
    keywords: [
      product.name,
      'TrendyGoods',
      'online alışveriş',
      'kapıda ödeme',
      'ücretsiz kargo',
      ...(product.features || [])
    ].join(', '),
    openGraph: {
       title: product.name,
       description: description,
       url: productUrl,
       siteName: 'TrendyGoods',
       locale: 'tr_TR',
       type: 'website',
       images: [
         {
           url: imageUrl,
           width: 1200,
           height: 630,
           alt: product.name,
         }
       ],
     },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const { product } = await fetchProductData(slug);
  

  if (!product) {
    return (
      <div className="container text-center py-5">
        <h3>Ürün bulunamadı</h3>
        <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
      </div>
    );
  }

  // Template selection based on product data
  const renderTemplate = () => {
    switch (product.template) {
      case 'nova':
        return <NovaTemplate product={product} />;
      case 'reviews':
        return <ReviewTemplate product={product} />;
      case 'light':
        return <LightTemplate product={product} />;
      case 'image':
    return <ImageOnlyTemplate product={product} />;
      case '2step':
        return <TwoStepLandingTemplate product={product} />;
      default:
    return <NovaTemplate product={product} />;
  }
  };

  return (
    <>
      <RefUrlScript />
      {renderTemplate()}
      <PixelScripts pixels={product.pixels || []} product={product} />
    </>
  );
} 