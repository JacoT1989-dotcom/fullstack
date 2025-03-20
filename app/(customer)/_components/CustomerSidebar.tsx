"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import ProfileSection from "./(sidebar)/ProfileSection";
import StatsSection from "./(sidebar)/StatsSection";
import NavigationLinks from "./(sidebar)/NavigationLinks";
import { SessionUser } from "@/app/SessionProvider";

// Define props interface directly in the file
interface CustomerSidebarProps {
  user: SessionUser;
  orderCount: number;
}

export default function CustomerSidebar({
  user,
  orderCount,
}: CustomerSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Update main content margin based on sidebar state
    document
      .querySelector("main")
      ?.classList.remove(isCollapsed ? "ml-64" : "ml-16");
    document
      .querySelector("main")
      ?.classList.add(isCollapsed ? "ml-16" : "ml-64");
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative h-full">
      <aside
        className={`${isCollapsed ? "w-16" : "w-64"} bg-slate-700 text-white fixed top-0 left-0 h-full transition-all duration-300 overflow-hidden pt-16 z-10`}
      >
        {/* Profile Section */}
        <ProfileSection user={user} isCollapsed={isCollapsed} />

        {/* Stats Section */}
        {!isCollapsed && <StatsSection orderCount={orderCount} />}

        {/* Navigation Links */}
        <NavigationLinks isCollapsed={isCollapsed} />
      </aside>

      {/* Toggle Button - moved down by 80px */}
      <div
        className={`fixed ${isCollapsed ? "left-16" : "left-64"} top-100 transition-all duration-300 z-20`}
      >
        <button
          onClick={toggleSidebar}
          className="bg-teal-500 text-white p-2 rounded-r-md w-8 h-8 flex items-center justify-center"
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
