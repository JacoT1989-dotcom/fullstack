import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency } from "../utils";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names
import { Variation } from "@/app/(admin)/admin/(sidebar)/(products)/products/create/types";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
  variations?: Variation[]; // Added variations prop
}

// Helper function to map color names to Tailwind classes
const getColorClass = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    // Basic colors
    black: "bg-black",
    white: "bg-white",
    gray: "bg-gray-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    brown: "bg-amber-800",

    // Expanded colors
    navy: "bg-indigo-900",
    teal: "bg-teal-500",
    maroon: "bg-red-900",
    olive: "bg-olive-500",
    cyan: "bg-cyan-500",
    magenta: "bg-fuchsia-500",
    lime: "bg-lime-500",
    silver: "bg-gray-300",
    gold: "bg-amber-400",
    beige: "bg-amber-100",
    khaki: "bg-amber-200",
    lavender: "bg-purple-200",
    coral: "bg-orange-300",
    salmon: "bg-red-300",
    turquoise: "bg-teal-300",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
  };

  // Convert to lowercase for matching
  const normalizedColor = colorName.toLowerCase();

  // Return the mapped class or a fallback
  return colorMap[normalizedColor] || "bg-gray-300";
};

export const ProductCard = ({
  id,
  productName,
  category,
  productImgUrl,
  description,
  sellingPrice,
  variations,
}: ProductCardProps) => {
  // Track image loading error state
  const [imageLoadError, setImageLoadError] = useState(false);

  // Add debugging logs
  console.log(`ProductCard: Rendering product "${productName}" (ID: ${id})`);
  console.log("ProductImgUrl:", productImgUrl);
  console.log("Variations:", variations);

  // Get unique colors and sizes for display
  const uniqueColors = variations
    ? [...new Set(variations.map((v) => v.color))]
    : [];
  const uniqueSizes = variations
    ? [...new Set(variations.map((v) => v.size))]
    : [];

  // Get price range if variations exist
  const hasPriceVariation =
    variations &&
    variations.length > 0 &&
    variations.some((v) => v.price !== sellingPrice);

  let minPrice = sellingPrice;
  let maxPrice = sellingPrice;

  if (hasPriceVariation && variations) {
    const prices = variations.map((v) => v.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  // Check stock status
  const totalStock = variations
    ? variations.reduce((sum, v) => sum + v.quantity, 0)
    : 0;
  const isLowStock = totalStock > 0 && totalStock < 10;
  const isOutOfStock = totalStock === 0;

  // Handle image loading error
  const handleImageError = () => {
    console.error(`Image failed to load: ${productImgUrl}`);
    setImageLoadError(true);
  };

  const fallbackImageUrl = "/path/to/fallback-image.png";

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-square bg-gray-50">
          {!imageLoadError ? (
            // Use simpler Next.js Image with explicit width/height and quality
            <Image
              src={imageLoadError ? fallbackImageUrl : productImgUrl}
              alt={productName}
              width={300}
              height={300}
              quality={100}
              className="w-full h-full object-cover rounded-t-lg"
              onError={handleImageError}
              priority
            />
          ) : (
            // Display product name as fallback when image fails to load
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-lg">
              <span className="text-gray-500 font-medium text-center p-4">
                {productName}
              </span>
            </div>
          )}

          {/* Add out of stock overlay if needed */}
          {isOutOfStock && variations && variations.length > 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
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

        {/* Show available colors using Tailwind classes */}
        {uniqueColors.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {uniqueColors.map((color) => (
              <div
                key={color}
                className={cn(
                  "w-4 h-4 rounded-full border border-gray-300",
                  getColorClass(color),
                )}
                title={color}
              />
            ))}
          </div>
        )}

        {/* Show available sizes */}
        {uniqueSizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {uniqueSizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs border border-gray-300 px-1 rounded"
              >
                {size}
              </span>
            ))}
            {uniqueSizes.length > 3 && (
              <span className="text-xs border border-gray-300 px-1 rounded">
                +{uniqueSizes.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {hasPriceVariation ? (
          <p className="text-lg font-bold text-primary">
            {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
          </p>
        ) : (
          <p className="text-lg font-bold text-primary">
            {formatCurrency(sellingPrice)}
          </p>
        )}

        {isLowStock && (
          <span className="text-xs text-amber-600">Only {totalStock} left</span>
        )}
      </CardFooter>
    </Card>
  );
};
