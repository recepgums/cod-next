'use client';

import '../Nova.css';
import React, { useState } from 'react';
import Footer from '../../components/Footer';
import StickyFooter from '../../components/StickyFooter';
import OrderModal from '../../components/OrderModal';
import dynamic from 'next/dynamic';
import NovaSlider from './component/NovaSlider';

const PixelScripts = dynamic(() => import('./PixelScripts'), { ssr: false });

export default function NovaTemplate({ product }: { product: any }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState<any>(null);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const calculateRating = (productNameLength: number) => {
        let kalan = productNameLength % 5;
        let percentage = 100 - ((kalan + 1) * 2);
        return percentage;
    }



    return (
        <div className="nova-template col-lg-6" >
            <div className="text-center py-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <h1 className="fw-bold" style={{ margin: 0 }}>{product?.name || 'Ürün'}</h1>
                <p style={{ margin: 0 }}>Premium Ürün Deneyimi</p>
            </div>


            <NovaSlider
                images={product?.images || []}
                productName={product?.name || 'Ürün'}
            />
            <div style={{ padding: "0 15px" }}>
                <div className="d-flex">
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
                                style={{ marginRight: 4, color: "#ffcd3c" }}
                            >
                                <path
                                    fill="currentColor"
                                    strokelinecap="round"
                                    strokelinejoin="round"
                                    d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"
                                ></path>
                            </svg>
                        ))}
                    </div>

                    <p><span style={{ fontSize: "13px" }}>4.8 | <strong>10.000+</strong> Mutlu Müşteri!</span></p>

                </div>
            </div>
            <div className='product-title'>
                <span style={{ color: "#000000", fontSize: "18px", fontWeight: "700" }}>Rexing Link <strong>| Kablosuz CarPlay Adaptör</strong></span>
            </div>

            <div className='attributes'>
                <div className='d-flex flex-wrap'>
                    <div className="attributes-item w-50 d-flex gap-2" style={{ marginTop: "10px", marginBottom: "5px" }}>
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817550818804072">
                            <path fill="currentColor" strokeLinecap="round" strokelinejoin="round" d="M137.11,152.19a12,12,0,0,0-18.22,0l-48,56A12,12,0,0,0,80,228h96a12,12,0,0,0,9.11-19.81Zm-31,51.81L128,178.44,149.91,204ZM236,64V176a28,28,0,0,1-28,28h-4a12,12,0,0,1,0-24h4a4,4,0,0,0,4-4V64a4,4,0,0,0-4-4H48a4,4,0,0,0-4,4V176a4,4,0,0,0,4,4h4a12,12,0,0,1,0,24H48a28,28,0,0,1-28-28V64A28,28,0,0,1,48,36H208A28,28,0,0,1,236,64Z"></path></svg>
                        <span style={{ fontSize: "15px" }}>Video İzleme</span>
                    </div>
                    <div className="attributes-item w-50 d-flex gap-2" style={{ marginTop: "10px", marginBottom: "5px" }}>
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817558490186088">
                            <path fill="currentColor" strokelinecap="round" strokelinejoin="round" d="M240,100h-8.2L205.08,39.88A20,20,0,0,0,186.8,28H69.2A20,20,0,0,0,50.92,39.88L24.2,100H16a12,12,0,0,0,0,24h4v76a20,20,0,0,0,20,20H68a20,20,0,0,0,20-20V180h80v20a20,20,0,0,0,20,20h28a20,20,0,0,0,20-20V124h4a12,12,0,0,0,0-24ZM71.8,52H184.2l21.33,48H50.47ZM64,196H44V180H64Zm128,0V180h20v16Zm20-40H44V124H212Z"></path></svg>
                        <span>Tak Çalıştır</span>
                    </div>
                    <div className="attributes-item w-50 d-flex gap-2" style={{ marginBottom: "10px" }} >
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817558485598568">
                            <path fill="currentColor" strokelinecap="round" strokelinejoin="round" d="M199.2,166.4,148,128l51.2-38.4a12,12,0,0,0,0-19.2l-64-48A12,12,0,0,0,116,32v72L71.2,70.4A12,12,0,0,0,56.8,89.6L108,128,56.8,166.4a12,12,0,1,0,14.4,19.2L116,152v72a12,12,0,0,0,19.2,9.6l64-48a12,12,0,0,0,0-19.2ZM140,56l32,24-32,24Zm0,144V152l32,24ZM56,144a16,16,0,1,1,16-16A16,16,0,0,1,56,144Zm168-16a16,16,0,1,1-16-16A16,16,0,0,1,224,128Z"></path></svg>
                        <span>Bluetooth 5.4</span>
                    </div>
                    <div className="attributes-item w-50 d-flex gap-2" style={{ marginBottom: "10px" }}>
                        <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" data-id="508817766391677288">
                            <path fill="currentColor" strokelinecap="round" strokelinejoin="round" d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z"></path></svg>
                        <span>Netflix & YouTube</span>
                    </div>



                </div>
            </div>

            <div className="price-container d-flex">
                <div className="col-4">
                    <span className="price">2,599.99TL</span>
                </div>
                <div className="col-4">
                    <span className="oldPrice">3,600.00TL</span>
                </div>
                <div className="col-4 text-white discount-container">
                    <span className='discount'> 28% İNDİRİM</span>
                </div>
            </div>

            <div className='campaign-text'>
                <p className='text-center' style={{fontSize:"16px"}}>DAHA FAZLA AL, DAHA AZ ÖDE!</p>
            </div>

            <div className="count-containers">
                <div className="count-item-wrapper">
                    <div className="count-item">
                        <div className="d-flex" style={{gap:"18px"}}>
                            <div className="bar"></div>
                            <div className="count-and-price">
                                <div className='d-flex align-items-center'>
                                    <span>1 Adet</span>
                                </div>
                                <div className='d-flex flex-column'>
                                    <p className='price-in-box text-center'>2,599.99TL</p>
                                    <p className='oldPrice-in-box text-center'>3,600.00TL</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

        </div>
    );
}


