import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { Toaster } from "react-hot-toast";
import { UserRole } from "@prisma/client";
import Navbar from "./_components/Navbar";
import CustomerSidebar from "./_components/CustomerSidebar";
import { getCustomerOrderCount } from "./_components/(sidebar)/_profile-actions/count-orders";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user || session.user.role !== UserRole.CUSTOMER) {
    redirect("/");
  }

  // Get the order count directly at the layout level
  const orderCountResponse = await getCustomerOrderCount();
  const orderCount = orderCountResponse.success
    ? orderCountResponse.totalOrders || 0
    : 0;

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex">
          <CustomerSidebar user={session.user} orderCount={orderCount} />
          <main className="flex-grow p-6 ml-64 transition-all duration-300 bg-slate-100 min-h-screen pt-16">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
