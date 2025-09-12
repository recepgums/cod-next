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
    img.height = '1';
    img.width = '1';
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixel.pixel_id}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
  });

  // TikTok Pixels - Tek script ile tüm pixel'leri yükle
  if (tiktokPixels.length > 0) {
    const tiktokScript = document.createElement('script');
    tiktokScript.innerHTML = `
      console.log('🚀 Loading ${tiktokPixels.length} TikTok Pixels...');
      
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
          console.log('📱 Loading TikTok Pixel ${idx + 1}: ${pixel.pixel_id}');
          var s${idx} = d.createElement('script');
          s${idx}.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${pixel.pixel_id}';
          s${idx}.async = true;
          s${idx}.onload = function() {
            console.log('✅ TikTok Pixel ${idx + 1} loaded: ${pixel.pixel_id}');
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

// Global CSS and JS imports
const addGlobalScripts = () => {
  // Google Analytics
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-6WZY6VLXMF';
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

  // jQuery and other libraries
  const jquery = document.createElement('script');
  jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
  document.head.appendChild(jquery);

  const maskedInput = document.createElement('script');
  maskedInput.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js';
  document.head.appendChild(maskedInput);

  const inputMask = document.createElement('script');
  inputMask.src = 'https://cdnjs.cloudflare.com/ajax/libs/inputmask/5.0.7/jquery.inputmask.min.js';
  document.head.appendChild(inputMask);

  const masonry = document.createElement('script');
  masonry.src = 'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js';
  document.head.appendChild(masonry);

  // Bootstrap JS (version 5 - no jQuery required)
  const bootstrapJS = document.createElement('script');
  bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js';
  // Integrity hash'i kaldırdık
  bootstrapJS.crossOrigin = 'anonymous';
  bootstrapJS.defer = true;
  document.head.appendChild(bootstrapJS);
};

// Add CSS links
const addGlobalStyles = () => {
  // Google Fonts
  const robotoFont = document.createElement('link');
  robotoFont.rel = 'stylesheet';
  robotoFont.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Merriweather:wght@400;700&display=swap';
  document.head.appendChild(robotoFont);

  const spartanFont = document.createElement('link');
  spartanFont.rel = 'preload';
  spartanFont.href = 'https://fonts.googleapis.com/css2?family=Spartan:wght@400;700&display=swap';
  spartanFont.setAttribute('as', 'style');
  spartanFont.onload = function() {
    const link = this as HTMLLinkElement;
    link.onload = null;
    link.rel = 'stylesheet';
  };
  document.head.appendChild(spartanFont);

  // Font Awesome
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  document.head.appendChild(fontAwesome);
};

export default function ScriptLoader() {
  useEffect(() => {
    addGlobalScripts();
    addGlobalStyles();
  }, []);

  return null; // This component doesn't render anything
}

// PixelScripts fonksiyonunu export edelim
export { loadPixelScripts }; 