"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult } from "../types";

export async function getAllCollectionsProducts(): Promise<ProductActionResult> {
  try {
    console.log("Server: Fetching all-collections products");

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

    console.log(`Server: Found ${products.length} all-collections products`);

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

    console.log("Server: All-collections products transformed successfully");

    return {
      success: true,
      products: transformedProducts,
    };
  } catch (error) {
    console.error("Server Error fetching all-collections products:", error);
    return {
      success: false,
      error: "Failed to fetch all-collections products",
    };
  }
}

// Get featured products from all collections (e.g., newest or bestselling)
export async function getFeaturedCollectionProducts(
  limit: number = 8,
): Promise<ProductActionResult> {
  try {
    console.log(`Server: Fetching ${limit} featured collection products`);

    const products = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["all-collections", "All-Collections", "ALL-COLLECTIONS"],
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
        createdAt: "desc", // Get newest products
      },
      take: limit,
    });

    // Transform the data to match your frontend expectations
    const transformedProducts = products.map((product) => {
      const { Variation, ...productData } = product;
      return {
        ...productData,
        variations: Variation,
      };
    });

    return {
      success: true,
      products: transformedProducts,
    };
  } catch (error) {
    console.error("Server Error fetching featured collection products:", error);
    return {
      success: false,
      error: "Failed to fetch featured collection products",
    };
  }
}

// Get products by specific collection name (if you have named collections besides just "all-collections")
export async function getProductsByCollectionName(
  collectionName: string,
): Promise<ProductActionResult> {
  try {
    console.log(
      `Server: Fetching products from "${collectionName}" collection`,
    );

    // Normalize the collection name for case-insensitive search
    const normalizedCollectionName = collectionName.toLowerCase();

    const products = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["all-collections", "All-Collections", "ALL-COLLECTIONS"],
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

    // Filter products where any category matches the collection name
    const filteredProducts = products.filter((product) =>
      product.category.some(
        (cat) => cat.toLowerCase() === normalizedCollectionName,
      ),
    );

    console.log(
      `Server: Found ${filteredProducts.length} products in "${collectionName}" collection`,
    );

    // Transform the data to match your frontend expectations
    const transformedProducts = filteredProducts.map((product) => {
      const { Variation, ...productData } = product;
      return {
        ...productData,
        variations: Variation,
      };
    });

    return {
      success: true,
      products: transformedProducts,
    };
  } catch (error) {
    console.error(
      `Server Error fetching products from "${collectionName}" collection:`,
      error,
    );
    return {
      success: false,
      error: `Failed to fetch products from "${collectionName}" collection`,
    };
  }
}
