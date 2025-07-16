import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PromotionCard from '../../../components/PromotionCard';
import { FaGift, FaCheckCircle, FaCheck } from 'react-icons/fa';

const promoProducts = [
  {
    "name": "Cosmos Yıldız Yağmuru",
    "internalName": "Stary Lamba Cosmos",
    "productLink": "https://trendygoods.com.tr/product/cosmos-yildiz-yagmuru",
    "imgSrc": "https://trendygoods.com.tr/storage/33/resim_2024-07-17_174036181.png",
    "imgName": "resim_2024-07-17_174036181.png",
    "rating": "4.9",
    "priceCurrent": "749,00TL",
    "priceOriginal": "999.00TL"
  },
  {
    "name": "Konuşan Kaktüs",
    "internalName": "Kaktüs",
    "productLink": "https://trendygoods.com.tr/product/konusan-kaktus",
    "imgSrc": "https://trendygoods.com.tr/storage/540/resim_2025-07-06_101718015.png",
    "imgName": "resim_2025-07-06_101718015.png",
    "rating": "4.2",
    "priceCurrent": "300,00TL",
    "priceOriginal": "550.00TL"
  },
  {
    "name": "Sinek Raketi",
    "internalName": "Sinek Raketi",
    "productLink": "https://trendygoods.com.tr/product/sinek-raketi-lp",
    "imgSrc": "https://trendygoods.com.tr/storage/508/resim_2025-06-14_113718564.png",
    "imgName": "resim_2025-06-14_113718564.png",
    "rating": "4.4",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "Ultra Su Emici Banyo Paspası",
    "internalName": "Banyo Paspası",
    "productLink": "https://trendygoods.com.tr/product/banyo-paspasi",
    "imgSrc": "https://trendygoods.com.tr/storage/58/resim_2024-08-28_083825924.png",
    "imgName": "resim_2024-08-28_083825924.png",
    "rating": "4.6",
    "priceCurrent": "149,00TL",
    "priceOriginal": "399.00TL"
  },
  {
    "name": "Sensörlü Tezgah Altı Lamba",
    "internalName": "Akasya Lamba",
    "productLink": "https://trendygoods.com.tr/product/tezgah-lamba",
    "imgSrc": "https://trendygoods.com.tr/storage/133/resim_2024-10-27_124035023.png",
    "imgName": "resim_2024-10-27_124035023.png",
    "rating": "4.4",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "BrightPad - Yazı ve Resim Tahtası",
    "internalName": "Cam Tahta",
    "productLink": "https://trendygoods.com.tr/product/cam-tahta",
    "imgSrc": "https://trendygoods.com.tr/storage/286/resim_2025-01-07_101401653.png",
    "imgName": "resim_2025-01-07_101401653.png",
    "rating": "4.1",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "Televizyon Arkası Led",
    "internalName": "TV Arkası LED",
    "productLink": "https://trendygoods.com.tr/product/tv-arkasi-led",
    "imgSrc": "https://trendygoods.com.tr/storage/279/resim_2024-12-27_085422283.png",
    "imgName": "resim_2024-12-27_085422283.png",
    "rating": "4.1",
    "priceCurrent": "250,00TL",
    "priceOriginal": "500.00TL"
  },
  {
    "name": "Çok Fonksiyonlu Tazyikli Musluk Başlığı",
    "internalName": "Mutfak Musluk Başlığı",
    "productLink": "https://trendygoods.com.tr/product/tazyikli-musluk-basligi",
    "imgSrc": "https://trendygoods.com.tr/storage/115/resim_2024-10-06_092512445.png",
    "imgName": "resim_2024-10-06_092512445.png",
    "rating": "4.4",
    "priceCurrent": "172,00TL",
    "priceOriginal": "422.00TL"
  },
  {
    "name": "MagnoGlow Lamba",
    "internalName": "MagnoGlow Lamba",
    "productLink": "https://trendygoods.com.tr/product/miknatisli-lamba",
    "imgSrc": "https://trendygoods.com.tr/storage/1/1.webp",
    "imgName": "1.webp",
    "rating": "4.3",
    "priceCurrent": "249,00TL",
    "priceOriginal": "499.00TL"
  },
  {
    "name": "TrendyGlow 3x3 mt Perde LED Işıkları",
    "internalName": "Perde Led",
    "productLink": "https://trendygoods.com.tr/product/perd-led",
    "imgSrc": "https://trendygoods.com.tr/storage/255/resim_2024-12-23_214326254.png",
    "imgName": "resim_2024-12-23_214326254.png",
    "rating": "4.9",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "Sinek Raketi",
    "internalName": "Sinek Raketi",
    "productLink": "https://trendygoods.com.tr/product/sinek-raketi",
    "imgSrc": "https://trendygoods.com.tr/storage/501/resim_2025-06-13_151235155.png",
    "imgName": "resim_2025-06-13_151235155.png",
    "rating": "4.8",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "Araç Şemsiyesi",
    "internalName": "Araç Şemsiye",
    "productLink": "https://trendygoods.com.tr/product/arac-gunes-semsiyesi",
    "imgSrc": "https://trendygoods.com.tr/storage/504/resim_2025-06-14_084237987.png",
    "imgName": "resim_2025-06-14_084237987.png",
    "rating": "4.7",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "Buzlu Vantilatör",
    "internalName": "Buzlu Fan",
    "productLink": "https://trendygoods.com.tr/product/buzlu-vantilator",
    "imgSrc": "https://trendygoods.com.tr/storage/514/resim_2025-06-27_093728668.png",
    "imgName": "resim_2025-06-27_093728668.png",
    "rating": "4.6",
    "priceCurrent": "549,00TL",
    "priceOriginal": "799.00TL"
  },
  {
    "name": "Cilt Yenileyici Buz Kalıbı",
    "internalName": "Beyzana Cilt Buzu",
    "productLink": "https://trendygoods.com.tr/product/cilt-yenileyici-buz-kalibi",
    "imgSrc": "https://trendygoods.com.tr/storage/527/resim_2025-06-28_164740642.png",
    "imgName": "resim_2025-06-28_164740642.png",
    "rating": "4.1",
    "priceCurrent": "149,00TL",
    "priceOriginal": "399.00TL"
  },
  {
    "name": "BrightPad - Yazı ve Resim Tahtası",
    "internalName": "Cam Tahta",
    "productLink": "https://trendygoods.com.tr/product/cam-tahta-rw",
    "imgSrc": "https://trendygoods.com.tr/storage/298/resim_2025-01-07_213931443.png",
    "imgName": "resim_2025-01-07_213931443.png",
    "rating": "4.2",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "Sürüklenebilir Nokta Çizim Tahtası",
    "internalName": "Nokta Tahtası",
    "productLink": "https://trendygoods.com.tr/product/suruklenebilir-nokta-cizim-tahtasi",
    "imgSrc": "https://trendygoods.com.tr/storage/415/resim_2025-03-07_222443084.png",
    "imgName": "resim_2025-03-07_222443084.png",
    "rating": "4.2",
    "priceCurrent": "349,00TL",
    "priceOriginal": "599.00TL"
  },
  {
    "name": "60 cm Sensörlü Lamba (4 ledli)",
    "internalName": "60 CM Akasya Lamba",
    "productLink": "https://trendygoods.com.tr/product/tezgah-lamba-60cm",
    "imgSrc": "https://trendygoods.com.tr/storage/462/resim_2024-10-27_124035023.png",
    "imgName": "resim_2024-10-27_124035023.png",
    "rating": "4.8",
    "priceCurrent": "449,00TL",
    "priceOriginal": "699.00TL"
  },
  {
    "name": "Vakumlu Tutacak",
    "internalName": "Vakumlu Tutacak",
    "productLink": "https://trendygoods.com.tr/product/vakumlu-tutacak",
    "imgSrc": "https://trendygoods.com.tr/storage/521/resim_2025-06-27_172839505.png",
    "imgName": "resim_2025-06-27_172839505.png",
    "rating": "4.1",
    "priceCurrent": "249,00TL",
    "priceOriginal": "499.00TL"
  },
  {
    "name": "3 Renk Modlu Masa Lambası",
    "internalName": "Masa Lambası",
    "productLink": "https://trendygoods.com.tr/product/masa-lambasi",
    "imgSrc": "https://trendygoods.com.tr/storage/383/resim_2025-02-08_175647926.png",
    "imgName": "resim_2025-02-08_175647926.png",
    "rating": "4.5",
    "priceCurrent": "249,00TL",
    "priceOriginal": "499.00TL"
  },
  {
    "name": "VolcanoAir Oda Nemlendiricisi",
    "internalName": "Volkan",
    "productLink": "https://trendygoods.com.tr/product/volkan-nemlendirici",
    "imgSrc": "https://trendygoods.com.tr/storage/280/resim_2025-01-02_173208712.png",
    "imgName": "resim_2025-01-02_173208712.png",
    "rating": "4.2",
    "priceCurrent": "549,00TL",
    "priceOriginal": "799.00TL"
  },
  {
    "name": "Araba içi Ayaklık Led",
    "internalName": "Araba LED",
    "productLink": "https://trendygoods.com.tr/product/araba-led",
    "imgSrc": "https://trendygoods.com.tr/storage/303/resim_2025-01-10_223703357.png",
    "imgName": "resim_2025-01-10_223703357.png",
    "rating": "4.8",
    "priceCurrent": "300,00TL",
    "priceOriginal": "550.00TL"
  },
  {
    "name": "Uzay Bulut Robotu",
    "internalName": "Astronot",
    "productLink": "https://trendygoods.com.tr/product/uzay-bulut-robotu",
    "imgSrc": "https://trendygoods.com.tr/storage/39/resim_2024-04-11_225018545-(2).png",
    "imgName": "resim_2024-04-11_225018545-(2).png",
    "rating": "4.7",
    "priceCurrent": "749,00TL",
    "priceOriginal": "999.00TL"
  },
  {
    "name": "Taşınabilir Projeksiyon",
    "internalName": "Projeksiyon",
    "productLink": "https://trendygoods.com.tr/product/ekran-yansitici",
    "imgSrc": "https://trendygoods.com.tr/storage/153/resim_2024-11-03_123329458.png",
    "imgName": "resim_2024-11-03_123329458.png",
    "rating": "4.9",
    "priceCurrent": "2249,00TL",
    "priceOriginal": "2499.00TL"
  },
  {
    "name": "Işıklı Yüksek Ses Party Box Karaoke Bluetooth Hoparlör",
    "internalName": "Hoparlör",
    "productLink": "https://trendygoods.com.tr/product/isikli-yuksek-ses-party-box-karaoke-bluetooth-hoparlor",
    "imgSrc": "https://trendygoods.com.tr/storage/534/resim_2025-07-05_122005655.png",
    "imgName": "resim_2025-07-05_122005655.png",
    "rating": "4.6",
    "priceCurrent": "400,00TL",
    "priceOriginal": "650.00TL"
  },
  {
    "name": "Su Emici Tezgah Üstü Mutfak Matı",
    "internalName": "Mutfak Matı",
    "productLink": "https://trendygoods.com.tr/product/mutfak-mati",
    "imgSrc": "https://trendygoods.com.tr/storage/42/resim_2024-07-23_094830795.png",
    "imgName": "resim_2024-07-23_094830795.png",
    "rating": "4.7",
    "priceCurrent": "149,00TL",
    "priceOriginal": "399.00TL"
  },
  {
    "name": "5'li Şeffaf Süper Yapışkan Askılık",
    "internalName": "5li Yapışkan Askılık",
    "productLink": "https://trendygoods.com.tr/product/yapiskanli-aski",
    "imgSrc": "https://trendygoods.com.tr/storage/105/resim_2024-10-05_182429423.png",
    "imgName": "resim_2024-10-05_182429423.png",
    "rating": "4.1",
    "priceCurrent": "45,00TL",
    "priceOriginal": "295.00TL"
  },
  {
    "name": "Ahşap Ayak Masajı",
    "internalName": "Masaj Ayak",
    "productLink": "https://trendygoods.com.tr/product/ahsap-ayak-masaji",
    "imgSrc": "https://trendygoods.com.tr/storage/488/resim_2025-06-09_101049753.png",
    "imgName": "resim_2025-06-09_101049753.png",
    "rating": "4.9",
    "priceCurrent": "249,00TL",
    "priceOriginal": "499.00TL"
  },
  {
    "name": "TrendySand Kum Sanatı (Deniz Rengi)",
    "internalName": "Kum Sanatı (Blue)",
    "productLink": "https://trendygoods.com.tr/product/kum-sanati-mavi",
    "imgSrc": "https://trendygoods.com.tr/storage/130/resim_2024-10-23_070924251.png",
    "imgName": "resim_2024-10-23_070924251.png",
    "rating": "4.2",
    "priceCurrent": "185,00TL",
    "priceOriginal": "435.00TL"
  },
  {
    "name": "AutoComfort Yatak Seti",
    "internalName": "Araba Yatağı",
    "productLink": "https://trendygoods.com.tr/product/araba-yatagi",
    "imgSrc": "https://trendygoods.com.tr/storage/50/resim_2024-08-09_225836761.png",
    "imgName": "resim_2024-08-09_225836761.png",
    "rating": "4.5",
    "priceCurrent": "1049,00TL",
    "priceOriginal": "1299.00TL"
  },
  {
    "name": "Duvara Yapışan Tuvalet Fırçası",
    "internalName": "Tuvalet Fırçası",
    "productLink": "https://trendygoods.com.tr/product/tuvalet-fircasi-siyah",
    "imgSrc": "https://trendygoods.com.tr/storage/110/resim_2024-10-05_202809404.png",
    "imgName": "resim_2024-10-05_202809404.png",
    "rating": "4.4",
    "priceCurrent": "123,00TL",
    "priceOriginal": "373.00TL"
  }
];

