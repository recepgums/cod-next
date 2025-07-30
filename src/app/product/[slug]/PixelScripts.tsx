"use client";
import React from "react";
import Head from "next/head";

export default function PixelScripts({ pixels, product }: { pixels: any[]; product: any }) {
  if (!pixels || !Array.isArray(pixels)) return null;
  const facebookPixels = pixels.filter(p => p.platform === 'facebook');
  const tiktokPixel = pixels.find(p => p.platform === 'tiktok');
  return (
    <Head>
      {facebookPixels.map((pixel, idx) => (
        <React.Fragment key={pixel.pixel_id || idx}>
          <script
            dangerouslySetInnerHTML={{
              __html: `
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
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixel.pixel_id}&ev=PageView&noscript=1`}
            />
          </noscript>
        </React.Fragment>
      ))}
      {tiktokPixel && product && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
                s.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${tiktokPixel.pixel_id}';
                s.async = true;
                s.onload = function() {
                  ttq.page();
                  ttq.track('ViewContent', {
                    content_id: '${product.id}',
                    content_type: 'product',
                    content_name: '${product.name}',
                    currency: 'TRY',
                    value: ${product.price}
                  });
                };
                d.head.appendChild(s);
              }(window, document, 'ttq');
            `,
          }}
        />
      )}
    </Head>
  );
} 