"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult } from "./type";

export async function getApparelProducts(): Promise<ProductActionResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["apparel", "Apparel", "APPAREL"], // Match any case variation
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
    console.error("Error fetching apparel products:", error);
    return {
      success: false,
      error: "Failed to fetch apparel products",
    };
  }
}
