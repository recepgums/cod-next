"use client";
import React from "react";
import { loadPixelScripts } from "../../components/ScriptLoader";

export default function PixelScripts({ pixels, product }: { pixels: any[]; product: any }) {
  React.useEffect(() => {
    // ScriptLoader'dan loadPixelScripts fonksiyonunu çağır
    loadPixelScripts(pixels, product);
  }, [pixels, product]);

  return null; // Bu component artık hiçbir şey render etmiyor
} 