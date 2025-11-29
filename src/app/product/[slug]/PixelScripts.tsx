"use client";
import React from "react";
import { loadPixelScripts } from "../../components/ScriptLoader";

export default function PixelScripts({ pixels, product }: { pixels: any[]; product: any }) {
  React.useEffect(() => {
    // ScriptLoader'dan loadPixelScripts fonksiyonunu çağır
    try {
      console.log('🧩 PixelScripts:effect', {
        host: typeof window !== 'undefined' ? window.location.host : 'ssr',
        pixelsCount: Array.isArray(pixels) ? pixels.length : 0,
        platforms: Array.isArray(pixels) ? pixels.map((p: any) => p.platform) : [],
        productId: product?.id,
        productName: product?.name
      });
    } catch {}
    loadPixelScripts(pixels, product);
  }, [pixels, product]);

  return null; // Bu component artık hiçbir şey render etmiyor
} 