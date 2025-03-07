"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useProductDetails } from "./useProductDetails";
import { useProductStore } from "../../(group-products)/_components/_store/product-store";

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

interface ProductWithVariations {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  variations?: Variation[];
}

interface ColorSwatchProps {
  color: string;
  selected: boolean;
  onClick: () => void;
}

// Debug function to log state changes
const debugLog = (message: string, data?: any) => {
  console.log(`[ProductDetails] ${message}`, data ? data : "");
};

const ColorSwatch = ({ color, selected, onClick }: ColorSwatchProps) => {
  const colorClass = useMemo(() => {
    const colorMap: Record<string, string> = {
      black: "bg-black",
      white: "bg-white border",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-400",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      gray: "bg-gray-500",
    };
    return colorMap[color.toLowerCase()] || "bg-gray-300";
  }, [color]);

  return (
    <div
      className={`w-6 h-6 rounded-full cursor-pointer ${colorClass} ${
        selected ? "ring-2 ring-offset-1 ring-black" : ""
      }`}
      title={color}
      onClick={onClick}
    />
  );
};

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
    if (initialProductId) {
      debugLog("Using initialProductId", initialProductId);
      return initialProductId;
    }

    // Second priority: Check URL params
    if (!params) {
      debugLog("No params found");
      return null;
    }

    // Log all params to debug
    debugLog("URL params", params);

    // Try different possible param names
    let id: string | null = null;

    if (typeof params.productId === "string") {
      id = params.productId;
      debugLog("Found productId in params", id);
    } else if (Array.isArray(params.productId) && params.productId.length > 0) {
      id = params.productId[0] as string;
      debugLog("Found productId (array) in params", id);
    } else if (typeof params.product_id === "string") {
      id = params.product_id;
      debugLog("Found product_id in params", id);
    } else if (
      Array.isArray(params.product_id) &&
      params.product_id.length > 0
    ) {
      id = params.product_id[0] as string;
      debugLog("Found product_id (array) in params", id);
    } else {
      // Try to find any param that looks like a UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      Object.entries(params).forEach(([key, value]) => {
        if (!id && typeof value === "string" && uuidRegex.test(value)) {
          id = value;
          debugLog(`Found UUID-like param: ${key}`, value);
        }
      });
    }

    return id;
  }, [params, initialProductId]);

  // Initialize store
  useEffect(() => {
    debugLog("Initializing store if needed...");
    if (allProducts.length === 0) {
      fetchProducts().then(() => {
        debugLog("Product store initialized");
        setIsStoreReady(true);
      });
    } else {
      debugLog(`Product store already has ${allProducts.length} products`);
      setIsStoreReady(true);
    }
  }, [allProducts, fetchProducts]);

  // Get product details
  const { product, isLoading, error } = useProductDetails({
    productId: isStoreReady ? productId : null,
    autoLoad: true,
  });

  // Debug log when product is loaded or product ID changes
  useEffect(() => {
    debugLog("Current product ID from URL/props", productId);

    if (product) {
      debugLog("Product loaded successfully", {
        id: product.id,
        name: product.productName,
        hasVariations: !!product.variations,
        variationsCount: product.variations?.length || 0,
      });

      if (product.variations && product.variations.length > 0) {
        debugLog("First variation", product.variations[0]);
      }
    } else if (!isLoading) {
      debugLog("No product found for ID", productId);
    }
  }, [product, productId, isLoading]);

  // Get unique colors and sizes
  const { colors, sizes } = useMemo(() => {
    if (!product || !product.variations || product.variations.length === 0) {
      return { colors: [], sizes: [] };
    }

    const uniqueColors = [...new Set(product.variations.map((v) => v.color))];
    const uniqueSizes = [...new Set(product.variations.map((v) => v.size))];

    debugLog("Unique colors and sizes", {
      colors: uniqueColors,
      sizes: uniqueSizes,
    });
    return { colors: uniqueColors, sizes: uniqueSizes };
  }, [product]);

  // Set default selections when product loads
  useEffect(() => {
    if (product && product.variations && product.variations.length > 0) {
      const firstVariation = product.variations[0];
      debugLog(
        "Setting default selections from first variation",
        firstVariation,
      );

      setSelectedColor(firstVariation.color);
      setSelectedSize(firstVariation.size);
      setSelectedVariationImage(firstVariation.imageUrl);
    }
  }, [product]);

  // Get current variation
  const currentVariation = useMemo<Variation | null>(() => {
    if (!product || !product.variations || !selectedColor || !selectedSize) {
      return null;
    }

    const variation =
      product.variations.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      ) || null;

    if (variation) {
      debugLog("Current variation found", {
        id: variation.id,
        color: variation.color,
        size: variation.size,
        imageUrl: variation.imageUrl,
      });
    } else {
      debugLog("No variation found for", {
        color: selectedColor,
        size: selectedSize,
      });
    }

    return variation;
  }, [product, selectedColor, selectedSize]);

  // Update variation image when current variation changes
  useEffect(() => {
    if (currentVariation) {
      debugLog("Updating image from current variation", {
        image: currentVariation.imageUrl,
        color: currentVariation.color,
        size: currentVariation.size,
      });
      setSelectedVariationImage(currentVariation.imageUrl);
    }
  }, [currentVariation]);

  // Handle color selection
  const handleColorSelect = (color: string): void => {
    debugLog("Color selected", { color });
    setSelectedColor(color);

    if (!product || !product.variations) return;

    // Find sizes available for this color
    const variationsForColor = product.variations.filter(
      (v) => v.color === color,
    );
    debugLog("Variations for selected color", variationsForColor);

    const sizesForColor = variationsForColor.map((v) => v.size);

    // If current size isn't available, select the first one
    if (!sizesForColor.includes(selectedSize as string)) {
      const newSize = sizesForColor[0];
      debugLog("Updating size because current is not available", {
        oldSize: selectedSize,
        newSize,
      });
      setSelectedSize(newSize);
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
      debugLog("Updating image directly from color selection", {
        image: variation.imageUrl,
      });
      setSelectedVariationImage(variation.imageUrl);
    }
  };

  // Loading state
  if (!isStoreReady || isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-52 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <span>Product not found: {productId || "unknown"}</span>
          <div className="mt-2 text-xs">
            <p>URL parameters: {JSON.stringify(params)}</p>
          </div>
        </div>
      </div>
    );
  }

  // No variations
  if (!product.variations || product.variations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4">
            <h1 className="text-xl font-bold mb-2">{product.productName}</h1>

            <div className="bg-gray-50 rounded overflow-hidden relative aspect-square mb-4">
              <Image
                src={product.productImgUrl}
                alt={product.productName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-contain"
              />
            </div>

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
        {/* Product Details Layout */}
        <div className="p-4">
          <h1 className="text-xl font-bold mb-2">{product.productName}</h1>

          {/* Product Image - Show variation image */}
          <div className="bg-gray-50 rounded overflow-hidden relative aspect-square mb-4">
            <Image
              src={selectedVariationImage || product.productImgUrl}
              alt={product.productName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-contain"
            />
          </div>

          <p className="text-lg font-semibold mb-2">
            R
            {currentVariation?.price.toFixed(2) ||
              product.sellingPrice.toFixed(2)}
          </p>

          <div className="mb-4 text-sm">
            <p>{product.description}</p>
          </div>

          {/* Variations */}
          <div className="space-y-3">
            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium mb-1">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    selected={selectedColor === color}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium mb-1">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.variations
                  .filter((v) => v.color === selectedColor)
                  .map((v) => v.size)
                  .filter((size, index, self) => self.indexOf(size) === index) // Get unique
                  .map((size) => (
                    <div
                      key={size}
                      className={`px-3 py-1 border rounded text-sm cursor-pointer ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Stock info */}
          {currentVariation && (
            <div className="my-3 text-sm">
              <p
                className={
                  currentVariation.quantity > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {currentVariation.quantity > 0
                  ? `In Stock (${currentVariation.quantity} available)`
                  : "Out of Stock"}
              </p>
              <p className="text-gray-500">SKU: {currentVariation.sku}</p>
            </div>
          )}

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
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
