'use client';

import '../Nova.css';
import React, { useState, useEffect, useMemo } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
import CommentsSection from './components/CommentsSection';
import NovaSlider from './component/NovaSlider';
import NovaHeader from './component/NovaHeader';

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

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
    title?: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice: number;
    discount: string;
    images: ProductImage[];
    options: ProductOption[];
    features: string[];
    rating: number;
    commentCount: number;
    comments: ProductComment[];
    cities: any[];
    pixels?: { platform: string; pixel_id: string }[];
    template?: string;
    logoUrl?: string;
    content?: string;
    settings?: string;
}

interface ProductImage {
    thumbnail: string;
    medium: string;
    large: string;
    mobile: string;
    original: string;
}

interface ProductComment {
    id: number;
    author: string;
    content: string;
    rating: number;
    photo?: string;
    order?: number | null;
}

export default function NovaTemplate({ product }: { product: Product }) {
    console.log('🎨 NovaTemplate rendering with product:', product);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [selectedCount, setSelectedCount] = useState<number>(1);
    const [variants, setVariants] = useState<any>({});
    const [selectedVariants, setSelectedVariants] = useState<any[]>([]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);


    const selectOption = (option: ProductOption) => {
        setSelectedOption(option);
    };

    // Settings'i parse et
    const parsedSettings = useMemo(() => {
        try {
            const settings = product?.settings;
            const parsed = settings && typeof settings === 'string' ? JSON.parse(settings) : settings;
            console.log('⚙️ Parsed settings:', parsed);
            return parsed || {};
        } catch (error) {
            console.error('❌ Error parsing settings:', error);
            return {};
        }
    }, [product?.settings]);

    // Ürün içeriğini (HTML) memoize et
    const memoizedProductContent = useMemo(() => {
        return product.content ? { __html: product.content } : null;
    }, [product.content]);


    const dummyOrder = {
        id: 1,
        name: "Rexing Link Kablosuz CarPlay Adaptör",
        price: 2599.99,
        images: [
            {
                thumbnail: "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296",
                medium: "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296",
                large: "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296",
                mobile: "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296",
                original: "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296"
            },
            {
                thumbnail: "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
                medium: "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
                large: "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
                mobile: "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
                original: "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296"
            }
        ],
        options: [
            {
                quantity: 1,
                price: 2599.99,
                original: 3600.00,
                discount: 28,
                badge: "1 Adet",
                displayText: "1 Adet"
            },
            {
                quantity: 2,
                price: 4939.98,
                original: 7200.00,
                discount: 33,
                badge: "2 Adet - EKSTRA %5 İNDİRİM!",
                displayText: "2 Adet"
            },
            {
                quantity: 3,
                price: 7019.97,
                original: 10800.00,
                discount: 35,
                badge: "3 Adet - EKSTRA %10 İNDİRİM!",
                displayText: "3 Adet"
            }
        ],
        cities: product.cities,
        settings: ""
    }

    const formatNumber = (number: number) => {
        return number.toLocaleString('tr-TR');
    }

    // old price ve new price arasındaki farkın yüzdesini hesaplayan fonksiyon yazılacak
    const calculateDiscount = (oldPrice: number, newPrice: number) => {
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    }

    // Variants'ları parse et
    useEffect(() => {
        if (!parsedSettings?.variants) return;
        try {
            let rawVariants = parsedSettings.variants;

            // If variants is a JSON string, parse it
            if (typeof rawVariants === 'string') {
                try {
                    rawVariants = JSON.parse(rawVariants);
                } catch {
                    rawVariants = undefined;
                }
            }

            // If variants is an array like [{ name, type, stock, alias }, ...],
            // group by type to build select options per type.
            if (Array.isArray(rawVariants)) {
                const grouped: Record<string, { title: string; options: string[] }> = {};
                rawVariants.forEach((v: any) => {
                    const typeKey = (v?.type || 'Seçenek').toString();
                    const optionName = (v?.name || '').toString();
                    if (!grouped[typeKey]) grouped[typeKey] = { title: typeKey, options: [] };
                    if (optionName && !grouped[typeKey].options.includes(optionName)) {
                        grouped[typeKey].options.push(optionName);
                    }
                });
                setVariants(grouped);
                console.log('🎨 Variants grouped:', grouped);
                return;
            }

            // If variants is already an object map { type: { title, options[] }, ... }
            if (rawVariants && typeof rawVariants === 'object') {
                setVariants(rawVariants);
            }
        } catch (error) {
            console.error('❌ Error parsing variants:', error);
        }
    }, [parsedSettings?.variants]);

    // Update variant fields when quantity changes
    useEffect(() => {
        if (selectedOption && Object.keys(variants).length > 0) {
            const quantity = selectedOption.quantity;
            const newSelectedVariants = Array(quantity).fill(null)?.map(() => ({}));
            setSelectedVariants(newSelectedVariants);
            console.log('🛍️ Updated selected variants for quantity:', quantity, newSelectedVariants);
        }
    }, [selectedOption, variants]);

    const handleVariantChange = (index: number, type: string, value: string) => {
        const newSelectedVariants = [...selectedVariants];
        newSelectedVariants[index] = { ...newSelectedVariants[index], [type]: value };
        setSelectedVariants(newSelectedVariants);
        console.log('🔄 NovaTemplate variant changed:', { index, type, value, selectedVariants: newSelectedVariants });
    };

    const handleOrderModalVariantChange = (newVariants: any[]) => {
        setSelectedVariants(newVariants);
        console.log('🔄 OrderModal variant change received:', newVariants);
    };

    useEffect(() => {
        if (product.options && product.options.length > 0) {
            setSelectedOption(product.options[0]);
        }
    }, []);

    const categories = [
        { id: "ana-sayfa", name: "Ana Sayfa", href: "/" },
        { id: "arac-ici-kameralar", name: "Araç İçi Kameralar", href: "/kategori/arac-ici-kameralar" },
        { id: "kask-interkoma", name: "Kask İnterkomları", href: "/kategori/kask-interkoma" },
        { id: "aksesuarlar", name: "Aksesuarlar", href: "/kategori/aksesuarlar" },
        { id: "hakkimizda", name: "Hakkımızda", href: "/hakkimizda" },
    ];

    return (
        <>
            <NovaHeader
                logoSrc={product.logoUrl || "https://rexingtr.com/cdn/shop/files/blue_rexinglogo_hd.png?v=1743567206&width=500"}
                logoAlt="Logo"
                categories={categories}
                backgroundColor="#ffffff"
                textColor="#333333"
            />
            <div className="nova-template">
                <div className="nova-slider-wrapper">
                    <NovaSlider
                        images={product.images}
                        productName={product.name}
                    />
                </div>

                <div style={{ padding: "2px 20px 0" }}>
                    <div>
                        <div className="d-flex" style={{ lineHeight: "1.0" }}>
                            <div>
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        height="20"
                                        width="20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 256 256"
                                        fill="currentColor"
                                        data-id={`508817759863701864-${i}`}
                                        style={{ marginRight: 4, color: "#ffcd3c", height: "14px", width: "auto" }}
                                    >
                                        <path
                                            fill="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"
                                        ></path>
                                    </svg>
                                ))}
                            </div>

                            <p className='rate-text'><span>4.8 | <strong>10.000+</strong> Mutlu Müşteri!</span></p>

                        </div>
                    </div>
                    <div className='product-title'>
                        <span style={{ color: "#000000", fontSize: "18px", fontWeight: "700" }}> <strong className='text-capitalize'>{product.name}</strong></span>
                    </div>

                    <div className='attributes'>
                        <div className='d-flex flex-wrap'>
                            {product.features.map((item, index) => (
                                <div key={index} className="attributes-item w-50 d-flex gap-2" style={{ marginTop: "10px", marginBottom: "5px" }}>
                                    <span style={{ fontSize: "15px" }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="price-container d-flex align-items-center" style={{ gap: "4px" }}>
                        <div className="">
                            <span className="price">{formatNumber(product.price)}TL</span>
                        </div>
                        <div className="">
                            <span className="oldPrice">{formatNumber(product.oldPrice)}TL</span>
                        </div>
                        <div className=" text-white discount-container">
                            <span className='discount d-md-none'> {calculateDiscount(product.oldPrice, product.price)}% İNDİRİM</span>
                        </div>
                    </div>

                    <div className='campaign-text'>
                        <p className='text-center' style={{ fontSize: "16px" }}>DAHA FAZLA AL, DAHA AZ ÖDE!</p>
                    </div>

                    <div className="count-containers">
                        {product.options.map((item, index) => (
                            <div className={`count-item-wrapper ${selectedCount === index ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedCount(index);
                                    setSelectedOption(product.options[index]);
                                }}
                            >
                                <div className="count-item">
                                    <div className="d-flex align-items-center" style={{ gap: "18px" }}>
                                        <div className="bar"></div>
                                        <div className="count-and-price d-flex justify-content-between w-100">
                                            <div className='d-flex align-items-center'>
                                                <span className='count-in-box'>{item.title}</span>
                                            </div>
                                            <div className='d-flex flex-column'>
                                                <p className='price-in-box text-center'>{formatNumber(item.price - item.discount)}TL</p>
                                                {(item.discount > 0) && (
                                                    <p className='oldPrice-in-box text-center'>{formatNumber(item.price)}TL</p>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Variant Selection */}
                    {Object.keys(variants || {}).length > 0 && (
                        <div className="variant-selection-container" style={{ 
                            marginTop: "20px", 
                            marginBottom: "20px",
                            padding: "15px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                            border: "1px solid #e9ecef"
                        }}>
                            <h5 style={{ 
                                fontSize: "16px", 
                                fontWeight: "600", 
                                marginBottom: "15px", 
                                color: "#333",
                                textAlign: "center"
                            }}>
                                Seçenekler
                            </h5>
                            {(selectedVariants ?? []).map((selectedVariant, index) => (
                                <div key={index} className="variant-item mb-3" style={{
                                    padding: "12px",
                                    backgroundColor: "#fff",
                                    borderRadius: "6px",
                                    border: "1px solid #dee2e6"
                                }}>
                                    <div className="variant-item-title mb-2" style={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#495057"
                                    }}>
                                        {index + 1}. Ürün
                                    </div>
                                    <div className="variant-options">
                                        {(Object.entries(variants ?? {}) as [string, any][])?.map(([type, variantData]) => (
                                            <select
                                                key={type}
                                                name={`variants[${index}][${type}]`}
                                                className="form-control mb-2"
                                                required
                                                value={(selectedVariant?.[type] ?? '')}
                                                onChange={(e) => handleVariantChange(index, type, e.target.value)}
                                                style={{
                                                    fontSize: "14px",
                                                    padding: "8px 12px",
                                                    border: "1px solid #ced4da",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                <option value="">{variantData?.title || type} Seçin</option>
                                                {(variantData?.options ?? []).map((option: string) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Product Content (HTML) */}
                    {memoizedProductContent && (
                        <div className="product-content mb-3" dangerouslySetInnerHTML={memoizedProductContent} />
                    )}

                    <div className="button-container">
                        <button type='button' className='add-to-cart w-100' onClick={openModal}>
                            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817629909549416">
                                <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M58,76a58,58,0,0,1,116,0,6,6,0,0,1-12,0,46,46,0,0,0-92,0,6,6,0,0,1-12,0Zm138,46a25.87,25.87,0,0,0-14.59,4.49A26,26,0,0,0,142,110.1V76a26,26,0,0,0-52,0v87l-7.53-12.1a26,26,0,0,0-45,26.13l29.32,50A6,6,0,0,0,77.16,221L47.87,171a14,14,0,0,1,24.25-14,1,1,0,0,0,.1.17l18.68,30A6,6,0,0,0,102,184V76a14,14,0,0,1,28,0v68a6,6,0,0,0,12,0V132a14,14,0,0,1,28,0v20a6,6,0,0,0,12,0v-4a14,14,0,0,1,28,0v36c0,22.13-7.3,37.18-7.37,37.32a6,6,0,0,0,2.69,8A5.83,5.83,0,0,0,208,230a6,6,0,0,0,5.38-3.32c.35-.7,8.63-17.55,8.63-42.68V148A26,26,0,0,0,196,122Z"></path></svg>
                            <span>Kapıda Ödeme İle Sipariş Ver</span>
                        </button>
                    </div>

                    <div className="campaign-container">
                        {(parsedSettings?.cash_payment_cost == null || parsedSettings?.cash_payment_cost == 0) && (
                            <div className="campaign-item">
                                <span className="campaign-icon">
                                    <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817602426306920">
                                        <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M255.14,115.54l-14-35A19.89,19.89,0,0,0,222.58,68H196V64a12,12,0,0,0-12-12H32A20,20,0,0,0,12,72V184a20,20,0,0,0,20,20H46.06a36,36,0,0,0,67.88,0h44.12a36,36,0,0,0,67.88,0H236a20,20,0,0,0,20-20V120A21.7,21.7,0,0,0,255.14,115.54ZM196,92h23.88l6.4,16H196ZM80,204a12,12,0,1,1,12-12A12,12,0,0,1,80,204Zm92-41.92A36.32,36.32,0,0,0,158.06,180H113.94a36,36,0,0,0-67.88,0H36V140H172ZM172,116H36V76H172Zm20,88a12,12,0,1,1,12-12A12,12,0,0,1,192,204Zm40-24h-6.06A36.09,36.09,0,0,0,196,156.23V132h36Z"></path></svg>
                                </span>
                                <span className="campaign-text">
                                    Ücretsiz Kargo
                                </span>

                            </div>
                        )}


                        <div className="campaign-item">
                            <span className="campaign-icon">
                                <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817577244295528">
                                    <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M232.76,137.88A28.39,28.39,0,0,0,208.13,133L172,141.26c0-.42,0-.84,0-1.26a32,32,0,0,0-32-32H89.94a35.76,35.76,0,0,0-25.45,10.54L43,140H20A20,20,0,0,0,0,160v40a20,20,0,0,0,20,20H120a11.89,11.89,0,0,0,2.91-.36l64-16a11.4,11.4,0,0,0,1.79-.6l38.82-16.54c.23-.09.45-.19.67-.3a28.61,28.61,0,0,0,4.57-48.32ZM36,196H24V164H36Zm181.68-31.39-37.51,16L118.52,196H60V157l21.46-21.46A11.93,11.93,0,0,1,89.94,132H140a8,8,0,0,1,0,16H112a12,12,0,0,0,0,24h32a12.19,12.19,0,0,0,2.69-.3l67-15.41.47-.12a4.61,4.61,0,0,1,5.82,4.44A4.58,4.58,0,0,1,217.68,164.61ZM164,100a40.36,40.36,0,0,0,5.18-.34,40,40,0,1,0,29.67-59.32A40,40,0,1,0,164,100Zm40-36a16,16,0,1,1-16,16A16,16,0,0,1,204,64ZM164,44a16,16,0,0,1,12.94,6.58A39.9,39.9,0,0,0,164.2,76H164a16,16,0,0,1,0-32Z"></path></svg>
                            </span>
                            <span className="campaign-text">
                                Ücretsiz İade
                            </span>
                        </div>
                    </div>
                    <div className="faq-container">

                        <div className="faq-list">
                            <div className="faq-item">
                                <div
                                    className="faq-question"
                                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                                >
                                    <span>
                                        Kurulumunu Nasıl Yaparım?
                                    </span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={openFaq === 1 ? "open" : "closed"}
                                    >
                                        <path
                                            d="M6 9L12 15L18 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className={`faq-answer ${openFaq === 1 ? "open" : "closed"}`}
                                >
                                    <p>
                                        Rexing Link adaptörünü kurmak çok kolaydır. Sadece adaptörü arabanızın USB portuna takın ve telefonunuzla Bluetooth bağlantısını kurun. Otomatik olarak CarPlay özelliği aktif hale gelecektir.
                                    </p>
                                </div>
                            </div>

                            <div className="faq-item">
                                <div
                                    className="faq-question"
                                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                                >
                                    <span>
                                        Tüm Arabalarla Uyumlu Mu?
                                    </span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={openFaq === 2 ? "open" : "closed"}
                                    >
                                        <path
                                            d="M6 9L12 15L18 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className={`faq-answer ${openFaq === 2 ? "open" : "closed"}`}
                                >
                                    <p>
                                        Evet! Rexing Link adaptörü USB portu olan tüm araçlarla uyumludur. 2010 yılından sonra üretilen çoğu araçta sorunsuz çalışır. Android ve iOS telefonlarla da tam uyumludur.
                                    </p>
                                </div>
                            </div>

                            <div className="faq-item">
                                <div
                                    className="faq-question"
                                    onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                                >
                                    <span>
                                        Video İzleme Özelliği Var Mı?
                                    </span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={openFaq === 3 ? "open" : "closed"}
                                    >
                                        <path
                                            d="M6 9L12 15L18 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className={`faq-answer ${openFaq === 3 ? "open" : "closed"}`}
                                >
                                    <p>
                                        Evet! Netflix, YouTube ve diğer video platformlarında içerik izleyebilirsiniz. Yüksek çözünürlüklü video desteği ile araç içinde premium video deneyimi yaşayın.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CommentsSection comments={product.comments || []} count={product.commentCount || 0} />
                </div>

                <OrderModal
                    showModal={showModal}
                    onClose={closeModal}
                    product={product}
                    selectedOption={selectedOption}
                    onOptionSelect={selectOption}
                    selectedVariants={selectedVariants}
                    onVariantChange={handleOrderModalVariantChange}
                />

            </div>

        </>
    );
}


