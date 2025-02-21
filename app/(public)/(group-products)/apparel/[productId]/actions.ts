"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult } from "../type";

export async function getProductById(
  productId: string,
): Promise<ProductActionResult> {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isPublished: true,
      },
      select: {
        id: true,
        productName: true,
        category: true,
        productImgUrl: true,
        description: true,
        sellingPrice: true,
      },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      products: [product], // Wrapping in array to match ProductActionResult type
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}
