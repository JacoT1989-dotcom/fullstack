"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useProductDetails } from "../useProductDetails";
import { useProductStore } from "../../../(group-products)/_components/_store/product-store";
import ProductImage from "./ProductImage";
import VariationSelector from "./VariationSelector";
import ProductStatus from "./ProductStatus";

// Define types
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

interface ProductDetailsProps {
  initialProductId?: string;
}

export default function ProductDetails({
  initialProductId,
}: ProductDetailsProps) {
  const params = useParams();
  const [isStoreReady, setIsStoreReady] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariationImage, setSelectedVariationImage] = useState<
    string | null
  >(null);

  // Get store data
  const allProducts = useProductStore((state) => state.allProducts);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  // Get product ID from params or props
  const productId = useMemo<string | null>(() => {
    // First priority: Use initialProductId if provided
    if (initialProductId) return initialProductId;

    // Second priority: Check URL params
    if (!params) return null;

    // Try different possible param names
    let id: string | null = null;

    if (typeof params.productId === "string") {
      id = params.productId;
    } else if (Array.isArray(params.productId) && params.productId.length > 0) {
      id = params.productId[0] as string;
    } else if (typeof params.product_id === "string") {
      id = params.product_id;
    } else if (
      Array.isArray(params.product_id) &&
      params.product_id.length > 0
    ) {
      id = params.product_id[0] as string;
    } else {
      // Try to find any param that looks like a UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      Object.entries(params).forEach(([key, value]) => {
        if (!id && typeof value === "string" && uuidRegex.test(value)) {
          id = value;
        }
      });
    }

    return id;
  }, [params, initialProductId]);

  // Initialize store
  useEffect(() => {
    if (allProducts.length === 0) {
      fetchProducts().then(() => setIsStoreReady(true));
    } else {
      setIsStoreReady(true);
    }
  }, [allProducts, fetchProducts]);

  // Get product details
  const { product, isLoading, error } = useProductDetails({
    productId: isStoreReady ? productId : null,
    autoLoad: true,
  });

  // Get current variation
  const currentVariation = useMemo<Variation | null>(() => {
    if (!product?.variations || !selectedColor || !selectedSize) {
      return null;
    }

    return (
      product.variations.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      ) || null
    );
  }, [product, selectedColor, selectedSize]);

  // Set default selections when product loads
  useEffect(() => {
    if (product?.variations?.length) {
      const firstVariation = product.variations[0];
      setSelectedColor(firstVariation.color);
      setSelectedSize(firstVariation.size);
      setSelectedVariationImage(firstVariation.imageUrl);
    }
  }, [product]);

  // Update variation image when current variation changes
  useEffect(() => {
    if (currentVariation) {
      setSelectedVariationImage(currentVariation.imageUrl);
    }
  }, [currentVariation]);

  // Handle color selection
  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);

    if (!product?.variations) return;

    // Find sizes available for this color
    const variationsForColor = product.variations.filter(
      (v) => v.color === color,
    );
    const sizesForColor = variationsForColor.map((v) => v.size);

    // If current size isn't available, select the first one
    if (!sizesForColor.includes(selectedSize as string)) {
      setSelectedSize(sizesForColor[0]);
    }

    // Find the specific variation to get its image
    const variation = variationsForColor.find(
      (v) =>
        v.size ===
        (sizesForColor.includes(selectedSize as string)
          ? selectedSize
          : sizesForColor[0]),
    );

    if (variation) {
      setSelectedVariationImage(variation.imageUrl);
    }
  };

  // Check loading, error, and not found states
  const showStatus = !isStoreReady || isLoading || error || !product;
  if (showStatus) {
    return (
      <ProductStatus
        isLoading={!isStoreReady || isLoading}
        error={error}
        productId={productId}
        isProductFound={!!product}
      />
    );
  }

  // No variations
  if (!product.variations || product.variations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4">
            <h1 className="text-xl font-bold mb-2">{product.productName}</h1>
            <ProductImage
              imageUrl={product.productImgUrl}
              productName={product.productName}
            />
            <p className="text-lg font-semibold mb-2">
              R{product.sellingPrice.toFixed(2)}
            </p>
            <div className="mb-4 text-sm">
              <p>{product.description}</p>
            </div>
            <div className="my-3 text-sm text-yellow-600">
              <p>No variations available for this product</p>
            </div>
            <button className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-2">{product.productName}</h1>

          <ProductImage
            imageUrl={selectedVariationImage || product.productImgUrl}
            productName={product.productName}
          />

          <p className="text-lg font-semibold mb-2">
            R
            {currentVariation?.price.toFixed(2) ||
              product.sellingPrice.toFixed(2)}
          </p>

          <div className="mb-4 text-sm">
            <p>{product.description}</p>
          </div>

          <VariationSelector
            variations={product.variations}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorSelect={handleColorSelect}
            onSizeSelect={setSelectedSize}
            currentVariation={currentVariation}
          />

          {/* Debug Info - Remove this in production */}
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-700">
            <p>Product ID: {product.id}</p>
            <p>Selected Color: {selectedColor}</p>
            <p>Selected Size: {selectedSize}</p>
            <p>Variation ID: {currentVariation?.id || "none"}</p>
            <p>
              Image: {selectedVariationImage?.split("/").pop() || "(default)"}
            </p>
          </div>

          {/* Add to cart button */}
          <button
            className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!currentVariation || currentVariation.quantity <= 0}
            onClick={() => {
              if (currentVariation) {
                console.log("Adding to cart:", {
                  variationId: currentVariation.id,
                  name: currentVariation.name,
                  color: currentVariation.color,
                  size: currentVariation.size,
                  sku: currentVariation.sku,
                  quantity: 1,
                  availableStock: currentVariation.quantity,
                  price: currentVariation.price,
                  productId: product.id,
                  productName: product.productName,
                });
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
