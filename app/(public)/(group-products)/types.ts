// types.ts

// Variation Type
export interface Variation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

// Product Category Type
export type ProductCategory = "apparel" | "headwear" | "all-collections";

// Headwear Type
export type HeadwearType =
  | "cap"
  | "beanie"
  | "bucket-hat"
  | "snapback"
  | "trucker"
  | "visor";

// Apparel Type
export type ApparelType =
  | "tshirt"
  | "hoodie"
  | "sweater"
  | "pants"
  | "shorts"
  | "jacket"
  | "shirt"
  | "dress"
  | "skirt"
  | "tank-top"
  | "polo"
  | "sweatpants";

// Base Product Type (for internal use)
export interface BaseProduct {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
}

// Headwear Product Type
export interface HeadwearProduct extends BaseProduct {
  headwearType: HeadwearType;
  adjustable?: boolean;
  material?: string;
}

// Apparel Product Type
export interface ApparelProduct extends BaseProduct {
  apparelType: ApparelType;
  gender?: string;
  material?: string;
  fit?: string;
}

// Full Product Type (includes all fields)
export interface Product extends BaseProduct {
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

// Product with variations
export interface ProductWithVariations extends BaseProduct {
  variations?: Variation[];
  isPublished?: boolean; // Made optional to work with server actions
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  headwearType?: HeadwearType; // Optional for headwear products
  apparelType?: ApparelType; // Optional for apparel products
}

// Public Product Type (for public-facing data)
export type PublicProduct = BaseProduct;

// Public Product with variations
export interface PublicProductWithVariations extends PublicProduct {
  variations?: Variation[];
}

// Filter types
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "all";

export interface PriceRange {
  min: number;
  max: number | null; // null for no upper limit
  label: string;
}

// Action Result Types
export interface ProductActionResult {
  success: boolean;
  error?: string;
  product?: ProductWithVariations;
  products?: BaseProduct[] | ProductWithVariations[]; // Accept either type
}

// Helper function to determine stock status
export const getProductStockStatus = (
  product: ProductWithVariations,
): StockStatus => {
  if (!product.variations || product.variations.length === 0) {
    return "out-of-stock";
  }

  // Calculate total quantity across all variations
  const totalQuantity = product.variations.reduce(
    (sum, variation) => sum + variation.quantity,
    0,
  );

  if (totalQuantity <= 0) return "out-of-stock";
  if (totalQuantity < 100) return "low-stock";
  return "in-stock";
};
