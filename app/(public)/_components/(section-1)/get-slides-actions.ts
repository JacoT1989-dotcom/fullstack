"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { type SlidesResponse } from "./types";

export async function getSlides(): Promise<SlidesResponse> {
  try {
    // Remove the authentication requirement entirely
    const slides = await prisma.slide.findMany({
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        sliderImageurl: true,
        title: true,
        description: true,
        bgColor: true,
        order: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: slides,
    };
  } catch (error) {
    console.error("Error fetching slides:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
