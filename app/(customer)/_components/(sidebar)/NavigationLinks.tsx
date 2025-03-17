import Link from "next/link";
import {
  ShoppingBag,
  User as UserIcon,
  Heart,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";
import { NavigationLinksProps } from "./types";

export default function NavigationLinks({ isCollapsed }: NavigationLinksProps) {
  return (
    <nav className="py-4">
      <ul>
        <li className="relative group">
          <Link
            href="/"
            className={`flex items-center py-3 ${isCollapsed ? "justify-center px-0" : "px-6"} hover:bg-slate-600 transition`}
          >
            <UserIcon className={isCollapsed ? "" : "mr-3"} size={20} />
            {!isCollapsed && <span>Go To Home</span>}
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
  );
}
