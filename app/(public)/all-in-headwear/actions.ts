"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult } from "./type";

export async function getHeadwearProducts(): Promise<ProductActionResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "headwear",
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      products, // Now this matches the PublicProduct[] type
    };
  } catch (error) {
    console.error("Error fetching headwear products:", error);
    return {
      success: false,
      error: "Failed to fetch headwear products",
    };
  }
}
