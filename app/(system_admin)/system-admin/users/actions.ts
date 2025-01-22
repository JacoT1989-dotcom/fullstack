"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma, user_role, users } from "@prisma/client";
import { subMonths } from "date-fns";

interface UserAnalytics {
  pendingRegistrations: number;
  activeSessions: number;
  inactiveUsers: number;
  totalUsers: number;
}

interface UserTableData {
  users: users[];
  totalCount: number;
  pageSize: number;
  page: number;
  analytics: UserAnalytics;
}

interface FilterOptions {
  role?: user_role;
  isActive?: boolean;
  registrationDate?: Date;
  lastLoginDate?: Date;
  searchTerm?: string;
  sortBy?: keyof users;
  sortOrder?: "asc" | "desc";
  page: number;
  pageSize: number;
}

export async function getUserTableData(filters: FilterOptions): Promise<{
  success: boolean;
  data: UserTableData;
  error?: string;
}> {
  try {
    const { user } = await validateRequest();

    if (!user || user.role !== "SystemAdministrator") {
      return {
        success: false,
        data: {
          users: [],
          totalCount: 0,
          pageSize: filters.pageSize,
          page: filters.page,
          analytics: {
            pendingRegistrations: 0,
            activeSessions: 0,
            inactiveUsers: 0,
            totalUsers: 0,
          },
        },
        error: "Unauthorized access",
      };
    }

    const {
      role,
      isActive,
      registrationDate,
      searchTerm,
      sortBy = "created_at",
      sortOrder = "desc",
      page = 1,
      pageSize = 10,
    } = filters;

    const whereConditions: Prisma.usersWhereInput = {
      ...(role && { role }),
      ...(isActive !== undefined && { is_active: isActive }),
      ...(registrationDate && { created_at: { gte: registrationDate } }),
      ...(searchTerm && {
        OR: [
          { username: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
          { first_name: { contains: searchTerm, mode: "insensitive" } },
          { last_name: { contains: searchTerm, mode: "insensitive" } },
        ],
      }),
    };

    const [users, totalCount, analytics] = await Promise.all([
      prisma.users.findMany({
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          Session: true,
        },
      }),
      prisma.users.count({ where: whereConditions }),
      getPendingRegistrationsAnalytics(),
    ]);

    return {
      success: true,
      data: {
        users,
        totalCount,
        pageSize,
        page,
        analytics,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      success: false,
      data: {
        users: [],
        totalCount: 0,
        pageSize: filters.pageSize,
        page: filters.page,
        analytics: {
          pendingRegistrations: 0,
          activeSessions: 0,
          inactiveUsers: 0,
          totalUsers: 0,
        },
      },
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

async function getPendingRegistrationsAnalytics(): Promise<UserAnalytics> {
  const [pendingRegistrations, activeSessions, inactiveUsers, totalUsers] =
    await Promise.all([
      prisma.users.count({
        where: { role: "User" },
      }),
      prisma.session.count({
        where: { expiresAt: { gt: new Date() } },
      }),
      prisma.users.count({
        where: {
          last_login: {
            lt: subMonths(new Date(), 2),
          },
        },
      }),
      prisma.users.count(),
    ]);

  return {
    pendingRegistrations,
    activeSessions,
    inactiveUsers,
    totalUsers,
  };
}

export async function updateUserRole(
  userId: number,
  newRole: user_role,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await validateRequest();

    if (!user || user.role !== "SystemAdministrator") {
      return { success: false, error: "Unauthorized access" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { user_id: userId },
        data: {
          role: newRole,
          updated_at: new Date(),
        },
      });

      await tx.audit_logs.create({
        data: {
          user_id: user.userId,
          action_type: "UPDATE_USER_ROLE",
          table_name: "users",
          record_id: userId,
          changes: { role: newRole },
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
