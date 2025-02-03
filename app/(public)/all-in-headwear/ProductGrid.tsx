// components/ProductGrid.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency } from "./utils";

interface ProductCardProps {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
}

const ProductCard = ({
  productName,
  category,
  productImgUrl,
  description,
  sellingPrice,
}: ProductCardProps) => (
  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
    <CardHeader className="p-0">
      <div className="relative aspect-square">
        <Image
          src={productImgUrl}
          alt={productName}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 768px) 50vw,
                 (max-width: 1024px) 33vw,
                 25vw"
        />
      </div>
    </CardHeader>
    <CardContent className="flex-grow p-4">
      <h3 className="font-semibold text-lg mb-1 truncate">{productName}</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {category.map((cat) => (
          <span
            key={cat}
            className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
          >
            {cat}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <p className="text-lg font-bold text-primary">
        {formatCurrency(sellingPrice)}
      </p>
    </CardFooter>
  </Card>
);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <ProductCard {...product} />
        </Link>
      ))}
    </div>
  );
}
