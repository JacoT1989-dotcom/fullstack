"use server";

import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  type ProductActionResult,
} from "./types";

export async function createProduct(
  formData: FormData,
): Promise<ProductActionResult> {
  try {
    // Validate user authentication and authorization
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      return redirect("/login");
    }

    // Get form data
    const file = formData.get("productImage") as File;
    const productName = formData.get("productName") as string;
    const category = formData.getAll("category") as string[];
    const description = formData.get("description") as string;
    const sellingPrice = parseFloat(formData.get("sellingPrice") as string);
    const isPublished = formData.get("isPublished") === "true";

    // Validate inputs
    if (!file || !file.size) throw new Error("No file provided");
    if (!productName || !category.length || !description || !sellingPrice) {
      throw new Error("All fields are required");
    }

    // Validate image type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      throw new Error(
        "Invalid file type. Allowed types are JPEG, PNG, GIF, WebP, SVG, BMP, and TIFF",
      );
    }

    // Validate image size
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("File size must be less than 6MB");
    }

    // Upload image to blob storage
    const fileExt = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const path = `products/product_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    // Create product in database
    const product = await prisma.product.create({
      data: {
        productName,
        category,
        productImgUrl: blob.url,
        description,
        sellingPrice,
        isPublished,
        userId: user.id,
      },
    });

    return {
      success: true,
      product: {
        id: product.id,
        productName: product.productName,
        category: product.category,
        productImgUrl: product.productImgUrl,
        description: product.description,
        sellingPrice: product.sellingPrice,
        isPublished: product.isPublished,
      },
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
