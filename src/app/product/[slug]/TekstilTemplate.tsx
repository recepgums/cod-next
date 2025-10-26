'use client';

import '../Nova.css';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import NovaSlider from './component/NovaSlider';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import RelatedProducts from './components/RelatedProducts';
import dynamic from 'next/dynamic';

// Lazy load components that are not immediately visible
const Footer = dynamic(() => import('../../components/Footer'), {
    ssr: true,
    loading: () => <div style={{ height: '200px' }} />
});

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

interface ProductImage {
    thumbnail: string;
    medium: string;
    large: string;
    mobile: string;
    original: string;
}

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
    images: ProductImage[];
    options: ProductOption[];
    features: string[];
    rating: number;
    commentCount: number;
    comments: ProductComment[];
    cities: any[];
    categories: any[];
    pixels?: { platform: string; pixel_id: string }[];
    template?: string;
    logoUrl?: string;
  content?: string;
  settings?: string;
  merchant_phone?: string;
  related_products?: any[];
}

interface TekstilTemplateProps {
    product: Product;
}

export default function TekstilTemplate({ product }: TekstilTemplateProps) {
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    console.log('👕 TekstilTemplate rendering with product:', product);

    // Parse settings for dynamic options
    const parsedSettings = useMemo(() => {
        if (!product.settings) return null;
        try {
            return JSON.parse(product.settings);
        } catch (error) {
            console.error('Error parsing settings:', error);
            return null;
        }
    }, [product.settings]);

    // Generate dynamic options from settings
    const dynamicOptions = useMemo(() => {
        if (!parsedSettings) return product.options || [];

        const options: ProductOption[] = [];
        const quantityPrices = parsedSettings.quantity_price ? JSON.parse(parsedSettings.quantity_price) : {};
        const quantityDiscounts = parsedSettings.quantity_discount ? JSON.parse(parsedSettings.quantity_discount) : {};
        const quantityDisplayTexts = parsedSettings.quantity_display_text ? JSON.parse(parsedSettings.quantity_display_text) : {};

        Object.keys(quantityPrices).forEach(quantity => {
            const qty = parseInt(quantity);
            const price = quantityPrices[quantity];
            const discount = quantityDiscounts[quantity] || 0;
            const displayText = quantityDisplayTexts[quantity] || `${qty} Adet`;

            options.push({
                quantity: qty,
                price: price,
                original: price + discount,
                discount: discount,
                badge: discount > 0 ? `%${Math.round((discount / (price + discount)) * 100)}` : '',
                isCampaign: discount > 0,
                unit: parsedSettings.unit || 'Adet',
                displayText: displayText,
                finalDiscount: discount
            });
        });

        return options.length > 0 ? options : product.options || [];
    }, [parsedSettings, product.options]);

    // Initialize selected option
    useEffect(() => {
        if (dynamicOptions.length > 0 && !selectedOption) {
            setSelectedOption(dynamicOptions[0]);
        }
    }, [dynamicOptions, selectedOption]);

    // Parse variants from settings
    const variants = useMemo(() => {
        if (!parsedSettings?.variants) return [];
        return parsedSettings.variants;
    }, [parsedSettings]);

    // Group variants by type
    const variantsByType = useMemo(() => {
        const grouped: { [key: string]: any[] } = {};
        variants.forEach((variant: any) => {
            if (!grouped[variant.type]) {
                grouped[variant.type] = [];
            }
            grouped[variant.type].push(variant);
        });
        return grouped;
    }, [variants]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const selectOption = (option: ProductOption) => {
        setSelectedOption(option);
    };

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
    };

    const handleColorChange = (color: string) => {
        setSelectedColor(color);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    // Memoized product content
    const memoizedProductContent = useMemo(() => {
        if (!product.content) return null;
        return (
            <div
                dangerouslySetInnerHTML={{ __html: product.content }}
                style={{ marginTop: '20px' }}
            />
        );
    }, [product.content]);

    return (
        <div className="tekstil-template">
            <Header categories={product.categories} logoSrc={product.logoUrl} />

            <NovaSlider productName={product.name} images={product.images} />

            {/* Product Details Section */}
            <div className="product-details-section" style={{
                padding: '20px',
                backgroundColor: '#fff',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                {/* Brand and Product Name */}
                <div style={{ marginBottom: '15px' }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000',
                        marginBottom: '5px'
                    }}>
                        {product.name}
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#ff0000',
                            fontSize: '14px'
                        }}>
                            <span className='me-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="26" width="26" xmlns="http://www.w3.org/2000/svg"><path d="M13 3h4v2h-4zM3 8h4v2H3zm0 8h4v2H3zm-1-4h3.99v2H2zm19.707-5.293-1.414-1.414L18.586 7A6.937 6.937 0 0 0 15 6c-3.859 0-7 3.141-7 7s3.141 7 7 7 7-3.141 7-7a6.968 6.968 0 0 0-1.855-4.73l1.562-1.563zM16 14h-2V8.958h2V14z"></path></svg></span>
                            Tükeniyor
                        </div>
                        <div style={{ fontSize: '20px', color: '#ccc' }}>♡</div>
                    </div>
                </div>

                {/* Pricing */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            padding: '10px 6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginRight: '10px'
                        }}>
                            %50
                        </div>

                        <div className='d-flex flex-column'>
                        <div style={{
                            textDecoration: 'line-through',
                            color: '#999',
                            fontSize: '16px',
                            marginRight: '10px'
                        }}>
                            ₺ {product.oldPrice?.toFixed(2) || '1,900.00'}
                        </div>
                        <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#000'
                        }}>
                            ₺ {selectedOption?.price?.toFixed(2) || product.price.toFixed(2)}
                        </div>
                        </div>
   
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#000',
                        fontSize: '14px'
                    }}>
                        Ücretsiz & Aynı Gün Kargo İmkanı!
                        <span style={{ marginRight: '5px' }}>📦</span>
                    </div>
                </div>

                {/* Size Selection */}
                {variantsByType['Beden'] && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '10px',
                            fontWeight: '500'
                        }}>
                            Beden
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {variantsByType['Beden'].map((variant: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleSizeChange(variant.name)}
                                    style={{
                                        padding: '8px 16px',
                                        border: selectedSize === variant.name ? '2px solid #000' : '1px solid #ddd',
                                        backgroundColor: selectedSize === variant.name ? '#000' : '#fff',
                                        color: selectedSize === variant.name ? '#fff' : '#000',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '700'
                                    }}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Color Selection */}
                {variantsByType['Renk'] && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            fontSize: '14px',
                            color: '#666',
                            marginBottom: '10px',
                            fontWeight: '500'
                        }}>
                            Renk
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {variantsByType['Renk'].map((variant: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleColorChange(variant.name)}
                                    style={{
                                        padding: '8px 16px',
                                        border: selectedColor === variant.name ? '2px solid #000' : '1px solid #ddd',
                                        backgroundColor: selectedColor === variant.name ? '#000' : '#fff',
                                        color: selectedColor === variant.name ? '#fff' : '#000',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '700'
                                    }}
                                    title={variant.name}
                                >
                                   {variant.name} 
                             </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity and Action Buttons */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '20px'
                }}>

                    <div style={{ display: 'flex', gap: '10px', flex: 1 }}>

                        <button
                            onClick={openModal}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}
                        >
                            HEMEN AL
                        </button>
                    </div>
                </div>


                {/* Product Content */}
                {memoizedProductContent}

                {/* Related Products */}
                {product.related_products && product.related_products.length > 0 && (
                    <RelatedProducts products={product.related_products} />
                )}

            </div>

            {/* Sticky Footer */}
            <StickyFooter
                product={product}
                selectedOption={selectedOption}
                onOrderClick={openModal}
            />

            {/* Order Modal */}
            <OrderModal
                showModal={showModal}
                onClose={closeModal}
                product={product}
                selectedOption={selectedOption}
                onOptionSelect={selectOption}
            />

            {/* Footer */}
            <Footer />

            {/* Pixel Scripts */}
            {product && product.pixels && (
                <PixelScripts pixels={product.pixels} product={product} />
            )}
        </div>
    );
}
