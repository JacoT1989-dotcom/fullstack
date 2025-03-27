"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

/**
 * Gets the last tier application submitted by the user
 * This is used to ensure the form correctly shows the last selected tier
 * @returns The last tier package the user applied for
 */
export async function getAppliedTier() {
  // Validate that user is authenticated
  const { user, session } = await validateRequest();

  // If no valid session or user, throw an error
  if (!session || user.role !== "CUSTOMER") {
    throw new Error(
      "Unauthorized: You must be logged in as a customer to view tier applications",
    );
  }

  try {
    // Get the most recent tier application for this user
    const latestApplication = await prisma.tierAppForm.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { package: true },
    });

    return {
      success: true,
      appliedTier: latestApplication?.package || null,
    };
  } catch (error) {
    console.error("Error fetching applied tier:", error);
    return {
      success: false,
      appliedTier: null,
      error: "Failed to fetch applied tier. Please try again later.",
    };
  }
}
