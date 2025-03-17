export interface Route {
  name: string;
  path: string;
}

export const getRoutes = (): Route[] => [
  { name: "Home", path: "/" },
  { name: "Headwear", path: "/headwear" },
  { name: "Apparel", path: "/apparel" },
  { name: "All Collections", path: "/all-collections" },
  { name: "My Dashboard", path: "/customer" },
];
