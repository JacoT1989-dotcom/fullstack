"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { LoginFormValues } from "./validation";

const roleRoutes = {
  User: "/register-pending-message",
  SystemAdministrator: "/system-admin",
  SecurityAdministrator: "/security-admin",
  PermitAdministrator: "/permit-admin",
  PermitHolder: "/permit-holder",
  RightsHolder: "/rights-holder",
  Skipper: "/skipper",
  Inspector: "/inspector",
  Monitor: "/monitor",
  Driver: "/driver",
  FactoryStockController: "/factory-stock",
  LocalOutletController: "/local-outlet",
  ExportController: "/export",
} as const;

export async function login(
  credentials: LoginFormValues,
): Promise<{ error?: string; redirectTo?: string } | void> {
  try {
    const { email, password } = credentials;

    const existingUser = await prisma.users.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.password_hash) {
      return {
        error: "Invalid email or password",
      };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Invalid email or password",
      };
    }

    if (!existingUser.is_active) {
      return {
        error:
          "Your account has been deactivated. Please contact an administrator.",
      };
    }

    if (existingUser.role === "User") {
      return {
        error:
          "Your account is pending approval. Please wait for administrator review.",
      };
    }

    // Create session in the database first
    const dbSession = await prisma.session.create({
      data: {
        id: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        users: {
          connect: {
            user_id: existingUser.user_id,
          },
        },
      },
    });

    const sessionCookie = lucia.createSessionCookie(dbSession.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    await prisma.users.update({
      where: { user_id: existingUser.user_id },
      data: { last_login: new Date() },
    });

    const redirectPath = roleRoutes[existingUser.role];
    if (!redirectPath) {
      return {
        error: "Unable to determine user access. Please contact support.",
      };
    }

    return {
      redirectTo: redirectPath,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Login error:", error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
