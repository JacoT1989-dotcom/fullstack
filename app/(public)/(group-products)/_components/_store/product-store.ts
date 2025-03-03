// productStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
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
  colorFilters: string[]; // Array of colors
  sizeFilters: string[]; // Changed from string | null to string[]

  // Available filter options (derived from actual data)
  availableColors: string[];
  availableSizes: string[]; // Added to track available sizes

  // Predefined price ranges
  priceRanges: PriceRange[];

  // Actions
  fetchProducts: () => Promise<void>;
  setCategoryFilter: (category: ProductCategory | "all") => void;
  setPriceRangeFilter: (priceRange: PriceRange | null) => void;
  setStockStatusFilter: (status: StockStatus) => void;
  setColorFilters: (colors: string[]) => void;
  toggleColorFilter: (color: string) => void;
  setSizeFilters: (sizes: string[]) => void; // Changed to accept array of sizes
  toggleSizeFilter: (size: string) => void; // Added to toggle a size filter

  // Getters for filtered products
  getFilteredProducts: (pathname?: string) => ProductWithVariations[];
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

// Check if product has ANY of the selected colors
const hasAnyColor = (
  product: ProductWithVariations,
  colors: string[],
): boolean => {
  if (!colors || colors.length === 0) return true;

  return (
    product.variations?.some((variation) =>
      colors.some(
        (color) => variation.color.toLowerCase() === color.toLowerCase(),
      ),
    ) || false
  );
};

// Updated to check if product has ANY of the selected sizes
const hasAnySize = (
  product: ProductWithVariations,
  sizes: string[],
): boolean => {
  if (!sizes || sizes.length === 0) return true;

  return (
    product.variations?.some((variation) =>
      sizes.some((size) => variation.size.toLowerCase() === size.toLowerCase()),
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
        colorFilters: [], // Array of colors
        sizeFilters: [], // Changed from null to empty array

        availableColors: [],
        availableSizes: [], // Added to track available sizes

        priceRanges: [
          { min: 0, max: 500, label: "Under R500" },
          { min: 500, max: 1000, label: "R500 - R1000" },
          { min: 1000, max: 2000, label: "R1000 - R2000" },
          { min: 2000, max: null, label: "R2000 & Above" },
        ],

        // Actions
        fetchProducts: async () => {
          set({ isLoading: true, error: null });

          try {
            const result: ProductActionResult = await getAllProducts();

            if (!result.success || !result.products) {
              throw new Error(result.error || "Failed to fetch products");
            }

            // Extract all unique colors and sizes from variations
            const allColors = new Set<string>();
            const allSizes = new Set<string>();

            result.products.forEach((product) => {
              product.variations?.forEach((variation) => {
                if (variation.color) {
                  allColors.add(variation.color.toLowerCase());
                }
                if (variation.size) {
                  allSizes.add(variation.size);
                }
              });
            });

            set({
              allProducts: result.products,
              isLoading: false,
              availableColors: Array.from(allColors),
              availableSizes: Array.from(allSizes),
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
        setColorFilters: (colors) => set({ colorFilters: colors }),
        toggleColorFilter: (color) => {
          const { colorFilters } = get();
          const lowerCaseColor = color.toLowerCase();

          if (colorFilters.includes(lowerCaseColor)) {
            // Remove color if it's already in the filters
            set({
              colorFilters: colorFilters.filter((c) => c !== lowerCaseColor),
            });
          } else {
            // Add color to the filters
            set({
              colorFilters: [...colorFilters, lowerCaseColor],
            });
          }
        },
        setSizeFilters: (sizes) => set({ sizeFilters: sizes }),
        toggleSizeFilter: (size) => {
          const { sizeFilters } = get();
          const normalizedSize = size; // Keep original case for sizes as they might be case-sensitive (S, M, L)

          if (sizeFilters.includes(normalizedSize)) {
            // Remove size if it's already in the filters
            set({
              sizeFilters: sizeFilters.filter((s) => s !== normalizedSize),
            });
          } else {
            // Add size to the filters
            set({
              sizeFilters: [...sizeFilters, normalizedSize],
            });
          }
        },

        // Getters for filtered products
        getFilteredProducts: (pathname?: string) => {
          const {
            allProducts,
            categoryFilter,
            priceRangeFilter,
            stockStatusFilter,
            colorFilters,
            sizeFilters,
          } = get();

          // Determine active category based on pathname if provided
          let activeCategoryFilter = categoryFilter;

          if (pathname) {
            // Extract category from pathname
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
              hasAnyColor(product, colorFilters) &&
              hasAnySize(product, sizeFilters),
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
          colorFilters: state.colorFilters,
          sizeFilters: state.sizeFilters, // Updated from sizeFilter to sizeFilters
        }),
      },
    ),
  ),
);
