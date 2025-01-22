import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Google } from "arctic";
import { Lucia, Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "./lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.users);

interface DatabaseUserAttributes {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rsa_id: string | null;
  cell_number: string | null;
  physical_address: string | null;
  profile_picture_url: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  role:
    | "User"
    | "SystemAdministrator"
    | "SecurityAdministrator"
    | "PermitAdministrator"
    | "PermitHolder"
    | "RightsHolder"
    | "Skipper"
    | "Inspector"
    | "Monitor"
    | "Driver"
    | "FactoryStockController"
    | "LocalOutletController"
    | "ExportController";
  quota_code: string | null;
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      userId: attributes.user_id,
      username: attributes.username,
      email: attributes.email,
      firstName: attributes.first_name,
      lastName: attributes.last_name,
      rsaId: attributes.rsa_id,
      cellNumber: attributes.cell_number,
      physicalAddress: attributes.physical_address,
      profilePictureUrl: attributes.profile_picture_url,
      isVerified: attributes.is_verified,
      isActive: attributes.is_active,
      role: attributes.role,
      quotaCode: attributes.quota_code,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
);

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}

    return result;
  },
);
