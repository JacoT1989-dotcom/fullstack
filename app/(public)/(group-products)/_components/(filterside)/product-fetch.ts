"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult } from "./types";

/**
 * Fetches all products from the database with their variations,
 * regardless of category, but maintains category information
 */
export async function getAllProducts(): Promise<ProductActionResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
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

    // Log category distribution for debugging
    const categoryDistribution = products.reduce<Record<string, number>>(
      (acc, product) => {
        if (product.category) {
          product.category.forEach((cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
          });
        }
        return acc;
      },
      {},
    );

    // Transform the data to match frontend expectations
    const transformedProducts = products.map((product) => {
      // Create a copy without Variation to avoid property name conflicts
      const { Variation, ...productData } = product;

      // Return a new object with variations property
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
    console.error("Server Error fetching all products:", error);
    return {
      success: false,
      error: "Failed to fetch all products",
    };
  }
}

/**
 * Fetches a single product by ID with its variations
 */
export async function getProductById(
  productId: string,
): Promise<ProductActionResult> {
  try {
    console.log(`Server: Fetching product with ID: ${productId}`);

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
    });

    if (!product) {
      console.log(`Server: Product with ID ${productId} not found`);
      return {
        success: false,
        error: "Product not found",
      };
    }

    console.log(`Server: Successfully fetched product with ID: ${productId}`);

    // Transform the product data
    const { Variation, ...productData } = product;
    const transformedProduct = {
      ...productData,
      variations: Variation,
    };

    return {
      success: true,
      product: transformedProduct,
    };
  } catch (error) {
    console.error(`Server Error fetching product with ID ${productId}:`, error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}
