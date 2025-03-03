"use server";

import prisma from "@/lib/prisma";
import { ApparelType, ProductActionResult } from "../types";

export async function getApparelProducts(): Promise<ProductActionResult> {
  try {
    console.log("Server: Fetching apparel products");

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

    console.log(`Server: Found ${products.length} apparel products`);

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

    console.log("Server: Apparel products transformed successfully");

    return {
      success: true,
      products: transformedProducts,
    };
  } catch (error) {
    console.error("Server Error fetching apparel products:", error);
    return {
      success: false,
      error: "Failed to fetch apparel products",
    };
  }
}

// Get apparel products by specific type (t-shirt, pants, etc.)
export async function getApparelProductsByType(
  type: ApparelType,
): Promise<ProductActionResult> {
  try {
    console.log(`Server: Fetching ${type} apparel products`);

    // Since we don't have a dedicated apparelType field in the database,
    // we'll fetch all apparel products first and then filter based on category
    // or product name to identify specific types
    const allApparelProducts = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["apparel", "Apparel", "APPAREL"],
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

    // Convert type string to format for comparison (handle t-shirt vs tshirt variations)
    const normalizedType = type.toLowerCase().replace(/-/g, "");

    // Filter products by apparel type using the category array or product name
    const filteredProducts = allApparelProducts.filter((product) => {
      // Check if the product's category array includes the type
      const categoryMatch = product.category.some(
        (cat) => cat.toLowerCase().replace(/-/g, "") === normalizedType,
      );

      // Check if the product name contains the type string
      const nameMatch = product.productName
        .toLowerCase()
        .replace(/-/g, "")
        .includes(normalizedType);

      return categoryMatch || nameMatch;
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
    console.error(`Server Error fetching ${type} apparel products:`, error);
    return {
      success: false,
      error: `Failed to fetch ${type} apparel products`,
    };
  }
}

// Optional: Get featured apparel products (e.g., new arrivals, bestsellers)
export async function getFeaturedApparelProducts(
  limit: number = 4,
): Promise<ProductActionResult> {
  try {
    console.log(`Server: Fetching ${limit} featured apparel products`);

    const products = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["apparel", "Apparel", "APPAREL"],
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
    console.error("Server Error fetching featured apparel products:", error);
    return {
      success: false,
      error: "Failed to fetch featured apparel products",
    };
  }
}
