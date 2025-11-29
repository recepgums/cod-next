import React from 'react';
import ProductCard from './ProductCard';
import ProductCard2 from './ProductCard2';

export type Product = {
  name: string;
  imgSrc: string;
  productLink: string;
  rating?: number | null; // string yerine number olmalı
  priceCurrent: string;
  priceOriginal?: string | null;
  slug: string;
  thumbnail_image_url: string;
};

type ProductGridProps = {
  products: Product[];
  productType: string;
};

export default function ProductGrid({ products, productType }: ProductGridProps) {
  return (
    <main className="main">
      <section className="mt-20 mb-20">
        <div className="container">
          <div className="row">
            {products.map((product, idx) => (
              <div key={product.slug || idx} className="col-lg-3 col-md-4 col-sm-6 col-6 px-1">
                {productType == "tekstil" ?(
                  <ProductCard2
                    image={product.thumbnail_image_url || product.imgSrc}
                    title={product.name}
                    rating={product.rating}
                    priceCurrent={Number(product.priceCurrent)}
                    priceOriginal={Number(product.priceOriginal)}
                    slug={product.slug}
                    productLink={product.productLink}
                  />
                ):(
                  <ProductCard
                    image={product.thumbnail_image_url || product.imgSrc}
                    title={product.name}
                    rating={product.rating} // parseFloat artık gerekli değil
                    price={product.priceCurrent}
                    oldPrice={product.priceOriginal}
                    slug={product.slug}
                    productLink={product.productLink}
                  />

                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}