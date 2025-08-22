'use client';

import React, { useState } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; // temel stiller

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

export default function NovaTemplate({ product }: { product: any }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState<any>(null);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const mainRef = React.useRef<any>(null);
    const thumbsRef = React.useRef<any>(null);

    return (
        <div className="nova-template" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <h1 className="fw-bold" style={{ margin: 0 }}>{product?.name || 'Ürün'}</h1>
                <p style={{ margin: 0 }}>Premium Ürün Deneyimi</p>
            </div>


            <div className="nova-slider" style={{ padding: "12px 20px 0" }}>
                <div className="nova-gallery">
                    <Splide
                        className="nova-main"
                        ref={mainRef}
                        options={{
                            type: 'loop',
                            perPage: 1,
                            pagination: false,
                            arrows: true,
                            gap: '1px',
                            heightRatio: 1,   // 1:1 kare
                            cover: true,      // img'ler slide'ı kaplasın
                        }}
                        onMounted={() => {
                            const main = mainRef.current?.splide;
                            const thumbs = thumbsRef.current?.splide;
                            if (main && thumbs) main.sync(thumbs);
                        }}
                        aria-label="Product gallery"
                    >
                        {product?.images?.map((img: string, i: number) => (
                            <SplideSlide key={img + i}>
                                <img src={img} alt={`${product?.name ?? 'Ürün'} - ${i + 1}`} />
                            </SplideSlide>
                        ))}
                    </Splide>

                    <Splide
                        className="nova-thumbs mt-2"
                        ref={thumbsRef}
                        options={{
                            isNavigation: true,
                            pagination: false,
                            arrows: false,
                            drag: 'free',
                            focus: 'center',
                            gap: '1.1px',
                            fixedWidth: 124,    // 5'li kare
                            fixedHeight: 124,
                            rewind: true,
                            breakpoints: {
                                992: { fixedWidth: 110, fixedHeight: 110 },
                                768: { fixedWidth: 96, fixedHeight: 96 },
                                480: { fixedWidth: 76, fixedHeight: 76 },
                            },
                        }}
                        aria-label="Thumbnails"
                    >
                        {product?.images?.map((img: string, i: number) => (
                            <SplideSlide key={'thumb-' + img + i}>
                                <img src={img} alt={`Thumb ${i + 1}`} />
                            </SplideSlide>
                        ))}
                    </Splide>
                </div>
            </div>



            <div className="text-center p-3">
                <div className="mb-3">
                    <span style={{ fontSize: '2rem', color: '#667eea', fontWeight: 700 }}>
                        {typeof product?.price === 'number' ? product.price.toFixed(2) : product?.price} TL
                    </span>
                    {product?.oldPrice && (
                        <span className="ms-3" style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>
                            {typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : product.oldPrice} TL
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    className="btn btn-primary btn-lg w-100"
                    onClick={openModal}
                    style={{ border: 'none', borderRadius: 24 }}
                >
                    Hemen Sipariş Ver
                </button>
            </div>

            <StickyFooter
                product={product}
                selectedOption={selectedOption}
                onOrderClick={openModal}
            />

            <OrderModal
                showModal={showModal}
                onClose={closeModal}
                product={{ ...product, cities: product?.cities }}
                selectedOption={selectedOption}
                onOptionSelect={(opt: any) => setSelectedOption(opt)}
            />

            <Footer />
            {product && product.pixels && (
                <PixelScripts pixels={product.pixels} product={product} />
            )}
        </div>
    );
}


