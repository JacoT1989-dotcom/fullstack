// productStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { usePathname } from "next/navigation";
import {
  ProductActionResult,
  ProductCategory,
  ProductWithVariations,
} from "../(filterside)/types";
import { getAllProducts } from "../(filterside)/product-fetch";

// Define stock status types
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "all";

// Define price range filter
export type PriceRange = {
  min: number;
  max: number | null; // null for no upper limit
  label: string;
};

// Define the store state type
interface ProductState {
  allProducts: ProductWithVariations[];
  isLoading: boolean;
  error: string | null;

  // Filter states
  categoryFilter: ProductCategory | "all";
  priceRangeFilter: PriceRange | null;
  stockStatusFilter: StockStatus;
  colorFilter: string | null;

  // Available filter options (derived from actual data)
  availableColors: string[];

  // Predefined price ranges
  priceRanges: PriceRange[];

  // Actions
  fetchProducts: () => Promise<void>;
  setCategoryFilter: (category: ProductCategory | "all") => void;
  setPriceRangeFilter: (priceRange: PriceRange | null) => void;
  setStockStatusFilter: (status: StockStatus) => void;
  setColorFilter: (color: string | null) => void;

  // Getters for filtered products
  getFilteredProducts: () => ProductWithVariations[];
  getApparelProducts: () => ProductWithVariations[];
  getHeadwearProducts: () => ProductWithVariations[];
  getAllCollectionsProducts: () => ProductWithVariations[];
}

// Helper functions for filtering
const isInCategory = (
  product: ProductWithVariations,
  category: ProductCategory | "all",
): boolean => {
  if (category === "all") return true;

  const categoryVariations = [
    category,
    category.toLowerCase(),
    category.toUpperCase(),
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
  ];

  return product.category.some((cat) => categoryVariations.includes(cat));
};

const isInPriceRange = (
  product: ProductWithVariations,
  priceRange: PriceRange | null,
): boolean => {
  if (!priceRange) return true;

  const { min, max } = priceRange;
  return (
    product.sellingPrice >= min && (max === null || product.sellingPrice <= max)
  );
};

const getProductStockStatus = (product: ProductWithVariations): StockStatus => {
  // If no variations, use a default logic based on some assumption
  if (!product.variations || product.variations.length === 0) {
    return "out-of-stock";
  }

  // Calculate total quantity across all variations
  const totalQuantity = product.variations.reduce(
    (sum, variation) => sum + variation.quantity,
    0,
  );

  if (totalQuantity <= 0) return "out-of-stock";
  if (totalQuantity < 100) return "low-stock";
  return "in-stock";
};

const hasColor = (
  product: ProductWithVariations,
  color: string | null,
): boolean => {
  if (!color) return true;

  return (
    product.variations?.some(
      (variation) => variation.color.toLowerCase() === color.toLowerCase(),
    ) || false
  );
};

// Create the store
export const useProductStore = create<ProductState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        allProducts: [],
        isLoading: false,
        error: null,

        categoryFilter: "all",
        priceRangeFilter: null,
        stockStatusFilter: "all",
        colorFilter: null,

        availableColors: [],

        priceRanges: [
          { min: 0, max: 20, label: "Under $20" },
          { min: 20, max: 50, label: "$20 - $50" },
          { min: 50, max: 100, label: "$50 - $100" },
          { min: 100, max: 200, label: "$100 - $200" },
          { min: 200, max: null, label: "$200 & Above" },
        ],

        // Actions
        fetchProducts: async () => {
          set({ isLoading: true, error: null });

          try {
            const result: ProductActionResult = await getAllProducts();

            if (!result.success || !result.products) {
              throw new Error(result.error || "Failed to fetch products");
            }

            // Extract all unique colors from variations
            const allColors = new Set<string>();
            result.products.forEach((product) => {
              product.variations?.forEach((variation) => {
                if (variation.color) {
                  allColors.add(variation.color.toLowerCase());
                }
              });
            });

            set({
              allProducts: result.products,
              isLoading: false,
              availableColors: Array.from(allColors),
            });
          } catch (error) {
            console.error("Error fetching products:", error);
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        },

        setCategoryFilter: (category) => set({ categoryFilter: category }),
        setPriceRangeFilter: (priceRange) =>
          set({ priceRangeFilter: priceRange }),
        setStockStatusFilter: (status) => set({ stockStatusFilter: status }),
        setColorFilter: (color) => set({ colorFilter: color }),

        // Getters for filtered products
        getFilteredProducts: (pathname?: string) => {
          const {
            allProducts,
            categoryFilter,
            priceRangeFilter,
            stockStatusFilter,
            colorFilter,
          } = get();

          // Determine active category based on pathname if provided
          let activeCategoryFilter = categoryFilter;

          if (pathname) {
            // Extract category from pathname
            // Example: /products/apparel -> apparel
            // or /apparel -> apparel
            const pathSegments = pathname.split("/").filter(Boolean);
            const lastSegment = pathSegments[pathSegments.length - 1];

            if (lastSegment) {
              // Check if the last segment maps to one of our known categories
              const knownCategories = [
                "apparel",
                "headwear",
                "all-collections",
              ];
              const matchedCategory = knownCategories.find(
                (cat) => lastSegment.toLowerCase() === cat,
              );

              if (matchedCategory) {
                activeCategoryFilter = matchedCategory as ProductCategory;
              }
            }
          }

          return allProducts.filter(
            (product) =>
              isInCategory(product, activeCategoryFilter) &&
              isInPriceRange(product, priceRangeFilter) &&
              (stockStatusFilter === "all" ||
                getProductStockStatus(product) === stockStatusFilter) &&
              hasColor(product, colorFilter),
          );
        },

        getApparelProducts: () => {
          const { allProducts } = get();
          return allProducts.filter((product) =>
            isInCategory(product, "apparel"),
          );
        },

        getHeadwearProducts: () => {
          const { allProducts } = get();
          return allProducts.filter((product) =>
            isInCategory(product, "headwear"),
          );
        },

        getAllCollectionsProducts: () => {
          const { allProducts } = get();
          return allProducts.filter((product) =>
            isInCategory(product, "all-collections"),
          );
        },
      }),
      {
        name: "product-store", // name of item in the storage (must be unique)
        partialize: (state) => ({
          categoryFilter: state.categoryFilter,
          priceRangeFilter: state.priceRangeFilter,
          stockStatusFilter: state.stockStatusFilter,
          colorFilter: state.colorFilter,
        }), // only persist filter preferences
      },
    ),
  ),
);
