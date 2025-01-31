// types.ts

// Define allowed image types
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
] as const;

export const MAX_IMAGE_SIZE = 6 * 1024 * 1024; // 6mb

export interface Product {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
  isPublished: boolean;
}

export interface ProductActionResult {
  success: boolean;
  product?: Product;
  error?: string;
}
