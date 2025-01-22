"use server";

import prisma from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { RegisterFormValues, registerSchema } from "./validation";
import { Prisma } from "@prisma/client";

export async function signUp(
  formData: RegisterFormValues,
): Promise<{ error?: string } | never> {
  try {
    const validatedData = registerSchema.parse(formData);

    const existingUsername = await prisma.users.findFirst({
      where: {
        username: {
          equals: validatedData.username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.users.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    const passwordHash = await hash(validatedData.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.users.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password_hash: passwordHash,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        rsa_id: validatedData.rsa_id,
        cell_number: validatedData.cell_number,
        physical_address: validatedData.physical_address,
        is_verified: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        role: "User",
        roleapplication: validatedData.roleapplication,
      },
    });

    redirect("/register-pending-message");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("Registration error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error:
            "Database error: Please try again or contact support if the problem persists.",
        };
      }
    }

    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
