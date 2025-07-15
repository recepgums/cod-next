import React from 'react';
import ProductCard from './ProductCard';

export type Product = {
  name: string;
  imgName: string;
  imgSrc: string;
  productLink: string;
  rating?: string | null;
  priceCurrent: string;
  priceOriginal?: string | null;
};

type ProductGridProps = {
  products: Product[];
};

function getSlugFromLink(link: string) {
  // Extract slug from productLink (e.g., /product/slug)
  const match = link.match(/\/product\/([^/]+)/);
  return match ? match[1] : '';
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="w-full max-w-[1320px] mx-auto mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, idx) => (
          <ProductCard
            key={idx}
            image={product.imgSrc}
            title={product.name}
            rating={product.rating ? parseFloat(product.rating) : null}
            price={product.priceCurrent}
            oldPrice={product.priceOriginal}
            slug={getSlugFromLink(product.productLink)}
            imgName={product.imgName}
          />
        ))}
      </div>
    </section>
  );
} 