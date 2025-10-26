'use client';

import React, { useEffect, useRef } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

interface ProductImage {
    thumbnail: string;
    medium: string;
    large: string;
    mobile: string;
    original: string;
}

interface NovaSliderProps {
    images: ProductImage[];
    productName: string;
}

export default function NovaSlider({ images, productName }: NovaSliderProps) {
    const mainRef = useRef<any>(null);
    const thumbsRef = useRef<any>(null);

    useEffect(() => {
        const syncSliders = () => {
            const main = mainRef.current?.splide;
            const thumbs = thumbsRef.current?.splide;
            
            if (main && thumbs) {
                // Ana slider'dan thumbnail'a sync
                main.on('moved', (newIndex: number) => {
                    thumbs.go(newIndex);
                });

                // Thumbnail'dan ana slider'a sync
                thumbs.on('clicked', (slide: any, index: number) => {
                    main.go(index);
                });

                // İlk yüklemede sync
                main.sync(thumbs);
            }
        };

        // Biraz bekle ki her iki slider da mount olsun
        const timeout = setTimeout(syncSliders, 100);
        
        return () => clearTimeout(timeout);
    }, []);

    if (!images || images.length === 0) {
        return <div>Resim bulunamadı</div>;
    }

    return (
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
                        heightRatio: 1.2,
                        cover: false,
                    }}
                    aria-label="Product gallery"
                >
                    {images.map((img: ProductImage, i: number) => (
                        <SplideSlide key={img.medium + i}>
                            <img src={img.medium} alt={`${productName} - ${i + 1}`} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} />
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
                        rewind: true,
                        breakpoints: {
                            992: { fixedWidth: 110 },
                            768: { fixedWidth: 96 },
                            480: { fixedWidth: 76 },
                        },
                    }}
                    aria-label="Thumbnails"
                >
                    {images.map((img: ProductImage, i: number) => (
                        <SplideSlide key={'thumb-' + img.medium + i}>
                            <img src={img.thumbnail} alt={`Thumb ${i + 1}`} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </div>
    );
}
