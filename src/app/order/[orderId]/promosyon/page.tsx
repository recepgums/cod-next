import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ScrollToTop from '../../../components/ScrollToTop';
import AnalyticsScripts from '../../../components/AnalyticsScripts';
import { FaGift, FaCheckCircle, FaCheck, FaChevronDown } from 'react-icons/fa';
import './promotion.css';

const promoProducts = [
  {
    "name": "Buzlu Vantilatör",
    "internalName": "Buzlu Fan",
    "productLink": "https://trendygoods.com.tr/product/buzlu-vantilator",
    "imgSrc": "https://trendygoods.com.tr/storage/514/resim_2025-06-27_093728668.png",
    "imgName": "resim_2025-06-27_093728668.png",
    "rating": "4.5",
    "priceCurrent": "599,00TL",
    "priceOriginal": "799.00TL",
    "productId": "169"
  },
  {
    "name": "Konuşan Kaktüs",
    "internalName": "Kaktüs",
    "productLink": "https://trendygoods.com.tr/product/konusan-kaktus",
    "imgSrc": "https://trendygoods.com.tr/storage/540/resim_2025-07-06_101718015.png",
    "imgName": "resim_2025-07-06_101718015.png",
    "rating": "4.5",
    "priceCurrent": "350,00TL",
    "priceOriginal": "550.00TL",
    "productId": "173"
  },
  {
    "name": "Ultra Su Emici Banyo Paspası",
    "internalName": "Banyo Paspası",
    "productLink": "https://trendygoods.com.tr/product/banyo-paspasi",
    "imgSrc": "https://trendygoods.com.tr/storage/58/resim_2024-08-28_083825924.png",
    "imgName": "resim_2024-08-28_083825924.png",
    "rating": "4.5",
    "priceCurrent": "199,00TL",
    "priceOriginal": "399.00TL",
    "productId": "2"
  },
  {
    "name": "Ahşap Ayak Masajı",
    "internalName": "Masaj Ayak",
    "productLink": "https://trendygoods.com.tr/product/ahsap-ayak-masaji",
    "imgSrc": "https://trendygoods.com.tr/storage/488/resim_2025-06-09_101049753.png",
    "imgName": "resim_2025-06-09_101049753.png",
    "rating": "4.7",
    "priceCurrent": "299,00TL",
    "priceOriginal": "499.00TL",
    "productId": "165"
  }
];

