'use client';

import { useEffect } from 'react';

// PixelScripts fonksiyonunu ScriptLoader içine taşıyalım
const loadPixelScripts = (pixels: any[], product: any) => {
  if (!pixels || !Array.isArray(pixels)) return;
  
  const facebookPixels = pixels.filter(p => p.platform === 'facebook');
  const tiktokPixels = pixels.filter(p => p.platform === 'tiktok');

  // Facebook Pixels
  facebookPixels.forEach((pixel, idx) => {
    const fbScript = document.createElement('script');
    fbScript.innerHTML = `
      !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixel.pixel_id}');
        fbq('track', 'PageView');
    `;
    document.head.appendChild(fbScript);

    // Noscript tag
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixel.pixel_id}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
  });

  // TikTok Pixels - Tek script ile tüm pixel'leri yükle
  if (tiktokPixels.length > 0) {
    const tiktokScript = document.createElement('script');
    tiktokScript.innerHTML = `
      
      !function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        var ttq = w[t] = w[t] || [];
        ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
        ttq.setAndDefer = function(t, e) {
          t[e] = function() {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
          }
        };
        for(var i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        
        // Tüm TikTok pixel'lerini yükle
        ${tiktokPixels.map((pixel, idx) => `
          var s${idx} = d.createElement('script');
          s${idx}.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${pixel.pixel_id}';
          s${idx}.async = true;
          s${idx}.onload = function() {
            try {} catch(e){}
            ttq.page();
            ttq.track('ViewContent', {
              content_id: '${product.id}',
              content_type: 'product',
              content_name: '${product.name.replace(/'/g, "\\'")}',
              currency: 'TRY',
              value: ${product.price}
            });
          };
          s${idx}.onerror = function() {
            console.error('❌ TikTok Pixel ${idx + 1} failed: ${pixel.pixel_id}');
          };
          d.head.appendChild(s${idx});
        `).join('')}
      }(window, document, 'ttq');
    `;
    document.head.appendChild(tiktokScript);
  }
};

// Global JS imports - sadece gerekli olanlar
const addGlobalScripts = () => {
  // Google Analytics
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-6WZY6VLXMF';
  gaScript.onload = () => { try {} catch {} };
  gaScript.onerror = () => { try { console.error('❌ GA gtag.js failed'); } catch {} };
  document.head.appendChild(gaScript);

  const gaConfig = document.createElement('script');
  gaConfig.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', "G-6WZY6VLXMF");
  `;
  document.head.appendChild(gaConfig);

  // TikTok global variables
  const tiktokScript = document.createElement('script');
  tiktokScript.innerHTML = `
    window.ttqList = [];
  `;
  document.head.appendChild(tiktokScript);

  // Bootstrap JS (version 5 - no jQuery required)
  const bootstrapJS = document.createElement('script');
  bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js';
  bootstrapJS.crossOrigin = 'anonymous';
  bootstrapJS.defer = true;
  document.head.appendChild(bootstrapJS);
};

// Icon CSS'lerini lazy load et (render-blocking degil)
const addIconStyles = () => {
  // Font Awesome - lazy load
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  fontAwesome.media = 'print'; // Baslangicta print olarak yukle
  fontAwesome.onload = function() {
    (this as HTMLLinkElement).media = 'all'; // Yuklendikten sonra all yap
  };
  document.head.appendChild(fontAwesome);

  // Flaticon - lazy load
  const flaticon = document.createElement('link');
  flaticon.rel = 'stylesheet';
  flaticon.href = 'https://cdn-uicons.flaticon.com/uicons-regular-straight/css/uicons-regular-straight.css';
  flaticon.media = 'print';
  flaticon.onload = function() {
    (this as HTMLLinkElement).media = 'all';
  };
  document.head.appendChild(flaticon);
};

export default function ScriptLoader() {
  useEffect(() => {
    addGlobalScripts();
    addIconStyles(); // Icon CSS'lerini lazy load et

    // Lightweight production diagnostics (safe for live)
    try {
      const w = (window as any);
      if (!w.__pixelDiag) {
        w.__pixelDiag = true;
        const host = window.location.host;

        // Script load errors (CSP/network)
        const onScriptError = (e: any) => {
          try {
            const target = e?.target as HTMLScriptElement | undefined;
            if (target && target.tagName === 'SCRIPT') {
              const src = target.src;
              // console.error('❌ Script load error', { src, host });
            }
          } catch {}
        };
        window.addEventListener('error', onScriptError, true);

        // fbq/ttq availability poll (5 attempts)
        let polls = 0;
        const poll = () => {
          polls++;
          const fbq = (window as any).fbq;
          const ttq = (window as any).ttq;
          if (polls < 5 && (!fbq || !ttq)) setTimeout(poll, 1000);
        };
        setTimeout(poll, 400);
      }
    } catch {}
  }, []);

  return null; // This component doesn't render anything
}

// PixelScripts fonksiyonunu export edelim
export { loadPixelScripts }; 