// _components/ProductSlide.tsx
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { UploadModal } from "./(new-arrivals)/UploadModal";
import { EmptySlotCard } from "./EmptySlotCard";
import { ProductSlideProps } from "../types";

export const ProductSlide: React.FC<ProductSlideProps> = ({
  products,
  isMobile,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = isMobile ? products.slice(0, 2) : products;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4">
        {displayProducts.map((product, idx) =>
          "isEmpty" in product ? (
            <EmptySlotCard
              key={`empty-${idx}`}
              onAdd={() => setIsModalOpen(true)}
            />
          ) : (
            <ProductCard key={`product-${idx}`} {...product} />
          ),
        )}
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
