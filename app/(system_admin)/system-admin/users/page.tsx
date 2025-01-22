import React from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getUserTableData } from "./actions";
import { user_role } from "@prisma/client";
import ClientPageContent from "./_components/ClientPageContent";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    role?: string;
    status?: string;
    date?: string;
  };
}

export default async function UserTable({ searchParams }: PageProps) {
  const { user } = await validateRequest();

  if (!user || user.role !== "SystemAdministrator") {
    redirect("/unauthorized");
  }

  // Fetch all data at once for client-side filtering
  const initialData = await getUserTableData({
    page: 1,
    pageSize: 1000, // Get all records for client-side filtering
    sortBy: "created_at",
    sortOrder: "desc",
  });

  if (!initialData.success) {
    return <div>Error loading user data</div>;
  }

  const initialFilters = {
    search: searchParams.search || "",
    role: (searchParams.role as user_role | "ALL") || "ALL",
    status: (searchParams.status as "active" | "inactive" | "all") || "all",
    date: searchParams.date ? new Date(searchParams.date) : undefined,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      <ClientPageContent
        initialData={initialData.data}
        initialFilters={initialFilters}
      />
    </div>
  );
}
