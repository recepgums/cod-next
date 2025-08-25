'use client';

import '../Nova.css';
import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
import NovaSlider from './component/NovaSlider';

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
}

export default function NovaTemplate({ product }: { product: any }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [selectedCount, setSelectedCount] = useState<number>(1);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    
    const selectOption = (option: ProductOption) => {
        setSelectedOption(option);
    };
    
    const calculateRating = (productNameLength: number) => {
        let kalan = productNameLength % 5;
        let percentage = 100 - ((kalan + 1) * 2);
        return percentage;
    }

    const dummyOrder = {
        id: 1,
        name: "Rexing Link Kablosuz CarPlay Adaptör",
        price: 2599.99,
        images: [
            "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/RexingLink_2_768x768.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296",
            "https://rexingtr.com/cdn/shop/files/5_b4ec0b7f-55d5-46b6-8404-93d4c4769167.png?v=1753984296"
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

    useEffect(() => {
        if (dummyOrder.options && dummyOrder.options.length > 0) {
            setSelectedOption(dummyOrder.options[0]);
        }
    }, []);

    return (
        <div className="nova-template">
            <div className="nova-slider-wrapper">
                <NovaSlider
                    images={dummyOrder.images}
                    productName={dummyOrder.name}
                />
            </div>

            <div style={{ padding: "2px 20px 0"}}>
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
                    <span style={{ color: "#000000", fontSize: "18px", fontWeight: "700" }}>Rexing Link <strong>| Kablosuz CarPlay Adaptör</strong></span>
                </div>

                <div className='attributes'>
                    <div className='d-flex flex-wrap'>
                        <div className="attributes-item w-50 d-flex gap-2" style={{ marginTop: "10px", marginBottom: "5px" }}>
                            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817550818804072">
                                <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M137.11,152.19a12,12,0,0,0-18.22,0l-48,56A12,12,0,0,0,80,228h96a12,12,0,0,0,9.11-19.81Zm-31,51.81L128,178.44,149.91,204ZM236,64V176a28,28,0,0,1-28,28h-4a12,12,0,0,1,0-24h4a4,4,0,0,0,4-4V64a4,4,0,0,0-4-4H48a4,4,0,0,0-4,4V176a4,4,0,0,0,4,4h4a12,12,0,0,1,0,24H48a28,28,0,0,1-28-28V64A28,28,0,0,1,48,36H208A28,28,0,0,1,236,64Z"></path></svg>
                            <span style={{ fontSize: "15px" }}>Video İzleme</span>
                        </div>
                        <div className="attributes-item w-50 d-flex gap-2" style={{ marginTop: "10px", marginBottom: "5px" }}>
                            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817558490186088">
                                <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M240,100h-8.2L205.08,39.88A20,20,0,0,0,186.8,28H69.2A20,20,0,0,0,50.92,39.88L24.2,100H16a12,12,0,0,0,0,24h4v76a20,20,0,0,0,20,20H68a20,20,0,0,0,20-20V180h80v20a20,20,0,0,0,20,20h28a20,20,0,0,0,20-20V124h4a12,12,0,0,0,0-24ZM71.8,52H184.2l21.33,48H50.47ZM64,196H44V180H64Zm128,0V180h20v16Zm20-40H44V124H212Z"></path></svg>
                            <span>Tak Çalıştır</span>
                        </div>
                        <div className="attributes-item w-50 d-flex gap-2" style={{ marginBottom: "10px" }} >
                            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817558485598568">
                                <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M199.2,166.4,148,128l51.2-38.4a12,12,0,0,0,0-19.2l-64-48A12,12,0,0,0,116,32v72L71.2,70.4A12,12,0,0,0,56.8,89.6L108,128,56.8,166.4a12,12,0,1,0,14.4,19.2L116,152v72a12,12,0,0,0,19.2,9.6l64-48a12,12,0,0,0,0-19.2ZM140,56l32,24-32,24Zm0,144V152l32,24ZM56,144a16,16,0,1,1,16-16A16,16,0,0,1,56,144Zm168-16a16,16,0,1,1-16-16A16,16,0,0,1,224,128Z"></path></svg>
                            <span>Bluetooth 5.4</span>
                        </div>
                        <div className="attributes-item w-50 d-flex gap-2" style={{ marginBottom: "10px" }}>
                            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817766391677288">
                                <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z"></path></svg>
                            <span>Netflix & YouTube</span>
                        </div>



                    </div>
                </div>

                <div className="price-container d-flex align-items-center" style={{ gap: "4px" }}>
                    <div className="">
                        <span className="price">2,599.99TL</span>
                    </div>
                    <div className="">
                        <span className="oldPrice">3,600.00TL</span>
                    </div>
                    <div className=" text-white discount-container">
                        <span className='discount'> 28% İNDİRİM</span>
                    </div>
                </div>

                <div className='campaign-text'>
                    <p className='text-center' style={{ fontSize: "16px" }}>DAHA FAZLA AL, DAHA AZ ÖDE!</p>
                </div>

                <div className="count-containers">
                    <div className={`count-item-wrapper ${selectedCount === 1 ? "active" : ""}`}
                        onClick={() => {
                            setSelectedCount(1);
                            setSelectedOption(dummyOrder.options[0]);
                        }}
                    >
                        <div className="count-item">
                            <div className="d-flex align-items-center" style={{ gap: "18px" }}>
                                <div className="bar"></div>
                                <div className="count-and-price d-flex justify-content-between w-100">
                                    <div className='d-flex align-items-center'>
                                        <span className='count-in-box'>1 Adet</span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <p className='price-in-box text-center'>2,599.99TL</p>
                                        <p className='oldPrice-in-box text-center'>3,600.00TL</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`count-item-wrapper ${selectedCount === 2 ? "active" : ""}`}
                        onClick={() => {
                            setSelectedCount(2);
                            setSelectedOption(dummyOrder.options[1]);
                        }}
                    >
                        <div className="count-item">
                            <div className="d-flex align-items-center" style={{ gap: "18px" }}>
                                <div className="bar"></div>
                                <div className="count-and-price d-flex justify-content-between w-100">
                                    <div className='d-flex flex-column'>
                                        <span className='count-in-box'>2 Adet</span>
                                        <span className="count-discount">EKSTRA %5 İNDİRİM!</span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <p className='price-in-box text-center'>4,939.98TL</p>
                                        <p className='oldPrice-in-box text-center'>7,200.00TL</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`count-item-wrapper ${selectedCount === 3 ? "active" : ""}`}
                        onClick={() => {
                            setSelectedCount(3);
                            setSelectedOption(dummyOrder.options[2]);
                        }}
                    >
                        <div className="count-item">
                            <div className="d-flex align-items-center" style={{ gap: "18px" }}>
                                <div className="bar"></div>
                                <div className="count-and-price d-flex justify-content-between w-100">
                                    <div className='d-flex flex-column'>
                                        <span className='count-in-box'>3 Adet</span>
                                        <span className="count-discount">EKSTRA %10 İNDİRİM!</span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <p className='price-in-box text-center'>7,019.97TL</p>
                                        <p className='oldPrice-in-box text-center'>10,800.00TL</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <button type='button' className='add-to-cart w-100' onClick={openModal}>
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817629909549416">
                            <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M58,76a58,58,0,0,1,116,0,6,6,0,0,1-12,0,46,46,0,0,0-92,0,6,6,0,0,1-12,0Zm138,46a25.87,25.87,0,0,0-14.59,4.49A26,26,0,0,0,142,110.1V76a26,26,0,0,0-52,0v87l-7.53-12.1a26,26,0,0,0-45,26.13l29.32,50A6,6,0,0,0,77.16,221L47.87,171a14,14,0,0,1,24.25-14,1,1,0,0,0,.1.17l18.68,30A6,6,0,0,0,102,184V76a14,14,0,0,1,28,0v68a6,6,0,0,0,12,0V132a14,14,0,0,1,28,0v20a6,6,0,0,0,12,0v-4a14,14,0,0,1,28,0v36c0,22.13-7.3,37.18-7.37,37.32a6,6,0,0,0,2.69,8A5.83,5.83,0,0,0,208,230a6,6,0,0,0,5.38-3.32c.35-.7,8.63-17.55,8.63-42.68V148A26,26,0,0,0,196,122Z"></path></svg>
                        <span>Sepete Ekle</span>
                    </button>
                    <button type="button" className='buy w-100' onClick={openModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-fill" viewBox="0 0 16 16">
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
                        </svg>
                        <span style={{ marginTop: "2px" }}>KAPIDA ÖDEME İLE SATIN AL</span>
                    </button>
                </div>

                <div className="campaign-container">
                    <div className="campaign-item">
                        <span className="campaign-icon">
                            <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817602426306920">
                                <path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M255.14,115.54l-14-35A19.89,19.89,0,0,0,222.58,68H196V64a12,12,0,0,0-12-12H32A20,20,0,0,0,12,72V184a20,20,0,0,0,20,20H46.06a36,36,0,0,0,67.88,0h44.12a36,36,0,0,0,67.88,0H236a20,20,0,0,0,20-20V120A21.7,21.7,0,0,0,255.14,115.54ZM196,92h23.88l6.4,16H196ZM80,204a12,12,0,1,1,12-12A12,12,0,0,1,80,204Zm92-41.92A36.32,36.32,0,0,0,158.06,180H113.94a36,36,0,0,0-67.88,0H36V140H172ZM172,116H36V76H172Zm20,88a12,12,0,1,1,12-12A12,12,0,0,1,192,204Zm40-24h-6.06A36.09,36.09,0,0,0,196,156.23V132h36Z"></path></svg>
                        </span>
                        <span className="campaign-text">
                            Ücretsiz Kargo
                        </span>

                    </div>
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
            </div>

            <OrderModal
                showModal={showModal}
                onClose={closeModal}
                product={dummyOrder}
                selectedOption={selectedOption}
                onOptionSelect={selectOption}
            />

        </div>
    );
}


