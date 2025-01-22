"use client";

import { useState } from "react";
import { users, user_role } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { UserAnalytics } from "./UserAnalytics";
import { DataTable } from "./DataTable";

interface Props {
  initialData: {
    users: users[];
    analytics: {
      pendingRegistrations: number;
      activeSessions: number;
      inactiveUsers: number;
      totalUsers: number;
    };
    totalCount: number;
    pageSize: number;
    page: number;
  };
  initialFilters: {
    search: string;
    role: user_role | "ALL";
    status: "active" | "inactive" | "all";
    date?: Date;
  };
}

export function ClientPageContent({ initialData, initialFilters }: Props) {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <>
      <UserAnalytics analytics={initialData.analytics} />
      <div className="bg-background border rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search users..."
            defaultValue={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="max-w-sm bg-background"
          />

          <Select
            value={filters.role}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                role: value as user_role | "ALL",
              }))
            }
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="SystemAdministrator">
                System Administrator
              </SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Inspector">Inspector</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value as "all" | "active" | "inactive",
              }))
            }
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] bg-background">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date
                  ? format(filters.date, "PPP")
                  : "Registration Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => setFilters((prev) => ({ ...prev, date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                search: "",
                role: "ALL",
                status: "all",
                date: undefined,
              })
            }
            className="flex items-center bg-background"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>

      <DataTable initialData={initialData} currentFilters={filters} />
    </>
  );
}

export default ClientPageContent;
