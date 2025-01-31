// types/navigation.ts
export type NavItem = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  links: {
    name: string;
    href: string;
  }[];
};

// config/navigation.ts
import {
  Settings,
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";

export const navigation: NavItem[] = [
  {
    label: "Products",
    icon: ShoppingCart,
    links: [
      { name: "Create", href: "/admin/products/create" },
      { name: "Update", href: "/admin/products/update" },
      { name: "Collections", href: "/products/collections" },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    links: [
      { name: "Overview", href: "/customers/overview" },
      { name: "Management", href: "/customers/management" },
      { name: "Analytics", href: "/customers/analytics" },
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    links: [
      { name: "Sales", href: "/reports/sales" },
      { name: "Inventory", href: "/reports/inventory" },
      { name: "Performance", href: "/reports/performance" },
    ],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    links: [
      { name: "Dashboard", href: "/analytics/dashboard" },
      { name: "Metrics", href: "/analytics/metrics" },
      { name: "Forecasts", href: "/analytics/forecasts" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    links: [
      { name: "General", href: "/settings/general" },
      { name: "Security", href: "/settings/security" },
      { name: "Preferences", href: "/settings/preferences" },
    ],
  },
];
