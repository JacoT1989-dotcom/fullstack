"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { users, user_role } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { updateUserRole } from "../actions";
import { ChevronDown } from "lucide-react";

interface DataTableProps {
  initialData: {
    users: users[];
    totalCount: number;
    pageSize: number;
    page: number;
  };
  currentFilters: {
    search: string;
    role: user_role | "ALL";
    status: "active" | "inactive" | "all";
    date?: Date;
  };
}

export function DataTable({ initialData, currentFilters }: DataTableProps) {
  const router = useRouter();
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(initialData.page);

  const { search, role, status, date } = currentFilters;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, role, status, date]);

  const filteredUsers = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return initialData.users.filter((user) => {
      const matchesRole = role === "ALL" || user.role === role;
      const matchesStatus =
        status === "all" || user.is_active === (status === "active");
      const matchesDate =
        !date || (user.created_at && new Date(user.created_at) >= date);

      if (!matchesRole || !matchesStatus || !matchesDate) return false;

      if (!searchTerm) return true;

      return (
        user.username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.first_name?.toLowerCase().includes(searchTerm) ||
        user.last_name?.toLowerCase().includes(searchTerm)
      );
    });
  }, [initialData.users, search, role, status, date]);

  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentPageUsers = filteredUsers.slice(
      startIndex,
      startIndex + pageSize,
    );

    return {
      totalPages,
      startIndex,
      currentPageUsers,
      totalUsers: filteredUsers.length,
      endIndex: Math.min(filteredUsers.length, startIndex + pageSize),
    };
  }, [filteredUsers, currentPage, pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    window.history.pushState({}, "", `?${params.toString()}`);
  }, []);

  const handleRoleUpdate = async (userId: number, newRole: user_role) => {
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) router.refresh();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const formatDate = useCallback((date: Date | null): string => {
    if (!date) return "Never";
    return format(new Date(date), "PPp");
  }, []);

  const getStatusBadgeColor = useCallback(
    (isActive: boolean | null): string => {
      return isActive
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    },
    [],
  );

  const getRoleBadgeColor = useCallback((role: user_role): string => {
    switch (role) {
      case "SystemAdministrator":
        return "bg-purple-100 text-purple-800";
      case "Monitor":
        return "bg-blue-100 text-blue-800";
      case "Inspector":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  return (
    <div className="rounded-md border">
      <div className="h-[640px] flex flex-col">
        <Table>
          <TableHeader className="bg-background">
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginationInfo.currentPageUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(user.is_active)}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.last_login)}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center"
                      >
                        Change Role
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      {[
                        "User",
                        "SystemAdministrator",
                        "Monitor",
                        "Inspector",
                      ].map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() =>
                            handleRoleUpdate(user.user_id, role as user_role)
                          }
                          className="flex items-center justify-between"
                        >
                          {role}
                          {user.role === role && (
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              Current
                            </Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginationInfo.currentPageUsers.length < pageSize && (
              <TableRow>
                <TableCell colSpan={6} className="h-[1px]" />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-t bg-background">
        <div className="text-sm text-gray-500">
          Showing {paginationInfo.startIndex + 1}-{paginationInfo.endIndex} of{" "}
          {paginationInfo.totalUsers} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="h-8"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {paginationInfo.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= paginationInfo.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="h-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
