// components/ProductDetails.tsx
"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../utils";

interface Product {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const handleAddToCart = () => {
    console.log("Adding to cart:", product.id);
  };

  const handleViewCart = () => {
    console.log("Viewing cart");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.productImgUrl}
                alt={product.productName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.productName}
                  </h1>
                  <p className="text-sm text-gray-500 uppercase">
                    {product.category.join(", ")}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  onClick={handleViewCart}
                  variant="outline"
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