export default function PromotionPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header />
      {/* Announcement Section */}
      <div className="w-full max-w-[1320px] mx-auto flex justify-center mt-6 mb-5">
        <div className="bg-[#f8f9fa] rounded-[10px] border border-[#e0e0e0] w-full flex flex-col items-center shadow-sm" style={{ padding: '24px' }}>
          <div className="flex items-center justify-center">
            <FaCheckCircle className="text-[#0b8123] mr-2" size={25} />
            <h2 className="text-[#0b8123]" style={{ fontFamily: 'Spartan, sans-serif', fontSize: '25.2px', fontWeight: 'bold' }}>SİPARİŞİNİZ ALINDI</h2>
          </div>
          <div
            className="w-full bg-[#fffbe6] py-3 px-4 flex flex-col items-center"
            style={{ marginTop: 24, backgroundColor: '#fff8e1', borderRadius: 8, borderLeft: '4px solid #ffc107' }}
          >
            <span className="text-[#ff6a00] font-bold text-[18px] flex items-center">
              <FaGift className="mr-2" color="#ff6a00" size={18} />
              Tebrikler! Aşağıdaki ürünleri indirimli fiyatlarıyla almaya hak kazandınız
            </span>
            <span className="text-gray-500 text-sm mt-1">*Dilediğiniz ürünü 'Sepete Ekle' tuşuna basarak sepetinize ekleyebilirsiniz</span>
          </div>
          
        </div>
      </div> 
      {/* Main Content */}
      <main className="w-full max-w-[1320px] mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {promoProducts.map((product, idx) => (
            <PromotionCard
              key={idx}
              image={product.imgSrc}
              title={product.name}
              rating={product.rating ? parseFloat(product.rating) : null}
              price={product.priceCurrent}
              oldPrice={product.priceOriginal}
              slug={product.productLink.replace('https://trendygoods.com.tr/product/', '')}
              imgName={product.imgName}
            />
          ))}
        </div>
      </main>
      {/* Green Button */}
      <div className="w-full flex justify-center my-8">
        <button
          className="flex items-center justify-center w-full max-w-[1300px] text-white py-3 transition"
          style={{ 
            borderRadius: '4px',
            color: '#fff',
            border: '1px solid #046963',
            backgroundColor: '#088178',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
            fontFamily: 'Lato, sans-serif',
            fontSize: '12px'
          }}
        >
          <FaCheck className="mr-2" size={12} />
          Siparişimi Tamamla
        </button>
      </div>
      <Footer />
    </div>
  );
} 