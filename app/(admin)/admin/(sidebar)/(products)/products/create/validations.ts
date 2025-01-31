// schema.ts
import { z } from "zod";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./types";

export const createProductSchema = z.object({
  productImage: z
    .custom<File>()
    .refine((file) => file !== undefined, "Product image is required")
    .refine(
      (file) => file instanceof File && file.size > 0,
      "Please select a valid file",
    )
    .refine(
      (file) =>
        file instanceof File && ALLOWED_IMAGE_TYPES.includes(file.type as any),
      "Invalid file type. Allowed types are JPEG, PNG, GIF, WebP, SVG, BMP, and TIFF",
    )
    .refine(
      (file) => file instanceof File && file.size <= MAX_IMAGE_SIZE,
      "File size must be less than 10MB",
    ),
  productName: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters"),
  category: z
    .array(z.string())
    .min(1, "At least one category is required")
    .max(5, "Maximum 5 categories allowed"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  sellingPrice: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999.99, "Price must be less than 1,000,000"),
  isPublished: z.boolean().default(true),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
