import React, { useState } from 'react';
import NovaSlider from './component/NovaSlider';
import './lightTemplate.css';

interface LightTemplateProps {
    product: any;
}

const LightTemplate: React.FC<LightTemplateProps> = ({ product }) => {
    const [selectedOption, setSelectedOption] = useState(0);

    // Static data matching the image
    const staticImages = [
        {
            thumbnail: 'https://techmisty.com/cdn/shop/files/kap1.png?v=1746228208&width=713',
            medium: 'https://techmisty.com/cdn/shop/files/kap1.png?v=1746228208&width=713',
            large: 'https://techmisty.com/cdn/shop/files/kap1.png?v=1746228208&width=713',
            mobile: 'https://techmisty.com/cdn/shop/files/kap1.png?v=1746228208&width=713',
            original: 'https://techmisty.com/cdn/shop/files/kap1.png?v=1746228208&width=713'
        },
        {
            thumbnail: 'https://techmisty.com/cdn/shop/files/foto11.png?v=1746228208&width=713',
            medium: 'https://techmisty.com/cdn/shop/files/foto11.png?v=1746228208&width=713',
            large: 'https://techmisty.com/cdn/shop/files/foto11.png?v=1746228208&width=713',
            mobile: 'https://techmisty.com/cdn/shop/files/foto11.png?v=1746228208&width=713',
            original: 'https://techmisty.com/cdn/shop/files/foto11.png?v=1746228208&width=713'
        },
        {
            thumbnail: 'https://techmisty.com/cdn/shop/files/3.png?v=1746228208&width=713',
            medium: 'https://techmisty.com/cdn/shop/files/3.png?v=1746228208&width=713',
            large: 'https://techmisty.com/cdn/shop/files/3.png?v=1746228208&width=713',
            mobile: 'https://techmisty.com/cdn/shop/files/3.png?v=1746228208&width=713',
            original: 'https://techmisty.com/cdn/shop/files/3.png?v=1746228208&width=713'
        },
        {
            thumbnail: 'https://techmisty.com/cdn/shop/files/uuuuu333.png?v=1755289728&width=713',
            medium: 'https://techmisty.com/cdn/shop/files/uuuuu333.png?v=1755289728&width=713',
            large: 'https://techmisty.com/cdn/shop/files/uuuuu333.png?v=1755289728&width=713',
            mobile: 'https://techmisty.com/cdn/shop/files/uuuuu333.png?v=1755289728&width=713',
            original: 'https://techmisty.com/cdn/shop/files/uuuuu333.png?v=1755289728&width=713'
        }
    ];


    return (
        <div className="light-template">
            <div className="light-header">
                <div className="light-nav">
                    <a href="#">Ana Sayfa</a>
                    <a href="#">Ürünler</a>
                    <a href="#">İletişim</a>
                </div>
                <div className="light-logo">
                    {product.logoUrl ? (
                        <img src={product.logoUrl} alt="Logo" style={{height: '40px'}} />
                    ) : (
                        "Tech Misty"
                    )}
                </div>
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

                    <div className="emoji-benefits-container">
                        <p>👶
                            <strong>Düşmelere karşı yumuşak ve hafif koruma!</strong><br /><br />✨ <strong>Ayarlanabilir kayışlarla her bebeğe
                                uygun tasarım.</strong><br /><br />🔄 <strong>14 Gün İçinde İade Garantisi.</strong><br /><br />💳 <strong>Kapıda
                                    Ödeme ve Güvenli Alışveriş İmkanı.</strong><br /><br />🎁 <strong>Yeni yürümeye başlayan bebekler için mükemmel
                                        bir hediye!</strong>
                        </p>
                    </div>

                    <div className="quantity-breaks-container">
                        <h3 className="quantity-breaks__title">
                            <span></span>
                            <span>ÇOK AL - AZ ÖDE</span>
                            <span></span>
                        </h3>
                        <label htmlFor="quantity1" className="quantity-break" data-quantity="1">
                            <div className="quantity-break__content">
                                <div className="quantity-break__left">
                                    <span className="quantity-break__label">
                                        <span className="quantity-break__label-text">1 Adet</span>
                                    </span>
                                    <span className="quantity-break__caption">
                                        Ücretsiz Kargo | Kapıda Ödeme
                                    </span>
                                </div>
                                <div className="quantity-break__right" id="option-1-price-template--18301925163055__main">
                                    <span className="quantity-break__price">629.90TL</span>
                                    <span className="quantity-break__compare-price">1,259.80TL</span>
                                </div>
                            </div>
                            <div className="quantity-break__variants" id="option-1-variant-template--18301925163055__main">
                                <div className="quantity-break__selector-item">
                                    <span className="quantity-break__selector-item__number">#1</span>
                                    <div className="select select--small">
                                        <select
                                            className="quantity-break__variant-select select__select variant-dropdown"
                                            name="id"
                                            aria-label="Select variant"
                                            defaultValue="44430292779055"
                                        // onChange={e => quantityBreakVariantChange(e, 1, 1)}
                                        >
                                            <option value="44430292779055" data-compare-price="125980" data-price="62990">
                                                Arı
                                            </option>
                                            <option value="43692722454575" data-compare-price="125980" data-price="62990">
                                                Kaplumbağa
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </label>

                        <label htmlFor="quantity2" className="quantity-break" data-quantity="2">
                            <p className="quantity-break__badge">
                                EN ÇOK SATAN
                            </p>
                            <div className="quantity-break__content">
                                <div className="quantity-break__left">
                                    <span className="quantity-break__label">
                                        <span className="quantity-break__label-text">2 Adet</span>
                                        <span className="quantity-break__benefit">200 TL İndirim</span>
                                    </span>
                                    <span className="quantity-break__caption">
                                        Ücretsiz Kargo | Kapıda Ödeme
                                    </span>
                                </div>
                                <div className="quantity-break__right" id="option-2-price-template--18301925163055__main">
                                    <span className="quantity-break__price">1,059.80TL</span>
                                    <span className="quantity-break__compare-price">2,519.60TL</span>
                                </div>
                            </div>
                            <div className="quantity-break__variants" id="option-2-variant-template--18301925163055__main">
                                <div className="quantity-break__selector-item">
                                    <span className="quantity-break__selector-item__number">#1</span>
                                    <div className="select select--small">
                                        <select
                                            className="quantity-break__variant-select select__select variant-dropdown"
                                            name="id"
                                            aria-label="Select variant"
                                            defaultValue="44430292779055"
                                        // onChange={e => quantityBreakVariantChange(e, 2, 1)}
                                        >
                                            <option value="44430292779055" data-compare-price="125980" data-price="62990">
                                                Arı
                                            </option>
                                            <option value="43692722454575" data-compare-price="125980" data-price="62990">
                                                Kaplumbağa
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="quantity-break__selector-item">
                                    <span className="quantity-break__selector-item__number">#2</span>
                                    <div className="select select--small">
                                        <select
                                            className="quantity-break__variant-select select__select variant-dropdown"
                                            name="id"
                                            aria-label="Select variant"
                                            defaultValue="44430292779055"
                                        // onChange={e => quantityBreakVariantChange(e, 2, 2)}
                                        >
                                            <option value="44430292779055" data-compare-price="125980" data-price="62990">
                                                Arı
                                            </option>
                                            <option value="43692722454575" data-compare-price="125980" data-price="62990">
                                                Kaplumbağa
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </label>

                        <label htmlFor="quantity3" className="quantity-break" data-quantity="3">
                            <div className="quantity-break__content">
                                <div className="quantity-break__left">
                                    <span className="quantity-break__label">
                                        <span className="quantity-break__label-text">3 Adet</span>
                                        <span className="quantity-break__benefit">300 TL İndirim</span>
                                    </span>
                                    <span className="quantity-break__caption">
                                        Ücretsiz Kargo | Kapıda Ödeme
                                    </span>
                                </div>
                                <div className="quantity-break__right" id="option-3-price-template--18301925163055__main">
                                    <span className="quantity-break__price">1,589.70TL</span>
                                    <span className="quantity-break__compare-price">3,779.40TL</span>
                                </div>
                            </div>
                            <div className="quantity-break__variants" id="option-3-variant-template--18301925163055__main">
                                <div className="quantity-break__selector-item">
                                    <span className="quantity-break__selector-item__number">#1</span>
                                    <div className="select select--small">
                                        <select
                                            className="quantity-break__variant-select select__select variant-dropdown"
                                            name="id"
                                            aria-label="Select variant"
                                            defaultValue="44430292779055"
                                        // onChange={e => quantityBreakVariantChange(e, 3, 1)}
                                        >
                                            <option value="44430292779055" data-compare-price="125980" data-price="62990">
                                                Arı
                                            </option>
                                            <option value="43692722454575" data-compare-price="125980" data-price="62990">
                                                Kaplumbağa
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="quantity-break__selector-item">
                                    <span className="quantity-break__selector-item__number">#2</span>
                                    <div className="select select--small">
                                        <select
                                            className="quantity-break__variant-select select__select variant-dropdown"
                                            name="id"
                                            aria-label="Select variant"
                                            defaultValue="44430292779055"
                                        // onChange={e => quantityBreakVariantChange(e, 3, 2)}
                                        >
                                            <option value="44430292779055" data-compare-price="125980" data-price="62990">
                                                Arı
                                            </option>
                                            <option value="43692722454575" data-compare-price="125980" data-price="62990">
                                                Kaplumbağa
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="quantity-break__selector-item">
                                    <span className="quantity-break__selector-item__number">#3</span>
                                    <div className="select select--small">
                                        <select
                                            className="quantity-break__variant-select select__select variant-dropdown"
                                            name="id"
                                            aria-label="Select variant"
                                            defaultValue="44430292779055"
                                        // onChange={e => quantityBreakVariantChange(e, 3, 3)}
                                        >
                                            <option value="44430292779055" data-compare-price="125980" data-price="62990">
                                                Arı
                                            </option>
                                            <option value="43692722454575" data-compare-price="125980" data-price="62990">
                                                Kaplumbağa
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>


                    <div>
                        <div className="product-form-buttons">
                            <button className="add-to-cart">
                                <span>Sepete Ekle</span>
                            </button>

                            <button className="buy-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25.3px" viewBox="0 0 24 24"
                                    className="_rsi-button-icon _rsi-button-icon-left" fill="rgba(255,255,255,1)">
                                    <path d="M0 0h24v24H0V0z" fill="none"></path>
                                    <path
                                        d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z">
                                    </path>
                                </svg>
                                <span>Kapıda Ödeme ile Satın Al</span>
                                <span>ÜCRETSİZ KARGO</span>
                            </button>
                        </div>
                    </div>
                    <div className="centered-container-limited-stock">
                        <div className="limited-stock-alert">
                            <span className="blinking-circle"></span>
                            Stoklar Tükenmek Üzere
                        </div>
                    </div>

                    <div className="custom-image-container">
                        <img src="//techmisty.com/cdn/shop/files/odemeyontemleri.jpg?v=11923979855570504591" alt="Ödeme Yöntemleri"
                            className="custom-image" />
                    </div>

                    <div
                        style={{
                            border: "1px solid #d0d4eb",
                            padding: "10px",
                            textAlign: "center",
                            fontFamily: "Arial, sans-serif",
                            maxWidth: "600px",
                            margin: "auto",
                            marginBottom: "20px"
                        }}
                    >
                        <h4 style={{ marginBottom: "5px", fontSize: "14px" }}>
                            Bugün sipariş verirseniz kargonuz <strong id="delivery-date">11 Eylül</strong> tarihinde teslim edilecek!
                        </h4>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px" }}>
                            <div style={{ textAlign: "center", flexBasis: "30%", fontSize: "12px" }}>
                                <div style={{ fontSize: "20px" }}>🛍️</div>
                                <div style={{ marginTop: "5px", fontSize: "12px" }}>Sipariş Verildi</div>
                                <div style={{ fontSize: "10px", color: "gray" }}>Bugün</div>
                            </div>

                            <div style={{ textAlign: "center", flexBasis: "30%", fontSize: "12px" }}>
                                <div style={{ fontSize: "20px" }}>🚚</div>
                                <div style={{ marginTop: "5px", fontSize: "12px" }}>Gönderildi</div>
                                <div style={{ fontSize: "10px", color: "gray" }} id="dispatch-date">9 Eylül</div>
                            </div>

                            <div style={{ textAlign: "center", flexBasis: "30%", fontSize: "12px" }}>
                                <div style={{ fontSize: "20px" }}>📍</div>
                                <div style={{ marginTop: "5px", fontSize: "12px" }}>Teslim Edildi</div>
                                <div style={{ fontSize: "10px", color: "gray" }} id="delivered-date">11 Eylül</div>
                            </div>
                        </div>
                    </div>

                    <div className="countdown-timer">
                        <h2>Sana Özel İndirimi Kaçırma</h2>
                        <p>İndirim şu sürede sona eriyor:</p>
                        <div className="countdown">Süre Doldu!</div>
                    </div>
                </div>

                <div className="kayan-yazi">
                    <div className="horizontal-ticker__container">
                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>

                        <p className="horizontal-ticker__item">
                            KAPIDA ÖDEME
                        </p>
                        
                        <p className="horizontal-ticker__item">
                            ŞEFFAF KARGO
                        </p>
                        <p className="horizontal-ticker__item">
                            2. ÜRÜN 200₺ İNİDİRİMLİ
                        </p>
                    </div>
                </div>
                {/*  */}

            </div>
        </div>
    );
};

export default LightTemplate;
