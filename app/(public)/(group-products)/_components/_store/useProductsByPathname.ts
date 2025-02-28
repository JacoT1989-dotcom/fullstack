// useProductsByPathname.ts
import { usePathname } from "next/navigation";
import { useProductStore } from "./product-store";
import { ProductWithVariations, Variation } from "../(filterside)/types";

/**
 * Custom hook that combines Zustand store with Next.js pathname
 * to automatically filter products based on the current route
 */
export function useProductsByPathname() {
  const pathname = usePathname();

  // Only get the store values we need
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  // Get category-specific products
  const apparelProducts = useProductStore((state) =>
    state.getApparelProducts(),
  );
  const headwearProducts = useProductStore((state) =>
    state.getHeadwearProducts(),
  );
  const allCollectionsProducts = useProductStore((state) =>
    state.getAllCollectionsProducts(),
  );

  // Get the current active category based on the pathname
  let activeCategory = "all";
  if (pathname) {
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment) {
      const knownCategories = ["apparel", "headwear", "all-collections"];
      const matchedCategory = knownCategories.find(
        (cat) => lastSegment.toLowerCase() === cat,
      );

      if (matchedCategory) {
        activeCategory = matchedCategory;
      }
    }
  }

  // Create map of category-specific products for easy access
  const productsByCategory: Record<string, ProductWithVariations[]> = {
    apparel: apparelProducts,
    headwear: headwearProducts,
    "all-collections": allCollectionsProducts,
  };

  // Helper function to determine stock status with proper typing
  const getStockStatus = (
    product: ProductWithVariations,
  ): "in-stock" | "low-stock" | "out-of-stock" => {
    if (!product.variations || product.variations.length === 0)
      return "out-of-stock";
    const totalQuantity = product.variations.reduce(
      (sum: number, variation: Variation) => sum + variation.quantity,
      0,
    );
    if (totalQuantity <= 0) return "out-of-stock";
    if (totalQuantity < 100) return "low-stock";
    return "in-stock";
  };

  // Apply filters based on pathname and store filters
  const products = useProductStore((state) => {
    // If pathname indicates a specific category, use that instead of the store's categoryFilter
    if (activeCategory !== "all") {
      return state.allProducts.filter((product: ProductWithVariations) => {
        // Filter by the pathname-derived category
        const matchesCategory = product.category.some(
          (cat) => cat.toLowerCase() === activeCategory.toLowerCase(),
        );

        // Apply other filters from the store
        const matchesPriceRange = state.priceRangeFilter
          ? product.sellingPrice >= state.priceRangeFilter.min &&
            (state.priceRangeFilter.max === null ||
              product.sellingPrice <= state.priceRangeFilter.max)
          : true;

        const matchesStockStatus =
          state.stockStatusFilter === "all" ||
          getStockStatus(product) === state.stockStatusFilter;

        const matchesColor =
          !state.colorFilter ||
          product.variations?.some(
            (variation: Variation) =>
              variation.color.toLowerCase() ===
              state.colorFilter?.toLowerCase(),
          );

        return (
          matchesCategory &&
          matchesPriceRange &&
          matchesStockStatus &&
          matchesColor
        );
      });
    } else {
      // Use the store's getFilteredProducts if no specific category in pathname
      return state.getFilteredProducts();
    }
  });

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    apparelProducts,
    headwearProducts,
    allCollectionsProducts,
    productsByCategory,
    activeCategory,
  };
}
