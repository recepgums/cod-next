import React, { useState } from 'react';
import NovaSlider from './component/NovaSlider';
import './lightTemplate.css';

const LightTemplate: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState(0);

    // Static data matching the image
    const staticImages = [
        'https://techmisty.com/cdn/shop/files/kap1.png?v=1746228208&width=713',
        'https://techmisty.com/cdn/shop/files/foto11.png?v=1746228208&width=713',
        'https://techmisty.com/cdn/shop/files/3.png?v=1746228208&width=713',
        'https://techmisty.com/cdn/shop/files/uuuuu333.png?v=1755289728&width=713',

    ];


    return (
        <div className="light-template">
            <div className="light-header">
                <div className="light-nav">
                    <a href="#">Ana Sayfa</a>
                    <a href="#">Ürünler</a>
                    <a href="#">İletişim</a>
                </div>
                <div className="light-logo">Tech Misty</div>
                <div className="light-user-actions">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4m-5 4a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </div>
            </div>

            <div className="light-main-content">
                <div className="light-product-images">
                    <NovaSlider images={staticImages} productName="Bebek Baş Koruma Çantası" />
                </div>

                <div className="light-product-info">
                    <div className="light-promo-banner">
                        ÜCRETSİZ KARGO | KAPIDA ÖDEME
                    </div>

                    <div className="light-shipping-info">
                        <div className="light-shipping-badge"
                            style={{
                                background: '#CEFFDE',
                            }}
                        >
                            🚚 Kapıda Ödeme
                        </div>
                        <div className="light-shipping-badge"
                            style={{
                                background: '#fff9db',
                            }}
                        >
                            🕒 7/24 Destek
                        </div>
                        <div className="light-shipping-badge"
                            style={{
                                background: '#9dd9f3',
                            }}
                        >
                            🔄 14 Günde İade
                        </div>
                    </div>

                    <div className="rating-container">
                        <svg className="star" viewBox="0 0 47.94 47.94"><path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path></svg>
                        <svg className="star" viewBox="0 0 47.94 47.94"><path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path></svg>
                        <svg className="star" viewBox="0 0 47.94 47.94"><path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path></svg>
                        <svg className="star" viewBox="0 0 47.94 47.94"><path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path></svg>
                        <svg className="star" viewBox="0 0 47.94 47.94"><path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"></path></svg>


                        4.7/5 (1,419 Müşteri Yorumu)
                    </div>

                    <h1 className="light-product-title">
                        Bebek Baş Koruma Çantası
                    </h1>

                    <div className="message-container">
                        <div className="message-list">
                            <div className="message">
                                <span>🚀</span>
                                <span>Son 3 günde <span style={{ color: "#BE29EC" }}>150+ adet</span> ürün satıldı!!</span>
                            </div>
                            <div className="message">
                                <span>💜</span>
                                <span>Müşteri favorisi!   <span style={{ color: "#BE29EC" }}>4.7 yıldız</span> ortalamasıyla!</span>
                            </div>
                            <div className="message">
                                <span>🛒</span>
                                <span><span style={{ color: "#BE29EC" }}>38 kişinin</span> sepetinde, tükenmeden al!</span>
                            </div>
                            <div className="message">
                                <span>👀</span>
                                <span>Son 24 saatte <span style={{ color: "#BE29EC" }}>2.1B kişi</span> görüntüledi!</span>
                            </div>
                        </div>
                    </div>

                    <div className="price-container">
                        <div className="price-large">
                            <div className="price__container"><div className="price__regular">
                                <span className="visually-hidden visually-hidden--inline">Normal fiyat</span>
                                <span className="price-item price-item--regular">
                                    489.90TL
                                </span>
                            </div>
                                <div className="price__sale ">
                                    <span className="visually-hidden visually-hidden--inline regular-price-label">İndirimli fiyat</span>
                                    <span className="price-item price-item--sale price-item--last">
                                        489.90TL
                                    </span>
                                    <span className="visually-hidden visually-hidden--inline compare-price-label">Normal fiyat</span>
                                    <span className="price__compare-price">
                                        <s className="price-item price-item--regular">
                                            979.80TL
                                        </s>
                                    </span></div>
                                <small className="unit-price caption hidden">
                                    <span className="visually-hidden">Birim fiyat</span>
                                    <span className="price-item price-item--last">
                                        <span></span>
                                        <span aria-hidden="true">/</span>
                                        <span className="visually-hidden">&nbsp;/&nbsp;</span>
                                        <span>
                                        </span>
                                    </span>
                                </small>
                            </div><span className="badge price__badge-sale color-accent-2">


                                <svg aria-hidden="true" focusable="false" className="icon icon-discount color-foreground-text" viewBox="0 0 12 12">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0h3a2 2 0 012 2v3a1 1 0 01-.3.7l-6 6a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4l6-6A1 1 0 017 0zm2 2a1 1 0 102 0 1 1 0 00-2 0z" fill="currentColor">
                                    </path></svg>
                                <span className="nowrap">İNDİRİM 50%</span>
                            </span>

                            <span className="badge price__badge-sold-out color-inverse">
                                Tükendi
                            </span></div>
                    </div>



                    {/* <div className="light-pricing">
                        <span className="light-current-price">489.90TL</span>
                        <span className="light-old-price">979.80TL</span>
                        <span className="light-discount-badge">İNDİRİM 50%</span>
                    </div> */}

                    <ul className="light-features">
                        <li>Düşmelere karşı yumuşak ve hafif koruma!</li>
                        <li>Ayarlanabilir kayışlarla her bebeğe uygun tasarım.</li>
                        <li>14 Gün İçinde İade Garantisi.</li>
                        <li>Kapıda Ödeme ve Güvenli Alışveriş İmkanı.</li>
                        <li>Yeni yürümeye başlayan bebekler için mükemmel bir hediye!</li>
                    </ul>

                    <div className="light-quantity-section">
                        <div className="light-quantity-header">
                            <div className="light-quantity-title">ÇOK AL - AZ ÖDE</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LightTemplate;
