"use server";

import prisma from "@/lib/prisma";
import { Product as PrismaProduct } from "@prisma/client";

// Define a variation type
interface Variation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

// Create an extended product type
interface ExtendedProduct extends Omit<PrismaProduct, "Variation"> {
  variations?: Variation[];
}

export interface ProductActionResult {
  success: boolean;
  product?: ExtendedProduct;
  products?: ExtendedProduct[];
  error?: string;
}

export async function getHeadwearProducts(): Promise<ProductActionResult> {
  try {
    console.log("Server: Fetching headwear products");

    const products = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["headwear", "Headwear", "HEADWEAR"],
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
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        Variation: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            sku: true,
            quantity: true,
            price: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log(`Server: Found ${products.length} products`);

    // Log detailed info about each product's image URL for debugging
    products.forEach((product, index) => {
      console.log(`Server: Product ${index + 1} (${product.productName}):`, {
        id: product.id,
        imageUrl: product.productImgUrl,
        variationsCount: product.Variation.length,
      });
    });

    // Transform the data to match your frontend expectations
    const transformedProducts = products.map((product) => {
      // Create a copy without Variation to avoid property name conflicts
      const { Variation, ...productData } = product;

      // Return a new object with variations property
      return {
        ...productData,
        variations: Variation,
      };
    });

    console.log("Server: Products transformed successfully");

    return {
      success: true,
      products: transformedProducts,
    };
  } catch (error) {
    console.error("Server Error fetching headwear products:", error);
    return {
      success: false,
      error: "Failed to fetch headwear products",
    };
  }
}
