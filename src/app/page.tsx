import Header from './Header';
import ProductGrid from './ProductGrid';
import Footer from './Footer';

const products = [
  {"name":"MagnoGlow Lamba","imgName":"1.webp","imgSrc":"https://trendygoods.com.tr/storage/1/1.webp","productLink":"https://trendygoods.com.tr/product/miknatisli-lamba","rating":"4.9","priceCurrent":"499.00 TL","priceOriginal":"700.00 TL"},
  {"name":"Ultra Su Emici Banyo Paspası","imgName":"resim_2024-08-28_083825924.png","imgSrc":"https://trendygoods.com.tr/storage/58/resim_2024-08-28_083825924.png","productLink":"https://trendygoods.com.tr/product/banyo-paspasi","rating":"4.3","priceCurrent":"399.00 TL","priceOriginal":"600.00 TL"},
  {"name":"Cosmos Yıldız Yağmuru","imgName":"resim_2024-07-17_174036181.png","imgSrc":"https://trendygoods.com.tr/storage/33/resim_2024-07-17_174036181.png","productLink":"https://trendygoods.com.tr/product/cosmos-yildiz-yagmuru","rating":"5.0","priceCurrent":"999.00 TL","priceOriginal":"1400.00 TL"},
  {"name":"Uzay Bulut Robotu","imgName":"resim_2024-04-11_225018545-(2).png","imgSrc":"https://trendygoods.com.tr/storage/39/resim_2024-04-11_225018545-(2).png","productLink":"https://trendygoods.com.tr/product/uzay-bulut-robotu","rating":"5.0","priceCurrent":"999.00 TL","priceOriginal":"1500.00 TL"},
  {"name":"Su Emici Tezgah Üstü Mutfak Matı","imgName":"resim_2024-07-23_094830795.png","imgSrc":"https://trendygoods.com.tr/storage/42/resim_2024-07-23_094830795.png","productLink":"https://trendygoods.com.tr/product/mutfak-mati","rating":"4.8","priceCurrent":"399.00 TL","priceOriginal":"600.00 TL"},
  {"name":"AutoComfort Yatak Seti","imgName":"resim_2024-08-09_225836761.png","imgSrc":"https://trendygoods.com.tr/storage/50/resim_2024-08-09_225836761.png","productLink":"https://trendygoods.com.tr/product/araba-yatagi","rating":"4.8","priceCurrent":"1299.00 TL","priceOriginal":"2000.00 TL"},
  {"name":"3D Kum Sanatı","imgName":"yenifrsta3.jpg","imgSrc":"https://trendygoods.com.tr/storage/56/yenifrsta3.jpg","productLink":"https://trendygoods.com.tr/product/kum-sanati","rating":"4.2","priceCurrent":"499.00 TL","priceOriginal":"450.00 TL"},
  {"name":"Televizyon Arkası Led","imgName":"resim_2024-12-27_085422283.png","imgSrc":"https://trendygoods.com.tr/storage/279/resim_2024-12-27_085422283.png","productLink":"https://trendygoods.com.tr/product/tv-arkasi-led","rating":"4.6","priceCurrent":"500.00 TL","priceOriginal":"499.00 TL"},
  {"name":"5'li Şeffaf Süper Yapışkan Askılık","imgName":"resim_2024-10-05_182429423.png","imgSrc":"https://trendygoods.com.tr/storage/105/resim_2024-10-05_182429423.png","productLink":"https://trendygoods.com.tr/product/yapiskanli-aski","rating":"4.8","priceCurrent":"295.00 TL","priceOriginal":"350.00 TL"},
  {"name":"Duvara Yapışan Tuvalet Fırçası","imgName":"resim_2024-10-05_202809404.png","imgSrc":"https://trendygoods.com.tr/storage/110/resim_2024-10-05_202809404.png","productLink":"https://trendygoods.com.tr/product/tuvalet-fircasi-siyah","rating":"4.8","priceCurrent":"373.00 TL","priceOriginal":null},
  {"name":"Çok Fonksiyonlu Tazyikli Musluk Başlığı","imgName":"resim_2024-10-06_092512445.png","imgSrc":"https://trendygoods.com.tr/storage/115/resim_2024-10-06_092512445.png","productLink":"https://trendygoods.com.tr/product/tazyikli-musluk-basligi","rating":"4.7","priceCurrent":"422.00 TL","priceOriginal":"500.00 TL"},
  {"name":"TrendySand Kum Sanatı (Deniz Rengi)","imgName":"resim_2024-10-23_070924251.png","imgSrc":"https://trendygoods.com.tr/storage/130/resim_2024-10-23_070924251.png","productLink":"https://trendygoods.com.tr/product/kum-sanati-mavi","rating":null,"priceCurrent":"435.00 TL","priceOriginal":"450.00 TL"},
  {"name":"Sensörlü Tezgah Altı Lamba","imgName":"resim_2024-10-27_124035023.png","imgSrc":"https://trendygoods.com.tr/storage/133/resim_2024-10-27_124035023.png","productLink":"https://trendygoods.com.tr/product/tezgah-lamba","rating":"4.9","priceCurrent":"599.00 TL","priceOriginal":"750.00 TL"},
  {"name":"Taşınabilir Projeksiyon","imgName":"resim_2024-11-03_123329458.png","imgSrc":"https://trendygoods.com.tr/storage/153/resim_2024-11-03_123329458.png","productLink":"https://trendygoods.com.tr/product/ekran-yansitici","rating":"4.8","priceCurrent":"2499.00 TL","priceOriginal":"3500.00 TL"},
  {"name":"3 Renk Modlu Masa Lambası","imgName":"resim_2025-02-08_175647926.png","imgSrc":"https://trendygoods.com.tr/storage/383/resim_2025-02-08_175647926.png","productLink":"https://trendygoods.com.tr/product/masa-lambasi","rating":"4.9","priceCurrent":"499.00 TL","priceOriginal":"650.00 TL"},
  {"name":"TrendyGlow 3x3 mt Perde LED Işıkları","imgName":"resim_2024-12-23_214326254.png","imgSrc":"https://trendygoods.com.tr/storage/255/resim_2024-12-23_214326254.png","productLink":"https://trendygoods.com.tr/product/perd-led","rating":"5.0","priceCurrent":"599.00 TL","priceOriginal":"850.00 TL"},
  {"name":"VolcanoAir Oda Nemlendiricisi","imgName":"resim_2025-01-02_173208712.png","imgSrc":"https://trendygoods.com.tr/storage/280/resim_2025-01-02_173208712.png","productLink":"https://trendygoods.com.tr/product/volkan-nemlendirici","rating":"4.6","priceCurrent":"799.00 TL","priceOriginal":"1200.00 TL"},
  {"name":"BrightPad - Yazı ve Resim Tahtası","imgName":"resim_2025-01-07_101401653.png","imgSrc":"https://trendygoods.com.tr/storage/286/resim_2025-01-07_101401653.png","productLink":"https://trendygoods.com.tr/product/cam-tahta","rating":null,"priceCurrent":"599.00 TL","priceOriginal":"950.00 TL"},
  {"name":"BrightPad - Yazı ve Resim Tahtası","imgName":"resim_2025-01-07_213931443.png","imgSrc":"https://trendygoods.com.tr/storage/298/resim_2025-01-07_213931443.png","productLink":"https://trendygoods.com.tr/product/cam-tahta-rw","rating":"5.0","priceCurrent":"599.00 TL","priceOriginal":"1200.00 TL"},
  {"name":"Araba içi Ayaklık Led","imgName":"resim_2025-01-10_223703357.png","imgSrc":"https://trendygoods.com.tr/storage/303/resim_2025-01-10_223703357.png","productLink":"https://trendygoods.com.tr/product/araba-led","rating":null,"priceCurrent":"550.00 TL","priceOriginal":"700.00 TL"},
  {"name":"Sürüklenebilir Nokta Çizim Tahtası","imgName":"resim_2025-03-07_222443084.png","imgSrc":"https://trendygoods.com.tr/storage/415/resim_2025-03-07_222443084.png","productLink":"https://trendygoods.com.tr/product/suruklenebilir-nokta-cizim-tahtasi","rating":null,"priceCurrent":"599.00 TL","priceOriginal":"850.00 TL"},
  {"name":"60 cm Sensörlü Lamba (4 ledli)","imgName":"resim_2024-10-27_124035023.png","imgSrc":"https://trendygoods.com.tr/storage/462/resim_2024-10-27_124035023.png","productLink":"https://trendygoods.com.tr/product/tezgah-lamba-60cm","rating":"4.9","priceCurrent":"699.00 TL","priceOriginal":"800.00 TL"},
  {"name":"Araç Şemsiyesi","imgName":"resim_2025-06-14_084237987.png","imgSrc":"https://trendygoods.com.tr/storage/504/resim_2025-06-14_084237987.png","productLink":"https://trendygoods.com.tr/product/arac-gunes-semsiyesi","rating":"4.7","priceCurrent":"599.00 TL","priceOriginal":"700.00 TL"},
  {"name":"Ahşap Ayak Masajı","imgName":"resim_2025-06-09_101049753.png","imgSrc":"https://trendygoods.com.tr/storage/488/resim_2025-06-09_101049753.png","productLink":"https://trendygoods.com.tr/product/ahsap-ayak-masaji","rating":"4.6","priceCurrent":"499.00 TL","priceOriginal":"700.00 TL"},
  {"name":"Sinek Raketi","imgName":"resim_2025-06-13_151235155.png","imgSrc":"https://trendygoods.com.tr/storage/501/resim_2025-06-13_151235155.png","productLink":"https://trendygoods.com.tr/product/sinek-raketi","rating":"4.9","priceCurrent":"599.00 TL","priceOriginal":"850.00 TL"},
  {"name":"Sinek Raketi","imgName":"resim_2025-06-14_113718564.png","imgSrc":"https://trendygoods.com.tr/storage/508/resim_2025-06-14_113718564.png","productLink":"https://trendygoods.com.tr/product/sinek-raketi-lp","rating":"4.9","priceCurrent":"599.00 TL","priceOriginal":"850.00 TL"},
  {"name":"Buzlu Vantilatör","imgName":"resim_2025-06-27_093728668.png","imgSrc":"https://trendygoods.com.tr/storage/514/resim_2025-06-27_093728668.png","productLink":"https://trendygoods.com.tr/product/buzlu-vantilator","rating":"4.9","priceCurrent":"799.00 TL","priceOriginal":"1200.00 TL"},
  {"name":"Vakumlu Tutacak","imgName":"resim_2025-06-27_172839505.png","imgSrc":"https://trendygoods.com.tr/storage/521/resim_2025-06-27_172839505.png","productLink":"https://trendygoods.com.tr/product/vakumlu-tutacak","rating":null,"priceCurrent":"499.00 TL","priceOriginal":"600.00 TL"},
  {"name":"Cilt Yenileyici Buz Kalıbı","imgName":"resim_2025-06-28_164740642.png","imgSrc":"https://trendygoods.com.tr/storage/527/resim_2025-06-28_164740642.png","productLink":"https://trendygoods.com.tr/product/cilt-yenileyici-buz-kalibi","rating":null,"priceCurrent":"399.00 TL","priceOriginal":"600.00 TL"},
  {"name":"Işıklı Yüksek Ses Party Box Karaoke Bluetooth Hoparlör","imgName":"resim_2025-07-05_122005655.png","imgSrc":"https://trendygoods.com.tr/storage/534/resim_2025-07-05_122005655.png","productLink":"https://trendygoods.com.tr/product/isikli-yuksek-ses-party-box-karaoke-bluetooth-hoparlor","rating":"4.8","priceCurrent":"650.00 TL","priceOriginal":"800.00 TL"},
  {"name":"Konuşan Kaktüs","imgName":"resim_2025-07-06_101718015.png","imgSrc":"https://trendygoods.com.tr/storage/540/resim_2025-07-06_101718015.png","productLink":"https://trendygoods.com.tr/product/konusan-kaktus","rating":"4.8","priceCurrent":"550.00 TL","priceOriginal":"650.00 TL"},
  {"name":"kristal lamba test","imgName":"resim_2025-06-27_173036837.png","imgSrc":"https://trendygoods.com.tr/storage/545/resim_2025-06-27_173036837.png","productLink":"https://trendygoods.com.tr/product/kristal-lamba-testfghkj","rating":"5.0","priceCurrent":"600.00 TL","priceOriginal":"600.00 TL"}
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductGrid products={products} />
      </main>
      <Footer />
    </div>
  );
}
