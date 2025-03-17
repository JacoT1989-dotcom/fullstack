"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  User as UserIcon,
  Heart,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";

interface CustomerSidebarProps {
  user: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    streetAddress?: string;
    suburb?: string | null;
    townCity?: string;
    postcode?: string;
    country?: string;
    avatarUrl?: string | null;
    backgroundUrl?: string | null;
    role?: string;
  };
}

export default function CustomerSidebar({ user }: CustomerSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mainMargin, setMainMargin] = useState("ml-64");

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
        <div
          className={`${isCollapsed ? "py-6 px-2" : "p-6"} border-b border-slate-600 flex flex-col items-center`}
        >
          <div className="relative">
            {/* Avatar with white border */}
            <div
              className={`${isCollapsed ? "h-12 w-12" : "h-24 w-24"} rounded-full overflow-hidden bg-slate-600 mb-3 transition-all duration-300 border-2 border-white relative mt-5`}
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName || "User"}
                  width={isCollapsed ? 48 : 96}
                  height={isCollapsed ? 48 : 96}
                  className="h-full w-full object-cover "
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-600">
                  <UserIcon
                    size={isCollapsed ? 24 : 48}
                    className="text-slate-300"
                  />
                </div>
              )}
            </div>
            {/* Pencil icon positioned at the bottom-right of the avatar */}
            <div className="absolute right-0 bottom-0 bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={isCollapsed ? 14 : 18}
                height={isCollapsed ? 14 : 18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </div>
          </div>

          {!isCollapsed && (
            <>
              <h2 className="text-xl font-semibold mt-2">
                {user.displayName || "Customer1"}
              </h2>

              <div className="flex gap-3 mt-4 w-full">
                <Link href="/customer/profile" className="block w-1/2">
                  <button className="w-full py-3 px-3 bg-teal-500 rounded text-center font-medium hover:bg-teal-400 transition">
                    View
                  </button>
                </Link>
                <Link href="/customer/profile/edit" className="block w-1/2">
                  <button className="w-full py-3 px-3 bg-slate-600 rounded text-center font-medium hover:bg-slate-500 transition">
                    Edit
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Stats Section */}
        {!isCollapsed && (
          <div className="flex border-b border-slate-600">
            <div className="flex-1 py-4 text-center border-r border-slate-600">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-slate-300">Orders</p>
            </div>
            <div className="flex-1 py-4 text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-slate-300">Wishlist</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="py-4">
          <ul>
            <li className="relative group">
              <Link
                href="/customer/account"
                className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
              >
                <UserIcon className={isCollapsed ? "" : "mr-3"} size={20} />
                {!isCollapsed && <span>My Account</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    My Account
                  </div>
                )}
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/customer/orders"
                className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
              >
                <ShoppingBag className={isCollapsed ? "" : "mr-3"} size={20} />
                {!isCollapsed && <span>My Orders</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    My Orders
                  </div>
                )}
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/customer/wishlist"
                className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
              >
                <Heart className={isCollapsed ? "" : "mr-3"} size={20} />
                {!isCollapsed && <span>Wishlist</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    Wishlist
                  </div>
                )}
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/customer/subscriptions"
                className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
              >
                <Calendar className={isCollapsed ? "" : "mr-3"} size={20} />
                {!isCollapsed && <span>Subscriptions</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    Subscriptions
                  </div>
                )}
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/customer/payment-methods"
                className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
              >
                <CreditCard className={isCollapsed ? "" : "mr-3"} size={20} />
                {!isCollapsed && <span>Payment Methods</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    Payment Methods
                  </div>
                )}
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/customer/settings"
                className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
              >
                <Settings className={isCollapsed ? "" : "mr-3"} size={20} />
                {!isCollapsed && <span>Settings</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    Settings
                  </div>
                )}
              </Link>
            </li>
            <li className="relative group">
              <Link
                href="/customer/support"
                className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
              >
                <HelpCircle className={isCollapsed ? "" : "mr-3"} size={20} />
                {!isCollapsed && <span>Support</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    Support
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </nav>
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
