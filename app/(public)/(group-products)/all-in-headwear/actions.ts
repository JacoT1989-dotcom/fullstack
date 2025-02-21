"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult } from "./type";

export async function getHeadwearProducts(): Promise<ProductActionResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["headwear", "Headwear", "HEADWEAR"], // Match any case variation
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
        createdAt: "asc",
      },
    });

    return {
      success: true,
      products,
    };
  } catch (error) {
    console.error("Error fetching headwear products:", error);
    return {
      success: false,
      error: "Failed to fetch headwear products",
    };
  }
}
