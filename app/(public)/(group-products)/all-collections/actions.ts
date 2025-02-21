"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult } from "./type";

export async function getAllCollectionsProducts(): Promise<ProductActionResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["all-collections", "All-Collections", "ALL-COLLECTIONS"], // Match any case variation
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
    console.error("Error fetching all-collections products:", error);
    return {
      success: false,
      error: "Failed to fetch all-collections products",
    };
  }
}
