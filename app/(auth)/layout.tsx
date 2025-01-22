import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

enum UserRole {
  User = "User",
  SystemAdministrator = "SystemAdministrator",
  SecurityAdministrator = "SecurityAdministrator",
  PermitAdministrator = "PermitAdministrator",
  PermitHolder = "PermitHolder",
  RightsHolder = "RightsHolder",
  Skipper = "Skipper",
  Inspector = "Inspector",
  Monitor = "Monitor",
  Driver = "Driver",
  FactoryStockController = "FactoryStockController",
  LocalOutletController = "LocalOutletController",
  ExportController = "ExportController",
}

const roleRoutes: Record<UserRole, string> = {
  [UserRole.User]: "/",
  [UserRole.SystemAdministrator]: "/system-admin",
  [UserRole.SecurityAdministrator]: "/security-admin",
  [UserRole.PermitAdministrator]: "/permit-admin",
  [UserRole.PermitHolder]: "/permit-holder",
  [UserRole.RightsHolder]: "/rights-holder",
  [UserRole.Skipper]: "/skipper",
  [UserRole.Inspector]: "/inspector",
  [UserRole.Monitor]: "/monitor",
  [UserRole.Driver]: "/driver",
  [UserRole.FactoryStockController]: "/factory-stock-controller",
  [UserRole.LocalOutletController]: "/local-outlet-controller",
  [UserRole.ExportController]: "/export-controller",
};

function toUserRole(role: string): UserRole | undefined {
  return Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : undefined;
}

export default async function RoleBasedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) {
    const userRole = toUserRole(user.role);

    if (userRole && userRole in roleRoutes) {
      redirect(roleRoutes[userRole]);
    } else {
      console.warn(`Unrecognized user role: ${user.role}`);
      redirect("/");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster />
    </div>
  );
}
