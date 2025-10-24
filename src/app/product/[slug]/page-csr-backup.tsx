'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../Nova.css';
import '../product-details.css'

import axios from 'axios';
import dynamic from 'next/dynamic';
import LightTemplate from './LightTemplate';
const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });
const ImageOnlyTemplate = dynamic(() => import('./ImageOnlyTemplate'), { ssr: false });
const TwoStepLandingTemplate = dynamic(() => import('./TwoStepLandingTemplate'), { ssr: false });
const NovaTemplate = dynamic(() => import('./NovaTemplate'), { ssr: false });
const ReviewTemplate = dynamic(() => import('./ReviewTemplate'), { ssr: false });

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
  categories?: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string; // Added for 2-step template
  logoUrl?: string; // Dynamic logo URL
  content?: string; // Added for product content
  settings?: string; // Added for product settings including variants
}

declare global {
  interface Window {
    Masonry?: any;
  }
}


export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {

  // State for gallery
  const { slug } = React.use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    if (!slug) return; // Wait for router to be ready

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/${slug}`)
      .then(res => {
        const productData = res.data.product;
        const commentsData = res.data.comments;
        const pixelsData = res.data.pixels;
        const templateData = res.data.template;
        const citiesData = Array.isArray(res.data.cities) ? res.data.cities : [];
        
        // Merge comments into product data
        const product = {
          ...productData,
          comments: Array.isArray(commentsData) ? commentsData : [],
          cities: Array.isArray(citiesData) ? citiesData : [],
          pixels: Array.isArray(pixelsData) ? pixelsData : [],
          template: templateData,
          logoUrl: res.data.logoUrl, // Logo is in the outer response object
          // template: "nova",
          // template: "light",
          settings: productData.settings // Include settings for variants
        };

        setProduct(product);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [slug]);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="text-center">
          <h4>Ürün bulunamadı</h4>
          <p>Lütfen tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  // Render different templates based on product.template
  if (product.template === "image") {
    return <ImageOnlyTemplate product={product} />;
  }
  if (product.template === "nova") {
    return <NovaTemplate product={product} />;
  }
  if (product.template === "light") {
    return <LightTemplate product={product} />;
  } 

  if (product.template === "2step") {
    return <TwoStepLandingTemplate product={product} />;
  }

  // Default template (review)
  return <ReviewTemplate product={product} />;
} 