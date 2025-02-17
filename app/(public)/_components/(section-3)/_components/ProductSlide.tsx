import React from "react";
import { ProductSlideProps } from "../types";
import ProductCard from "./ProductCard";

export const ProductSlide: React.FC<ProductSlideProps> = ({
  products,
  isMobile,
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = isMobile ? products.slice(0, 2) : products;

  return (
    <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 px-4">
      {displayProducts.map((product, idx) => (
        <ProductCard key={idx} {...product} />
      ))}
    </div>
  );
};
