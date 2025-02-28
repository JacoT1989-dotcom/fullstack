"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../utils";

interface Variation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface Product {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
  variations: Variation[];
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Filter variations based on selected color and size
  const filteredVariations = product.variations.filter(
    (variation) =>
      (!selectedColor || variation.color === selectedColor) &&
      (!selectedSize || variation.size === selectedSize),
  );

  // Get unique colors and sizes
  const uniqueColors = [
    ...new Set(product.variations.map((variation) => variation.color)),
  ];
  const uniqueSizes = [
    ...new Set(product.variations.map((variation) => variation.size)),
  ];

  // Get the selected variation
  const selectedVariation = filteredVariations[0];

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset size when color changes
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    if (value > 0 && selectedVariation && value <= selectedVariation.quantity) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedVariation) {
      alert("Please select a color and size.");
      return;
    }
    console.log("Adding to cart:", {
      productId: product.id,
      variationId: selectedVariation.id,
      quantity,
    });
  };

  // Handle view cart
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
                src={selectedVariation?.imageUrl || product.productImgUrl}
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
                    {formatCurrency(
                      selectedVariation?.price || product.sellingPrice,
                    )}
                  </p>
                </div>

                {/* Color Selection */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Color</h2>
                  <div className="flex gap-2">
                    {uniqueColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`p-2 border rounded ${
                          selectedColor === color
                            ? "border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Size</h2>
                  <div className="flex gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`p-2 border rounded ${
                          selectedSize === size
                            ? "border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Quantity</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 border rounded"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={
                        !selectedVariation ||
                        quantity >= selectedVariation.quantity
                      }
                      className="p-2 border rounded"
                    >
                      +
                    </button>
                  </div>
                  {selectedVariation && (
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedVariation.quantity} available
                    </p>
                  )}
                </div>

                {/* Description */}
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
