import React from 'react';
import ProductCard from './ProductCard';
import { HomepageProduct } from '../types/product';

type ProductGridProps = {
  products: HomepageProduct[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <main className="main">
      <section className="mt-20 mb-20">
        <div className="container">
          <div className="row">
            {products.map((product, idx) => (
              <div key={idx} className="col-lg-3 col-md-4 col-sm-6 col-6 px-1">
                <ProductCard
                  image={product.imgSrc}
                  title={product.name}
                  rating={product.rating ? parseFloat(product.rating) : null}
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