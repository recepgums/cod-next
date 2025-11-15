import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import '../Nova.css';
import '../product-details.css'
import LightTemplate from './LightTemplate';
import RefUrlScript from './RefUrlScript';
import Header from '../../components/Header';

// Regular imports for server components (no dynamic with ssr: false)
import PixelScripts from './PixelScripts';
import ImageOnlyTemplate from './ImageOnlyTemplate';
import TwoStepLandingTemplate from './TwoStepLandingTemplate';
import NovaTemplate from './NovaTemplate';
import ReviewTemplate from './ReviewTemplate';
import TekstilTemplate from './TekstilTemplate';
import { isBotRequest } from '../../utils/botDetection';
import ProductNotificationClient from './ProductNotificationClient';

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

interface ProductSettings {
  cloaker_url?: string;
  quantity_price?: string;
  quantity_discount?: string;
  alias?: string;
  cash_payment_cost?: string;
  card_payment_cost?: string;
  supply_cost?: string;
  is_campaign?: string;
  unit?: string;
  variants?: any[];
  ad_cost?: string;
  og_title?: string;
  quantity_display_text?: string;
  quantity_images?: string;
  cargo_price?: string;
  upsell_product_id?: string;
  upsell_discount?: string;
  is_whatsapp_homepage?: string;
  order_form_type?: string;
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
  categories: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string;
  logoUrl?: string;
  content?: string;
  settings?: string;
  related_products?: any[];
  cloaker_url?: string;
  merchant?: any;
  isSendNotification?: boolean;
}

import type { Metadata } from "next";

// Server-side data fetching
async function fetchProductData(slug: string) {
  try {
    // Get the current domain from headers
    const h = await headers();
    const host = h.get('host');
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_IS_LOCAL == "true" ?  "https://trendygoods.com.tr" : `${protocol}://${host}`;

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
    const productData = data?.product;
    const commentsData = data?.comments?.data;
    const pixelsData = data?.pixels;
    const templateData = data?.template;
    const merchantData = data?.merchant;
    const isSendNotification = JSON.parse(data?.product?.settings).send_notification == "1";
    console.log(isSendNotification);
    console.log(`🔍 Fetching product data for slug:`,data);

    const citiesData = Array.isArray(data?.cities) ? data?.cities : [];
    const categoriesData = Array.isArray(data?.categories) ? data?.categories : [];
    const relatedProductsData = Array.isArray(data?.related_products) ? data?.related_products : [];
    
    // Parse settings JSON to extract cloaker_url
    let cloakerUrl = data.cloaker_url || productData.cloaker_url;
    let settingsStr = productData.settings || '';
    
    if (productData.settings) {
      try {
        // Parse settings JSON to extract cloaker_url
        const parsedSettings = typeof productData.settings === 'string' 
          ? JSON.parse(productData.settings) 
          : productData.settings;
        
        cloakerUrl = parsedSettings.cloaker_url || cloakerUrl;
        settingsStr = typeof productData.settings === 'string' ? productData.settings : JSON.stringify(productData.settings);
        
        console.log(`📦 Parsed settings - cloaker_url: ${parsedSettings.cloaker_url}`);
      } catch (error) {
        console.error('❌ Error parsing settings JSON:', error);
        settingsStr = typeof productData.settings === 'string' ? productData.settings : JSON.stringify(productData.settings);
      }
    }
    
    // Merge all data into product object
    const product: Product = {
          ...productData,
          comments: Array.isArray(commentsData) ? commentsData : [],
          cities: Array.isArray(citiesData) ? citiesData : [],
          categories: Array.isArray(categoriesData) ? categoriesData : [],
          pixels: Array.isArray(pixelsData) ? pixelsData : [],
          related_products: Array.isArray(relatedProductsData) ? relatedProductsData : [],
          template: process.env.NEXT_IS_LOCAL == "true" ? templateData : templateData,
          logoUrl: data.logoUrl,
          settings: settingsStr,
          cloaker_url: cloakerUrl,
          merchant: merchantData,
          isSendNotification: isSendNotification
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
  const host = h.get('host');
  const protocol = h.get('x-forwarded-proto') || 'https';
  const origin = `${protocol}://${host}`;
  
  const { product } = await fetchProductData(slug);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
      description: 'Aradığınız ürün bulunamadı.',
      openGraph: {
        title: 'Ürün Bulunamadı',
        description: 'Aradığınız ürün bulunamadı.',
        url: `${origin}/product/${slug}`,
        siteName: product?.merchant?.name ,
        locale: 'tr_TR',
        type: 'website',
      },
    };
  }

  // Ürün açıklaması için content veya features kullan
  const description = 
   Array.isArray(product.features) && product.features.length > 0
      ? product.features.slice(0, 3).map(f => f).join(', ')
      : `${product.name} ürününü ${product.merchant?.name || 'Sayfa'}'da keşfedin. ${product.oldPrice ? `${product.price}₺ (${product.discount} indirim)` : `${product.price}₺`}`;

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
      'online alışveriş',
      'kapıda ödeme',
      'ücretsiz kargo',
      ...(product.features || [])
    ].join(', '),
    openGraph: {
       title: product.name,
       description: description,
       url: productUrl,
       siteName: product?.merchant?.name,
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

  // Bot tespiti ve cloaker_url redirect kontrolü
  const isBot = await isBotRequest();
  
  if (isBot && product.cloaker_url) {
    console.log(`🤖 Bot detected! Redirecting to cloaker_url: ${product.cloaker_url}`);
    redirect(product.cloaker_url);
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
      case 'tekstil':
        return <TekstilTemplate product={product} />;
      default:
    return <NovaTemplate product={product} />;
  }
  };

  return (
    <>
      <RefUrlScript />
      {/* Floating notification every 40s */}
      {(product.template != '2step' && product.isSendNotification) ?(
        <ProductNotificationClient />
      ): null}
      {renderTemplate()}
      <PixelScripts pixels={product.pixels || []} product={product} />
    </>
  );
} 