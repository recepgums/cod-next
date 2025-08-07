'use client';

import { useEffect } from 'react';

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

  // Facebook Pixel 1
  const fbPixel1 = document.createElement('script');
  fbPixel1.innerHTML = `
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1512181132850860');
      fbq('track', 'PageView');
  `;
  document.head.appendChild(fbPixel1);

  // Facebook Pixel 2
  const fbPixel2 = document.createElement('script');
  fbPixel2.innerHTML = `
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1245776343632366');
      fbq('track', 'PageView');
  `;
  document.head.appendChild(fbPixel2);

  // TikTok Pixel
  const tiktokPixel = document.createElement('script');
  tiktokPixel.innerHTML = `
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

      var s = d.createElement('script');
      s.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=COCFFQBC77U3RPP2KRIG';
      s.async = true;

      s.onload = function() {
        ttq.page();
        ttq.track('ViewContent', {
          content_id: '1',
          content_type: 'product',
          content_name: 'MagnoGlow Lamba',
          currency: 'TRY',
          value: 499.00
        });
      };

      d.head.appendChild(s);
    }(window, document, 'ttq');
  `;
  document.head.appendChild(tiktokPixel);

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
  bootstrapJS.integrity = 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz';
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