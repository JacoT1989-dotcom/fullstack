// types.ts
import { users, user_role } from "@prisma/client";

export interface UserAnalyticsData {
  pendingRegistrations: number;
  activeSessions: number;
  inactiveUsers: number;
  totalUsers: number;
}

export interface UserTableData {
  users: users[];
  totalCount: number;
  pageSize: number;
  page: number;
  analytics: UserAnalyticsData;
}

export interface FilterOptions {
  role?: user_role | null;
  isActive?: boolean;
  registrationDate?: Date;
  lastLoginDate?: Date;
  searchTerm?: string;
  sortBy?: keyof users;
  sortOrder?: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface CurrentFilters {
  search?: string;
  role?: user_role | "ALL";
  status?: "active" | "inactive" | "all";
  date?: Date;
}
