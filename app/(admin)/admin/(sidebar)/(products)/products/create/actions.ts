"use server";

import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export async function createProduct() {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
      return redirect("/login");
    }
  } catch (error) {
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    });
  }
}
