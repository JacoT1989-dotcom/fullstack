// components/ProductGrid.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ProductCard } from "../Card";

interface ProductCardProps {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
}

interface ProductGridProps {
  products: ProductCardProps[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Link href={`/apparel/${product.id}`} key={product.id}>
          <ProductCard {...product} />
        </Link>
      ))}
    </div>
  );
}
