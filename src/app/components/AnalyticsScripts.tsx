'use client';

import { useEffect } from 'react';

const AnalyticsScripts: React.FC = () => {
  useEffect(() => {
    // TikTok Pixel Code
    (function (w: any, d: any, t: any) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
        }
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t: any) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e
      }, ttq.load = function (e: any, n: any) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner;
        ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = r, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
        n = document.createElement("script");
        n.type = "text/javascript", n.async = !0, n.src = r + "?sdkid=" + e + "&lib=" + t;
        e = document.getElementsByTagName("script")[0];
        e.parentNode.insertBefore(n, e)
      };

      ttq.load("COCFFQBC77U3RPP2KRIG");
      ttq.page();
    })(window, document, 'ttq');

    // Facebook Pixel Code
    (function(f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    })(window, document, 'script',
      'https://connect.facebook.net/en_US/fbevents.js', null, null, null);
    (window as any).fbq('init', "1512181132850860");
    (window as any).fbq('track', 'PageView');

    // Google Analytics Code
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(arguments); }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', "G-6WZY6VLXMF");

    // Modal Legal Links Script
    document.querySelectorAll('.legal-link').forEach(link => {
      link.addEventListener('click', function(this: HTMLElement, e: Event) {
        e.preventDefault();
        const key = (this as any).dataset.key;
        const modal = new (window as any).bootstrap.Modal(document.getElementById('contentModal'));
        
        fetch(`/legal/${key}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            document.getElementById('contentModalLabel')!.textContent = data.title;
            document.querySelector('#contentModal .modal-body')!.innerHTML = data.html;
            modal.show();
          })
          .catch(error => {
            console.error('Error:', error);
            document.getElementById('contentModalLabel')!.textContent = 'Hata';
            document.querySelector('#contentModal .modal-body')!.innerHTML = 
              '<div class="alert alert-danger">İçerik yüklenirken bir hata oluştu.</div>';
            modal.show();
          });
      });
    });

    // Video Playback on Scroll for Product Details
    let video1 = document.getElementById('video1') as HTMLVideoElement;
    let video2 = document.getElementById('video2') as HTMLVideoElement;

    if (video1 || video2) {
      window.addEventListener('scroll', function() {
        if (video1) video1.play();
        if (video2) video2.play();
      });
    }

    // Add to Cart and Variant Selection Script
    const createVariantFields = (productId: string, variants: any[]) => {
      console.log('Creating variant fields for product:', productId, variants);
      const variantContainer = document.getElementById(`variant-container-${productId}`);
      if (!variantContainer) {
        console.error('Variant container not found for product:', productId);
        return;
      }
      if (!variants || variants.length === 0) {
        console.log('No variants found for product:', productId);
        return;
      }

      const groupedVariants: any = {};
      variants.forEach(variant => {
        if (!groupedVariants[variant.type]) {
          groupedVariants[variant.type] = [];
        }
        groupedVariants[variant.type].push(variant);
      });

      variantContainer.innerHTML = '';

      Object.entries(groupedVariants).forEach(([type, options]) => {
        const selectWrapper = document.createElement('div');
        selectWrapper.className = 'variant-item';

        const label = document.createElement('label');
        label.className = 'variant-label';
        label.textContent = type + ' Seçin';
        selectWrapper.appendChild(label);

        const select = document.createElement('select');
        select.name = `variants[${productId}][${type}]`;
        select.className = 'form-control';
        select.required = true;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = type + ' Seçin';
        select.appendChild(defaultOption);
       
        (options as any[]).forEach((variant: any) => {
          const option = document.createElement('option');
          option.value = variant.name;
          option.textContent = `${variant.name} ${variant.stock <= 0 ? '(Tükendi)' : ''}`;
          if (variant.stock <= 0) option.disabled = true;
          select.appendChild(option);
        });

        selectWrapper.appendChild(select);
        variantContainer.appendChild(selectWrapper);
      });
    };

    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function(this: HTMLElement, e: Event) {
        e.preventDefault();
        const buttonElement = this as HTMLButtonElement;
        const productName = buttonElement.dataset.productName;
        const productPrice = buttonElement.dataset.productPrice;
        const productId = buttonElement.dataset.productId;
        
        const variantContainer = document.getElementById(`variant-container-${productId}`);
        if (variantContainer) {
          let isValid = true;
          variantContainer.querySelectorAll('select').forEach(select => {
            if (!(select as HTMLSelectElement).value) {
              isValid = false;
              select.classList.add('is-invalid');
            } else {
              select.classList.remove('is-invalid');
            }
          });

          if (!isValid) {
            alert('Lütfen tüm varyant seçeneklerini seçiniz.');
            return;
          }
        }
        
        const variants: any = {};
        if (variantContainer) {
          variantContainer.querySelectorAll('select').forEach(select => {
            const name = (select as HTMLSelectElement).name;
            const match = name.match(/\[(.*?)\]\[(.*?)\]/);
            if (match && match.length >= 3) {
              const type = match[2];
              variants[type] = (select as HTMLSelectElement).value;
            }
          });
        }

        // Make AJAX request
        fetch(`https://trendygoods.com.tr/order/14458/add-to-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_name: productName,
            product_id: productId,
            product_price: productPrice,
            quantity: 1,
            variants: variants,
            _token: 'P37BPT3sjVcFuaTnbw4EDvLNkTjpQWHCptKWWMEj'
          })
        })
        .then(response => response.json())
        .then(data => {
          buttonElement.textContent = 'Sepete Eklendi';
          buttonElement.disabled = true;
          buttonElement.classList.add('btn-success');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Ürün sepete eklenirken bir hata oluştu.');
        });
      });
    });

  }, []);

  return null;
};

export default AnalyticsScripts; 