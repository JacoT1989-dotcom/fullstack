"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContext {
  user: User & {
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    rsaId: string | null;
    cellNumber: string | null;
    physicalAddress: string | null;
    profilePictureUrl: string | null;
    isVerified: boolean | null;
    isActive: boolean | null;
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
    quotaCode: string | null;
  };
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
