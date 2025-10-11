import React from 'react';
import ProductCard from './ProductCard';

export type Product = {
  name: string;
  imgSrc: string;
  productLink: string;
  rating?: number | null; // string yerine number olmalı
  priceCurrent: string;
  priceOriginal?: string | null;
  slug: string;
  images: {
    medium: string;
  }[];
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <main className="main">
      <section className="mt-20 mb-20">
        <div className="container">
          <div className="row">
            {products.map((product, idx) => (
              <div key={product.slug || idx} className="col-lg-3 col-md-4 col-sm-6 col-6 px-1">
                <ProductCard
                  image={product.images[0]?.medium || ''}
                  title={product.name}
                  rating={product.rating} // parseFloat artık gerekli değil
                  price={product.priceCurrent}
                  oldPrice={product.priceOriginal}
                  slug={product.slug}
                  productLink={product.productLink}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}