export default function PromotionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Order Confirmation Section */}
      <section className="mt-20 mb-30">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="order-confirmation-box p-4" style={{backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e0e0e0'}}>
                <h2 style={{fontSize: '1.8em', color: '#0b8123', fontWeight: 'bold', marginBottom: '15px'}}>
                  <i className="fas fa-check-circle mr-2"></i>SİPARİŞİNİZ ALINDI
                </h2>
                <div className="points-box mt-4 p-3" style={{backgroundColor: '#fff8e1', borderRadius: '8px', borderLeft: '4px solid #ffc107'}}>
                  <h4 style={{color: '#ff6a00', fontWeight: 'bold'}}>
                    <i className="fas fa-gift mr-2"></i>Tebrikler! Aşağıdaki ürünleri indirimli fiyatarıyla almaya hak kazandınız
                  </h4>
                  <span className="mb-0" style={{fontSize: '0.9em'}}>
                    *Dilediğiniz ürünü <b>'Sepete Ekle'</b> tuşuna basarak sepetinize ekleyebilirsiniz
                  </span>
                </div>
              </div>
          </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="container">
        <div className="row product-grid-3">
          {promoProducts.map((product, idx) => (
            <div key={idx} className="col-lg-3 col-md-4 col-sm-6 px-1">
              <div className="product-cart-wrap mb-30">
                <div className="product-img-action-wrap">
                  <div className="product-img product-img-zoom">
                    <a href={product.productLink}>
                      <img 
                        className="default-img"
                        src={product.imgSrc}
                        alt={product.name}
                        style={{width: '100%', height: 'auto'}}
                      />
                    </a>
                  </div>
                  <div className="product-badges product-badges-position product-badges-mrg">
                    <span className="hot">İndirimli</span>
                  </div>
                </div>
                
                <div className="product-content-wrap pt-2">
                  <h2>
                    <a href={product.productLink}>{product.name}</a>
                  </h2>
                  <div className="rating-result" title="96%">
                    <span>
                      <span>{product.rating}</span>
                    </span>
                  </div>
                  <div className="product-price">
                    <span className="old-price">{product.priceOriginal}</span>
                    <span style={{color: '#bb0000', fontWeight: '600'}}>{product.priceCurrent}</span>
                  </div>
                </div>
                
                <div className="row mb-30 mx-auto px-0">
                  <div className="col-12 pr-1">
                    <button 
                      className="btn w-100 btn-sm add-to-cart"
                      style={{
                        background: 'linear-gradient(180deg, #f27a1a 0%, #ff983f 100%)',
                        fontWeight: '600',
                        fontSize: '14px',
                        border: '0 solid',
                        color: '#fff'
                      }}
                      data-product-name={product.internalName}
                      data-product-id={product.productId}
                      data-product-price={product.priceCurrent.replace(',00TL', '').replace('TL', '')}
                    >
                      <i className="fi-rs-shopping-bag mr-5"></i>Sepete Ekle
                    </button>
                  </div>
                </div>
                
                <div id={`details-${idx}`} className="collapse px-3 pb-2">
                  <div className="short-desc mb-3">
                    <div className="emoji-benefits-container">
                      {product.name === "Buzlu Vantilatör" && (
                        <>
                          <p>❄️ <strong>Tek Kişilik Serinleme Çözümü</strong></p>
                          <p>💨 <strong>Soğuk Buhar ile Anında Ferahlık</strong></p>
                          <p>👍 <strong>7 Renkli Işık Modu</strong></p>
                          <p>🫶 <strong>Sıcak Günlerin Vazgeçilmezi</strong></p>
                          <p>🌙 <strong>Ultra Sessiz Gürültüsüz Çalışma</strong></p>
                          <p>💯 <strong>Kapıda Ödeme Kargo Bedava</strong></p>
                        </>
                      )}
                      {product.name === "Konuşan Kaktüs" && (
                        <>
                          <p>🎶 <strong>21 Farklı Şarkı ile Eğlenceli Dakikalar</strong></p>
                          <p>🎤 <strong>Ses Kayıt Özelliği ile Taklit Yeteneği</strong></p>
                          <p>😂 <strong>Oyun Oynarken Hareket Ediyor</strong></p>
                          <p>🎁 <strong>Çocuklar İçin Mükemmel Hediye</strong></p>
                          <p>👍 <strong>Sağlam ve Sorunsuz Teslimat</strong></p>
                          <p>💡 <strong>Işıklı Tasarımıyla Göz Alıcı</strong></p>
                        </>
                      )}
                      {product.name === "Ultra Su Emici Banyo Paspası" && (
                        <>
                          <p>💦 <strong>Ultra Su Emiciliği ile Anında Kuruluk</strong></p>
                          <p>🦶 <strong>Abdest Sonrası Rahatlık</strong></p>
                          <p>🚫 <strong>Kaymaz Taban ile Güvenli Kullanım</strong></p>
                          <p>🛁 <strong>Banyonuzun Olmazsa Olmazı</strong></p>
                          <p>🎁 <strong>40 X 60cm Ebatında</strong></p>
                          <p>🌈 <strong>Güzel Renkleriyle Banyonuza Estetik Katar</strong></p>
                        </>
                      )}
                      {product.name === "Ahşap Ayak Masajı" && (
                        <>
                          <p>🦶 <strong>Ayak ağrılarını hafifletir.</strong></p>
                          <p>😌 <strong>Rahatlatıcı bir etki sağlar.</strong></p>
                          <p>💪 <strong>Ayak kaslarını güçlendirir.</strong></p>
                          <p>👍 <strong>Kullanımı kolay ve pratiktir.</strong></p>
                          <p>🌱 <strong>Doğal ahşap malzemeden üretilmiştir.</strong></p>
                          <p>🎁 <strong>Sevdiklerinize hediye edebileceğiniz güzel bir seçenek.</strong></p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {product.name === "Buzlu Vantilatör" && (
                    <section>
                      <h2>Sıcak Yazlara Veda Edin!</h2>
                      <p>Buzlu Vantilatör ile kişisel serinliğinizi her yere taşıyın.</p>
                      <img src="https://trendygoods.com.tr/storage/514/resim_2025-06-27_093728668.png" style={{maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto'}} />
                      <h2>Tek Kişilik Klima Konforu</h2>
                      <p>Büyük klimalara veda edin, bireysel serinleme ihtiyaçlarınız için ideal çözüm.</p>
                      <h2>Anında Ferahlık, Dakikalar İçinde Serinleyin</h2>
                      <p>Soğuk buhar özelliği ile anında ferahlayın, yaz sıcaklarının etkisini azaltın.</p>
                      <h2>Bütçe Dostu Serinleme</h2>
                      <p>Yüksek fiyatlı klimalara alternatif, uygun fiyatlı ve etkili serinleme çözümü.</p>
                      <h2>Güvenlik Kulübesi ve Küçük Alanlar İçin Mükemmel</h2>
                      <p>Kısıtlı alanlarda bile serinliğin keyfini çıkarın, güvenlik kulübeleri için ideal boyut.</p>
                      <h2>Gece Lambası ile Huzurlu Uyku</h2>
                      <p>Gece lambası özelliği sayesinde hem serinleyin hem de rahatlatıcı bir ortam yaratın.</p>
                      <img src="https://trendygoods.com.tr/storage/515/resim_2025-06-27_095050476.png" style={{maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto'}} />
                      <h2>Kaliteli Malzeme, Uzun Ömürlü Kullanım</h2>
                      <p>Dayanıklı malzemeler sayesinde uzun yıllar güvenle kullanın.</p>
                      <h2>Hemen Alın, Yazın Keyfini Çıkarın!</h2>
                      <p>Sıcaklara veda etme zamanı geldi. Buzlu Vantilatör ile serin ve konforlu bir yaz geçirin.</p>
                    </section>
                  )}
                  
                  {product.name === "Konuşan Kaktüs" && (
                    <section>
                      <h2>Eğlenceyi Eve Getirin</h2>
                      <p>🎶 <strong>21 Farklı Şarkı ile Eğlenceli Dakikalar:</strong> Çocuğunuzun müzikle dolu keyifli anlar yaşamasına olanak tanıyın.</p>
                      <img src="https://trendygoods.com.tr/storage/539/resim_2025-07-06_094148266.png" alt="Konuşan Kaktüs" style={{maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto'}} />
                      <br />
                      <h2>Öğrenmeyi Destekleyin</h2>
                      <p>🎤 <strong>Ses Kayıt Özelliği ile Taklit Yeteneği:</strong> Çocuğunuzun konuşma becerilerini geliştirirken eğlenmesini sağlayın.</p>
                      <img src="https://trendygoods.com.tr/storage/540/resim_2025-07-06_101718015.png" alt="Konuşan Kaktüs" style={{maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto'}} />
                      <br />
                      <h2>Oyun Oynarken Geliştirin</h2>
                      <p>😂 <strong>Oyun Oynarken Gözleri Hareket Ediyor:</strong> Eğlenceli tasarımı ile çocuğunuzun dikkatini çeker ve oyun saatlerini daha keyifli hale getirir.</p>
                      <h2>Hediye Seçimi Derdine Son</h2>
                      <p>🎁 <strong>Çocuklar İçin Mükemmel Hediye Seçeneği:</strong> Doğum günleri veya özel günler için ideal, unutulmaz bir hediye alternatifi.</p>
                      <h2>Göz Alıcı Tasarım</h2>
                      <p>💡 <strong>Işıklı Tasarımıyla Göz Alıcı:</strong> Çocuğunuzun odasına renk katar, gece lambası olarak da kullanılabilir.</p>
                    </section>
                  )}
                  
                  {product.name === "Ultra Su Emici Banyo Paspası" && (
                    <>
                      <p><img alt="paspas.jpg" src="https://cdn.shopify.com/s/files/1/0829/8371/5122/files/paspas.jpg?v=1701017039" style={{width: '350px'}} /></p>
                      <p>&nbsp;</p>
                      <p>&nbsp;</p>
                      <table>
                        <tbody>
                          <tr>
                            <td><img alt="water-drop.png" src="https://cdn.shopify.com/s/files/1/0829/8371/5122/files/water-drop.png?v=1700937143" style={{height: '128px', width: '128px'}} /></td>
                            <td>
                              <h3><strong>💧 Süper Emici</strong></h3>
                              <p>Yenilikçi, gelişmiş nano gözenekli deri yüzeyi, herhangi bir filigran veya leke bırakmadan damlayan suyu anında emebilir. Banyo zeminini temiz, kuru ve güvenli tutmak için küvetin, duş kapısının veya lavabonun önünde rahatlıkla kullanılabilir.</p>
                            </td>
                          </tr>
                          <tr>
                            <td><img alt="wipe.png" src="https://cdn.shopify.com/s/files/1/0829/8371/5122/files/wipe.png?v=1700937143" style={{height: '128px', width: '128px'}} /></td>
                            <td>
                              <h3><strong>🧼 Kolay Temizlenebilir</strong></h3>
                              <p>Süper Su Emici Banyo Paspasında az miktarda toz varsa elektrikli süpürge kullanarak bunu temizleyebilirsiniz. Yağ lekelerinin temizlenmesi de kolaydır; yıkamak için biraz deterjan damlatabilir ve ardından suyla durulayabilirsiniz.</p>
                            </td>
                          </tr>
                          <tr>
                            <td><img alt="quick-dry.png" src="https://cdn.shopify.com/s/files/1/0829/8371/5122/files/quick-dry.png?v=1700937143" style={{height: '128px', width: '128px'}} /></td>
                            <td>
                              <h3><strong>🌬️ Hızlı Kuruma</strong></h3>
                              <p>Süper Su Emici Banyo Paspasının içindeki çok sayıda küçük gözenek, suyun doğal havada hızla buharlaşmasını sağlar. Hızlı kuruyan banyo paspası bir sonraki kullanıcı için fazla nemli olmayacaktır.</p>
                            </td>
                          </tr>
                          <tr>
                            <td><img alt="slip.png" src="https://cdn.shopify.com/s/files/1/0829/8371/5122/files/slip.png?v=1700937143" style={{height: '128px', width: '128px'}} /></td>
                            <td>
                              <h3><strong>🚫 Kaymaz Taban</strong></h3>
                              <p>Kauçuk destekli Süper Su Emici Banyo Paspası diğer paspaslara kıyasla ıslak zeminde kaymaya karşı dirençlidir. Dayanıklı kauçuk destek aynı zamanda suyun alttan sızmasını ve yere akmasını da önler.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p>&nbsp;</p>
                      <p>&nbsp;</p>
                      <p><img alt="giphy" src="https://cdn.shopify.com/s/files/1/0829/8371/5122/files/giphy_6922fcc3-d38a-4c88-b781-6778695ade6e.gif?v=1704211578" style={{height: '480px', width: '278px'}} /></p>
                    </>
                  )}
                  
                  {product.name === "Ahşap Ayak Masajı" && (
                    <img src="https://trendygoods.com.tr/storage/487/resim_2025-06-09_100456047.png" style={{width: '100%'}} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Green Button */}
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center">
        <button
              className="btn btn-success btn-lg w-100"
          style={{ 
            backgroundColor: '#088178',
                borderColor: '#046963',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
            fontFamily: 'Lato, sans-serif',
            fontSize: '12px'
          }}
        >
          <FaCheck className="mr-2" size={12} />
          Siparişimi Tamamla
        </button>
      </div>
        </div>
      </div>
      
      <Footer />
      <ScrollToTop />
      <AnalyticsScripts />
    </div>
  );
} 