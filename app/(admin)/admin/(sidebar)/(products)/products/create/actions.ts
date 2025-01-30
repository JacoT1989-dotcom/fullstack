"use server";

import { validateRequest } from "@/auth";

export async function createProduct() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }
  } catch (error) {
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the product",
    };
  }
}
