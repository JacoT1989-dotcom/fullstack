"use server";

import prisma from "@/lib/prisma";

// Define the ProductActionResult type directly in the file
type ProductActionResult = {
  success: boolean;
  product?: {
    id: string;
    productName: string;
    category: string[];
    productImgUrl: string;
    description: string;
    sellingPrice: number;
    variations: {
      id: string;
      name: string;
      color: string;
      size: string;
      sku: string;
      quantity: number;
      price: number;
      imageUrl: string;
    }[];
  };
  error?: string;
};

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
        // Assuming the relation field in your schema is named 'Variation'
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
      return {
        success: false,
        error: "Product not found",
      };
    }

    // Transform the data to match the expected format in your component
    return {
      success: true,
      product: {
        ...product,
        variations: product.Variation,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}
