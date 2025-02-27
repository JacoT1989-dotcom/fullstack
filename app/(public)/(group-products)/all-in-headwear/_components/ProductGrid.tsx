"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "./Card";
import { Variation } from "@/app/(admin)/admin/(sidebar)/(products)/products/create/types";

interface ProductCardProps {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
  variations?: Variation[]; // Added variations prop
}

interface ProductGridProps {
  products: ProductCardProps[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Add debugging logs
  useEffect(() => {
    console.log("ProductGrid: Received products:", products);

    // Log detailed info about each product's image
    products.forEach((product, index) => {
      console.log(`Product ${index + 1} (${product.productName}):`, {
        id: product.id,
        imageUrl: product.productImgUrl,
        hasVariations: product.variations
          ? product.variations.length > 0
          : false,
      });

      // Check if variations have images
      if (product.variations && product.variations.length > 0) {
        console.log(
          `Variation images for ${product.productName}:`,
          product.variations.map((v) => ({
            name: v.name,
            imageUrl: v.imageUrl,
          })),
        );
      }
    });
  }, [products]);

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Link href={`/all-in-headwear/${product.id}`} key={product.id}>
          <ProductCard {...product} />
        </Link>
      ))}
    </div>
  );
}
