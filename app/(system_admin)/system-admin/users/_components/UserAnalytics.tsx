"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsProps {
  analytics: {
    pendingRegistrations: number;
    activeSessions: number;
    inactiveUsers: number;
    totalUsers: number;
  };
}

export function UserAnalytics({ analytics }: AnalyticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.pendingRegistrations}
          </div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.activeSessions}</div>
          <p className="text-xs text-muted-foreground">Currently logged in</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.inactiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            No login for 2+ months
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered users</p>
        </CardContent>
      </Card>
    </div>
  );
}
