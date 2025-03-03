"use server";

import prisma from "@/lib/prisma";
import { ProductActionResult, HeadwearType } from "../types";

// Use type from imported types.ts
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

// Get headwear products by type by filtering the category array
export async function getHeadwearProductsByType(
  type: HeadwearType,
): Promise<ProductActionResult> {
  try {
    console.log(`Server: Fetching ${type} headwear products`);

    // Since we don't have a dedicated headwearType field in the database,
    // we'll fetch all headwear products first and then filter based on category
    // or product name to identify specific types
    const allHeadwearProducts = await prisma.product.findMany({
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

    // Filter products by headwear type using the category array or product name
    // This assumes you're using the category array to store headwear types like ["headwear", "cap"]
    const filteredProducts = allHeadwearProducts.filter((product) => {
      // Convert type (like "cap") to check for in category array
      const typeToCheck = type.toLowerCase();

      // Check if the product's category array includes the type
      // Or check if the product name contains the type string
      return (
        product.category.some((cat) => cat.toLowerCase() === typeToCheck) ||
        product.productName.toLowerCase().includes(typeToCheck)
      );
    });

    // Transform the data to match your frontend expectations
    const transformedProducts = filteredProducts.map((product) => {
      const { Variation, ...productData } = product;
      return {
        ...productData,
        variations: Variation,
      };
    });

    console.log(`Server: Found ${transformedProducts.length} ${type} products`);

    return {
      success: true,
      products: transformedProducts,
    };
  } catch (error) {
    console.error(`Server Error fetching ${type} headwear products:`, error);
    return {
      success: false,
      error: `Failed to fetch ${type} headwear products`,
    };
  }
}
