'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../product-details.css'
import axios from 'axios';
import Footer from '../../components/Footer';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });
const ImageOnlyTemplate = dynamic(() => import('./ImageOnlyTemplate'), { ssr: false });
const TwoStepLandingTemplate = dynamic(() => import('./TwoStepLandingTemplate'), { ssr: false });
const NovaTemplate = dynamic(() => import('./NovaTemplate'), { ssr: false });

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

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  images: string[];
  options: ProductOption[];
  features: string[];
  rating: number;
  commentCount: number;
  comments: ProductComment[];
  cities: any[];
  pixels?: { platform: string; pixel_id: string }[];
  template?: string; // Added for 2-step template
  content?: string; // Added for product content
  settings?: string; // Added for product settings including variants
}

declare global {
  interface Window {
    Masonry?: any;
  }
}


const announcementTexts = [
  '💰 Kapıda Ödeme Seçeneği 💰',
  '❤️ Şeffaf Kargolu ❤️',
  '⭐ +10.000 Mutlu Müşteri ⭐',
];
export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {

  // State for gallery
  const { slug } = React.use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  

  const [mainImg, setMainImg] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [timer, setTimer] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [deliveryDates, setDeliveryDates] = useState({ start: '', end: '' });

  const commentGridRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const selectOption = (option: any) => {
    setSelectedOption(option);
  };

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
          settings: productData.settings // Include settings for variants
        };

        setProduct(product);
        if (productData.options && productData.options.length > 0) {
          setSelectedOption(productData.options[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });

    // setProduct(
    //     {
    //       "product": {
    //           "id": 36,
    //           "slug": "masaj-tabancası",
    //           "name": "MASAJ TABANCASI",
    //           "price": 999,
    //           "oldPrice": 1499,
    //           "discount": "%33 indirim",
    //           "rating": 4.5,
    //           "commentCount": 34,
    //           "productLink": "/products/masaj-tabancası",
    //           "sold": 5000,
    //           "productImg": "http:10.171.220.230/storage/194/2.png",
    //           "images": [
    //               "http:10.171.220.230/storage/194/2.png",
    //               "http:10.171.220.230/storage/195/3.png",
    //               "http:10.171.220.230/storage/196/4-BAŞLIKLI-MASAJ-ALETİ.png",
    //               "http:10.171.220.230/storage/197/4.png",
    //               "http:10.171.220.230/storage/198/5.png",
    //               "http:10.171.220.230/storage/199/6.png",
    //               "http:10.171.220.230/storage/200/7.png"
    //           ],
    //           "features": [
    //               "🎯 Yorgun Kaslara Anında Rahatlama!\r\n📌 Şarj Edilebilir Derin Doku Masaj Aleti ile günün tüm stresini geride bırakın.",
    //               "💪 Profesyonel Masaj Deneyimi, Ev Konforunda!\r\n✔ Derin doku terapisi ile kas ağrılarını hedef alır\r\n✔ Titreşimli başlıklar sayesinde gerginliği hızla azaltır\r\n✔ Spor sonrası toparlanma sürecini destekler\r\n✔ Sessiz motor, güçlü performans\r\n✔ Kompakt, hafif ve taşınabilir\r\n🔋 Uzun ömürlü şarjlı batarya – kablo derdi yok!",
    //               "🏃‍♂ Sporcular, ofis çalışanları ve yoğun tempolular için ideal!\r\n👜 Çantanıza atın, her yere yanınızda götürün!"
    //           ],
    //           "options": [
    //               {
    //                   "title": "1 Adet",
    //                   "quantity": 1,
    //                   "price": 999,
    //                   "discount": 0
    //               },
    //               {
    //                   "title": "2 Adet",
    //                   "quantity": 2,
    //                   "price": 1998,
    //                   "discount": 199
    //               }
    //           ],
    //           "settings": "{\"alias\":\"MASAJ TABANCASI\",\"quantity_price\":\"{\\\"1\\\":999,\\\"2\\\":1998}\",\"quantity_discount\":\"{\\\"1\\\":0,\\\"2\\\":199}\",\"cash_payment_cost\":null,\"card_payment_cost\":null,\"supply_cost\":\"305\",\"ad_cost\":\"150\",\"is_campaign\":null,\"cloaker_url\":null,\"og_title\":null,\"unit\":\"Adet\",\"variants\":[]}",
    //           "content": "<section style=\"font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; color: #333;\">\n\n  <div style=\"max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\">\n\n    <h2 style=\"font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 20px; text-align: center;\">MİNİ MASAJ ALETİ</h2>\n\n    <img src=\"https://bikolaysiparis.com/storage/306/4-BAŞLIKLI-MASAJ-ALETİ.png\" alt=\"Mini Masaj Aleti\" style=\"max-width:100%; height:auto; display:block; margin:0 auto; border-radius: 8px; margin-bottom: 20px;\">\n\n    <h3 style=\"font-size: 18px; color: #3498db; margin-bottom: 10px;\">Omuz ve Sırt Ağrılarına Son!</h3>\n    <p style=\"font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;\">Gün boyu oluşan gerginliği ve ağrıları hafifletmek için ideal çözüm.</p>\n\n    <h3 style=\"font-size: 18px; color: #3498db; margin-bottom: 10px;\">Farklı Başlıklarla Kişiselleştirilmiş Masaj</h3>\n    <p style=\"font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;\">Farklı masaj ihtiyaçlarınız için özel olarak tasarlanmış başlıklarla tam size göre.</p>\n\n    <img src=\"https://bikolaysiparis.com/storage/309/6.png\" alt=\"Mini Masaj Aleti Detay\" style=\"max-width:100%; height:auto; display:block; margin:0 auto; border-radius: 8px; margin-bottom: 20px;\">\n\n    <h3 style=\"font-size: 18px; color: #3498db; margin-bottom: 10px;\">Selülitlere Karşı Etkili Yardımcı</h3>\n    <p style=\"font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;\">Kan dolaşımını hızlandırarak selülit görünümünü azaltmaya yardımcı olur.</p>\n\n    <h3 style=\"font-size: 18px; color: #3498db; margin-bottom: 10px;\">Kablosuz Tasarım ile Özgürce Kullanım</h3>\n    <p style=\"font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;\">Şarjlı ve kablosuz özelliği sayesinde her yerde rahatlıkla kullanabilirsiniz.</p>\n\n    <p style=\"font-size: 14px; color: #777; text-align: center;\">Her evde olması gereken pratik bir masaj aleti!</p>\n\n  </div>\n\n</section>\n"
    //       },
    //       "comments": [
    //           {
    //               "id": 548,
    //               "author": "M** K**",
    //               "content": "Tarafıma sorunsuz bir şekilde ulaştı. Satıcıya ve emeği geçenlere teşekkür ederim.",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 549,
    //               "author": "T** S**",
    //               "content": "5 kişi denedik ve sevdik. farklı başlıklar olması çok iyi. abim öyle sevdi ki bütün gün yap diyebilirim dedi😂",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 550,
    //               "author": "E** Ö**",
    //               "content": "Severek kullanıyoruz hatta dayımlarda şipariş verdi her evde bence bir tane bulunmalı sadece kademeli artış filan demişlerdi ama tek tip dozda çalışıyor ama bence yeterli ve rahatlatıyor",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 551,
    //               "author": "A** N**",
    //               "content": "Cok guzel oglum icin aldim. Her akşam masaj yapiyo ayaklarina  severek.",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 552,
    //               "author": "M** Ç**",
    //               "content": "süper sağlam geldi. küçük sanıyordum boyut olarak ideal büyüklükte. tavsiye ederim.",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 553,
    //               "author": "T** K**",
    //               "content": "Alın aldırın saatlerce babanızın omuzlarını ovmak zorunda kalmayın 😂",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 554,
    //               "author": "M** D**",
    //               "content": "harika bir şey bu ablam da kullanip almak istedim hemen denedim süper ötesi acayip rahatlatıyor çok teşekkürler",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 555,
    //               "author": "Safa Y.",
    //               "content": "Ürün gayet güzel kendi kendime masaj yapıyorum keşke daha fazla sipariş verseydim ailemdem istenler oldu",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 556,
    //               "author": "B** M**",
    //               "content": "Başarılı bir ürün",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 557,
    //               "author": "A** M**",
    //               "content": "Paketleme güzel ve hızlı geldi",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 558,
    //               "author": "P** a** ç**",
    //               "content": "çoook iyi kimse kötü yorum yapmasın ben bu kadar mükemmel biiey görmedim aşırı güçlü",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           },
    //           {
    //               "id": 559,
    //               "author": "İ** B** K**",
    //               "content": "Çok iyi rahatlatıyor",
    //               "rating": "5",
    //               "photo": "",
    //               "order": 999
    //           }
    //       ],
    //       "pixels": [
    //           {
    //               "id": 4,
    //               "merchant_id": 1,
    //               "platform": "facebook",
    //               "pixel_id": "346971234347723",
    //               "name": "yenibirürün",
    //               "is_active": 1,
    //               "created_at": "2025-06-11T19:46:24.000000Z",
    //               "updated_at": "2025-06-11T19:46:24.000000Z",
    //               "pivot": {
    //                   "product_id": 36,
    //                   "pixel_id": 4
    //               }
    //           }
    //       ],
    //       "cities": [
    //           {
    //               "id": 1,
    //               "name": "ADANA"
    //           },
    //           {
    //               "id": 2,
    //               "name": "ADIYAMAN"
    //           },
    //           {
    //               "id": 3,
    //               "name": "AFYONKARAHİSAR"
    //           },
    //           {
    //               "id": 4,
    //               "name": "AĞRI"
    //           },
    //           {
    //               "id": 68,
    //               "name": "AKSARAY"
    //           },
    //           {
    //               "id": 5,
    //               "name": "AMASYA"
    //           },
    //           {
    //               "id": 6,
    //               "name": "ANKARA"
    //           },
    //           {
    //               "id": 7,
    //               "name": "ANTALYA"
    //           },
    //           {
    //               "id": 75,
    //               "name": "ARDAHAN"
    //           },
    //           {
    //               "id": 8,
    //               "name": "ARTVİN"
    //           },
    //           {
    //               "id": 9,
    //               "name": "AYDIN"
    //           },
    //           {
    //               "id": 10,
    //               "name": "BALIKESİR"
    //           },
    //           {
    //               "id": 74,
    //               "name": "BARTIN"
    //           },
    //           {
    //               "id": 72,
    //               "name": "BATMAN"
    //           },
    //           {
    //               "id": 69,
    //               "name": "BAYBURT"
    //           },
    //           {
    //               "id": 11,
    //               "name": "BİLECİK"
    //           },
    //           {
    //               "id": 12,
    //               "name": "BİNGÖL"
    //           },
    //           {
    //               "id": 13,
    //               "name": "BİTLİS"
    //           },
    //           {
    //               "id": 14,
    //               "name": "BOLU"
    //           },
    //           {
    //               "id": 15,
    //               "name": "BURDUR"
    //           },
    //           {
    //               "id": 16,
    //               "name": "BURSA"
    //           },
    //           {
    //               "id": 17,
    //               "name": "ÇANAKKALE"
    //           },
    //           {
    //               "id": 18,
    //               "name": "ÇANKIRI"
    //           },
    //           {
    //               "id": 19,
    //               "name": "ÇORUM"
    //           },
    //           {
    //               "id": 20,
    //               "name": "DENİZLİ"
    //           },
    //           {
    //               "id": 21,
    //               "name": "DİYARBAKIR"
    //           },
    //           {
    //               "id": 81,
    //               "name": "DÜZCE"
    //           },
    //           {
    //               "id": 22,
    //               "name": "EDİRNE"
    //           },
    //           {
    //               "id": 23,
    //               "name": "ELAZIĞ"
    //           },
    //           {
    //               "id": 24,
    //               "name": "ERZİNCAN"
    //           },
    //           {
    //               "id": 25,
    //               "name": "ERZURUM"
    //           },
    //           {
    //               "id": 26,
    //               "name": "ESKİŞEHİR"
    //           },
    //           {
    //               "id": 27,
    //               "name": "GAZİANTEP"
    //           },
    //           {
    //               "id": 28,
    //               "name": "GİRESUN"
    //           },
    //           {
    //               "id": 29,
    //               "name": "GÜMÜŞHANE"
    //           },
    //           {
    //               "id": 30,
    //               "name": "HAKKARİ"
    //           },
    //           {
    //               "id": 31,
    //               "name": "HATAY"
    //           },
    //           {
    //               "id": 76,
    //               "name": "IĞDIR"
    //           },
    //           {
    //               "id": 32,
    //               "name": "ISPARTA"
    //           },
    //           {
    //               "id": 34,
    //               "name": "İSTANBUL"
    //           },
    //           {
    //               "id": 35,
    //               "name": "İZMİR"
    //           },
    //           {
    //               "id": 46,
    //               "name": "KAHRAMANMARAŞ"
    //           },
    //           {
    //               "id": 78,
    //               "name": "KARABÜK"
    //           },
    //           {
    //               "id": 70,
    //               "name": "KARAMAN"
    //           },
    //           {
    //               "id": 36,
    //               "name": "KARS"
    //           },
    //           {
    //               "id": 37,
    //               "name": "KASTAMONU"
    //           },
    //           {
    //               "id": 38,
    //               "name": "KAYSERİ"
    //           },
    //           {
    //               "id": 79,
    //               "name": "KİLİS"
    //           },
    //           {
    //               "id": 71,
    //               "name": "KIRIKKALE"
    //           },
    //           {
    //               "id": 39,
    //               "name": "KIRKLARELİ"
    //           },
    //           {
    //               "id": 40,
    //               "name": "KIRŞEHİR"
    //           },
    //           {
    //               "id": 41,
    //               "name": "KOCAELİ"
    //           },
    //           {
    //               "id": 42,
    //               "name": "KONYA"
    //           },
    //           {
    //               "id": 43,
    //               "name": "KÜTAHYA"
    //           },
    //           {
    //               "id": 44,
    //               "name": "MALATYA"
    //           },
    //           {
    //               "id": 45,
    //               "name": "MANİSA"
    //           },
    //           {
    //               "id": 47,
    //               "name": "MARDİN"
    //           },
    //           {
    //               "id": 33,
    //               "name": "MERSİN"
    //           },
    //           {
    //               "id": 48,
    //               "name": "MUĞLA"
    //           },
    //           {
    //               "id": 49,
    //               "name": "MUŞ"
    //           },
    //           {
    //               "id": 50,
    //               "name": "NEVŞEHİR"
    //           },
    //           {
    //               "id": 51,
    //               "name": "NİĞDE"
    //           },
    //           {
    //               "id": 52,
    //               "name": "ORDU"
    //           },
    //           {
    //               "id": 80,
    //               "name": "OSMANİYE"
    //           },
    //           {
    //               "id": 53,
    //               "name": "RİZE"
    //           },
    //           {
    //               "id": 54,
    //               "name": "SAKARYA"
    //           },
    //           {
    //               "id": 55,
    //               "name": "SAMSUN"
    //           },
    //           {
    //               "id": 63,
    //               "name": "ŞANLIURFA"
    //           },
    //           {
    //               "id": 56,
    //               "name": "SİİRT"
    //           },
    //           {
    //               "id": 57,
    //               "name": "SİNOP"
    //           },
    //           {
    //               "id": 73,
    //               "name": "ŞIRNAK"
    //           },
    //           {
    //               "id": 58,
    //               "name": "SİVAS"
    //           },
    //           {
    //               "id": 59,
    //               "name": "TEKİRDAĞ"
    //           },
    //           {
    //               "id": 60,
    //               "name": "TOKAT"
    //           },
    //           {
    //               "id": 61,
    //               "name": "TRABZON"
    //           },
    //           {
    //               "id": 62,
    //               "name": "TUNCELİ"
    //           },
    //           {
    //               "id": 64,
    //               "name": "UŞAK"
    //           },
    //           {
    //               "id": 65,
    //               "name": "VAN"
    //           },
    //           {
    //               "id": 77,
    //               "name": "YALOVA"
    //           },
    //           {
    //               "id": 66,
    //               "name": "YOZGAT"
    //           },
    //           {
    //               "id": 82,
    //               "name": "YURTDIŞI"
    //           },
    //           {
    //               "id": 67,
    //               "name": "ZONGULDAK"
    //           }
    //       ],
    //       "legal_links": [
    //           {
    //               "key": "privacy-policy",
    //               "title": "Gizlilik Politikası"
    //           },
    //           {
    //               "key": "shipping-policy",
    //               "title": "Kargo Politikası"
    //           },
    //           {
    //               "key": "refund-policy",
    //               "title": "Para İade Politikası"
    //           },
    //           {
    //               "key": "terms-and-conditions",
    //               "title": "Hizmet ve Şartlar"
    //           },
    //           {
    //               "key": "contact",
    //               "title": "İletişim"
    //           },
    //           {
    //               "key": "legal-notice",
    //               "title": "Yasal Bildirim"
    //           }
    //       ],
    //       "template": "nova"
      
    //   }
    // )
    // setLoading(false);
  }, [slug]);

  // Timer state
  useEffect(() => {
    let countdownEndTime = Math.floor(Date.now() / 1000) + 2 * 60 * 60 + Math.floor(Math.random() * 59 + 1) * 60;
    const updateTimer = () => {
      let now = Math.floor(Date.now() / 1000);
      let timeLeft = countdownEndTime - now;
      if (timeLeft <= 0) {
        const randomMinutes = Math.floor(Math.random() * 59) + 1;
        countdownEndTime = now + (2 * 60 * 60) + (randomMinutes * 60);
        timeLeft = countdownEndTime - now;
      }
      const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
      const seconds = String(timeLeft % 60).padStart(2, '0');
      setTimer({ hours, minutes, seconds });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate delivery dates
  useEffect(() => {
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const today = new Date();

    // Function to calculate delivery dates, skipping Sunday
    function calculateDeliveryDate(startDate: Date, offsetDays: number) {
      let deliveryDate = new Date(startDate);
      let addedDays = 0;
      while (addedDays < offsetDays) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        if (deliveryDate.getDay() !== 0) { // Skip Sundays
          addedDays++;
        }
      }
      return deliveryDate;
    }

    // Calculate the dates
    const firstDeliveryDate = calculateDeliveryDate(today, 1);
    const lastDeliveryDate = calculateDeliveryDate(today, 3);

    // Format the dates
    const firstDate = `${firstDeliveryDate.getDate()} ${monthNames[firstDeliveryDate.getMonth()]} ${dayNames[firstDeliveryDate.getDay()]}`;
    const lastDate = `${lastDeliveryDate.getDate()} ${monthNames[lastDeliveryDate.getMonth()]} ${dayNames[lastDeliveryDate.getDay()]}`;

     setDeliveryDates({
        start: firstDate,
       end: lastDate
     });

  }, []);

  // Gallery scroll
  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = 200;
      const currentScroll = thumbnailRef.current.scrollLeft;
      const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      thumbnailRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  };

  // Scrolling text animation control
  useEffect(() => {
    const scrollingText = document.querySelector('.scrolling-text') as HTMLElement;
    if (scrollingText) {
      const handleMouseOver = () => {
        scrollingText.style.animationPlayState = 'paused';
      };
      
      const handleMouseOut = () => {
        scrollingText.style.animationPlayState = 'running';
      };

      scrollingText.addEventListener('mouseover', handleMouseOver);
      scrollingText.addEventListener('mouseout', handleMouseOut);

      return () => {
        scrollingText.removeEventListener('mouseover', handleMouseOver);
        scrollingText.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, []);

  useEffect(() => {
    if (!commentGridRef.current || !product?.comments?.length) return;

    const init = () => {
      const MasonryCtor = (window as any).Masonry;
      if (MasonryCtor && commentGridRef.current) {
        new MasonryCtor(commentGridRef.current, {
          itemSelector: '.comment-item',
          columnWidth: '.comment-item',
          percentPosition: true,
          gutter: 16,
        });
      }
    };

    if ((window as any).Masonry) {
      init();
      return;
    }

    const timer = setInterval(() => {
      if ((window as any).Masonry) {
        clearInterval(timer);
        init();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [product?.comments]); // re-run when comments change

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

  if (product.template === "2step") {
    return <TwoStepLandingTemplate product={product} />;
  }

  // Default template (review)
  return (
    <div className="product-details-container">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="scrolling-text">
          {announcementTexts.map((t, i) => <span key={i}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 10}>{t}</span>)}
          {announcementTexts.map((t, i) => <span key={i + 20}>{t}</span>)}
        </div>
      </div>
      {/* Gallery */}
      <div className="gallery-container mt-1">
        <div className="header text-center mx-auto">
          <a href="/"><img style={{height: 50}} src="/images/logo.png" alt="TrendyGoods" /></a>
              </div>
              <div className="main-image-container">
          <img id="mainImage" src={product.images && product.images.length > 0 ? (product.images[mainImg] || product.images[0]) : '/images/default-product.png'} height={375} alt="product image" loading="lazy" />
              </div>
        <div className="thumbnail-wrapper">
          <span className="arrow" onClick={() => scrollThumbnails('left')}>&#10094;</span>
          <div className="thumbnail-container" ref={thumbnailRef}>
            {product.images && product.images.length > 0 && product.images.map((img: string, idx: number) => (
              <img
                key={img + idx}
                        src={img}
                height={100}
                        alt="thumbnail image"
                        onClick={() => setMainImg(idx)}
                style={{cursor: 'pointer'}}
                      />
                    ))}
                  </div>
          <span className="arrow" onClick={() => scrollThumbnails('right')}>&#10095;</span>
        </div>
      </div>
      {/* Flash Sale Bar with Timer */}
      <div className="flash-urunler">
        <div className="flash-header">
          <div className="icon">
            <img src="/images/assets/flash.png" alt="Flash Icon" />
          </div>
          <div className="title-timer">
            <div className="title">Flaş İndirim</div>
            <div className="timer">
              <span>{timer.hours}</span>:<span>{timer.minutes}</span>:<span>{timer.seconds}</span>
            </div>
                </div>
          <div className="sales-info">
            <span>57 adet satıldı</span>
            <div className="progress-bar">
              <div className="progress" />
            </div>
              </div>
                </div>
              </div>

      {/* Product Info Section */}
      <div className="container-fluid mt-4">
        <h2 className="title-detail" style={{marginBottom: 0}}>{product.name}</h2>
        <div className="product-detail-rating d-flex justify-content-between align-items-center mb-3">
          <div className="product-rate-cover text-end d-flex align-items-center">
            <span className="font-small ml-1 text-muted"><strong>{product.rating}</strong></span>
            <div className="star-rating d-inline-block mx-2">
              {[...Array(5)].map((_, starIndex) => (
                <i 
                  key={starIndex}
                  className={`fas fa-star${starIndex < product.rating ? '' : '-o'}`}
                  style={{ 
                    color: starIndex < product.rating ? '#F27A1A' : '#ccc',
                    fontSize: '14px',
                    marginRight: '1px'
                  }}
                />
              ))}
            </div>
            <a className="font-small ml-3 text-muted" href="#comments">( {product.commentCount || 0} değerlendirme)</a>
          </div>
        </div>
        <div className="clearfix product-price-cover my-3">
          <div className="product-price primary-color">
            <span className="text-brand h4">{product.price?.toFixed(2)}₺</span>
            <ins><span className="old-price font-md ml-3 text-muted">{product.oldPrice.toFixed(2)}₺</span></ins>
            <span className="save-price font-md ml-3 text-white bg-danger p-1 rounded">{product.discount} indirim</span>
          </div>
        </div>
        {/* Features/Benefits */}
        <div className="short-desc mb-3">
          <div className="emoji-benefits-container">
            {product.features.map((f, i) => (
              <p key={i}><strong>{f}</strong></p>
            ))}
          </div>
        </div>
        {/* Section Title for Options */}
        <div className="section-title">
          <span>ÇOK AL & AZ ÖDE</span>
        </div>
        {/* Product Options */}
        <div>
          {product.options.map((opt, idx) => (
            <div key={opt.quantity} className={`product-option d-flex align-items-center mb-1${idx === 0 ? ' active' : ''}`} data-quantity={opt.quantity}>
              <img src={product.images[0]} width={60} height={60} className="img-fluid" alt="product image" />
              <div className="details">
                <div className="info">
                  <span className="title">
                    {opt.displayText || `${opt.quantity} Adet`}
                    
                    {opt.isCampaign && (
                      <p style={{color: 'red', fontWeight: 'bold', fontSize: '.9rem'}}>
                        {opt.quantity} {opt.unit || 'Adet'} BEDAVA
                      </p>
                    )}
                    
                    <small className="kargo-bedava">Ücretsiz Kargo</small>
                    {opt.discount > 0 && (
                      <div className="discount" style={{maxWidth: 115}}>
                        Tanesi {Math.round(opt.price / opt.quantity)}TL
                      </div>
                    )}
                  </span>
                  <span className="price">
                    {opt.price.toFixed(2)}TL
                    <br />
                    {opt.original && opt.original > opt.price && (
                      <div className="original-price">{opt.original.toFixed(2)}TL</div>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
              </div>
            </div>

            <div className="border-top my-3"></div>

      {/* Delivery Info */}
      <div className="delivery-info mb-4">
        <i className="fas fa-shipping-fast"></i>
        Şimdi sipariş verirsen <br />
        <small id="delivery-dates">{deliveryDates.start} - {deliveryDates.end}</small>
        <p>tarihleri arasında siparişin kapında!</p>
      </div>

      {/* Order Buttons */}
      <div className="product-extra-link2 mb-3 w-100">
        <button type="button" className="btn btn-success btn-block w-100 bounce" onClick={openModal}>
          Kapıda Ödemeli Sipariş Ver
        </button>
      </div>
      
      {/* Product Content */}
      {product.content && (
        <div className="product-content mb-3" dangerouslySetInnerHTML={{ __html: product.content }} />
      )}
      
      <div className="product-extra-link2 mb-3 w-100">
        <button type="button" className="btn btn-success btn-block w-100 bounce" onClick={openModal}>
          Şimdi Sipariş Ver
        </button>
      </div>

            {/* comments Section Title */}
      <h6 className="section-title style-1 my-30 text-center" id="comments">
        Tüm Değerlendirmeler ({product.commentCount || 0})
      </h6>
              <div className="comment-grid" id="comment-container" ref={commentGridRef}>
          {product.comments?.map((comment, idx) => (
            <div className="comment-item" key={idx}>
              <div className="comment-card">
                {comment.photo && <img src={comment.photo} className="comment-img" alt="Comment Image" />}
                <div className="comment-content">
                  <div>
                    <div className="star-rating mb-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <i 
                          key={starIndex}
                          className={`fas fa-star${starIndex < comment.rating ? '' : '-o'}`}
                          style={{ 
                            color: starIndex < comment.rating ? '#FFD700' : '#ccc',
                            fontSize: '14px',
                            marginRight: '2px'
                          }}
                        />
                      ))}
            </div>
                                      <h6 className="mb-1">{comment.author}</h6>
            </div>
                <small>{comment.content}</small>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center w-100">
              <p>Henüz yorum bulunmuyor.</p>
          </div>
          )}
      </div>
      {/* Continue with comments and modal in next steps */}

      {/* Order Modal */}
      <OrderModal
        showModal={showModal}
        onClose={closeModal}
        product={{
          ...product,
          cities: product.cities
        }}
        selectedOption={selectedOption}
        onOptionSelect={selectOption}
      />
      
      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className="product-price">
            <span className="original-price">{product.oldPrice.toFixed(2)}TL</span>
            <span className="text-danger" style={{fontWeight: 'bolder', fontSize: '1.1rem'}}>{selectedOption?.price.toFixed(2) || product.price.toFixed(2)}TL</span>
          </div>
        </div>
        <button className="add-to-cart-btn" onClick={openModal}>Sipariş Ver</button>
      </div>
      
      {/* Footer */}
      <Footer />
      {product && product.pixels && (
        <PixelScripts pixels={product.pixels} product={product} />
      )}
    </div>
  );
} 