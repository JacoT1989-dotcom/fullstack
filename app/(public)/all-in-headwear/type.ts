// types.ts

// Base Product Type (for internal use)
export interface BaseProduct {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
}

// Full Product Type (includes all fields)
export interface Product extends BaseProduct {
  isPublished: boolean;
}

// Public Product Type (for public-facing data)
export type PublicProduct = BaseProduct;

// Action Result Types
export interface ProductActionResult {
  success: boolean;
  error?: string;
  product?: Product;
  products?: PublicProduct[]; // Changed to PublicProduct for public endpoints
}
