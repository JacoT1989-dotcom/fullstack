// useProductsByPathname.ts
import { usePathname } from "next/navigation";
import { useProductStore } from "./product-store";
import { ProductWithVariations, Variation } from "../(filterside)/types";
import { useMemo } from "react";

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
  const allProducts = useProductStore((state) => state.allProducts);

  // Get the current active category based on the pathname
  const activeCategory = useMemo(() => {
    if (!pathname) return "all";

    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment) {
      const knownCategories = ["apparel", "headwear", "all-collections"];
      const matchedCategory = knownCategories.find(
        (cat) => lastSegment.toLowerCase() === cat,
      );

      if (matchedCategory) {
        return matchedCategory;
      }
    }
    return "all";
  }, [pathname]);

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

  // Get category-specific products using memoization
  const apparelProducts = useMemo(
    () =>
      allProducts.filter((product) =>
        product.category.some((cat) =>
          ["apparel", "Apparel", "APPAREL"].includes(cat),
        ),
      ),
    [allProducts],
  );

  const headwearProducts = useMemo(
    () =>
      allProducts.filter((product) =>
        product.category.some((cat) =>
          ["headwear", "Headwear", "HEADWEAR"].includes(cat),
        ),
      ),
    [allProducts],
  );

  const allCollectionsProducts = useMemo(
    () =>
      allProducts.filter((product) =>
        product.category.some((cat) =>
          ["all-collections", "All-Collections", "ALL-COLLECTIONS"].includes(
            cat,
          ),
        ),
      ),
    [allProducts],
  );

  // Create map of category-specific products for easy access
  const productsByCategory = useMemo(
    () => ({
      apparel: apparelProducts,
      headwear: headwearProducts,
      "all-collections": allCollectionsProducts,
    }),
    [apparelProducts, headwearProducts, allCollectionsProducts],
  );

  // Get the filters from the store
  const priceRangeFilter = useProductStore((state) => state.priceRangeFilter);
  const stockStatusFilter = useProductStore((state) => state.stockStatusFilter);
  const colorFilter = useProductStore((state) => state.colorFilter);

  // Apply filters based on pathname and store filters
  const products = useMemo(() => {
    // If pathname indicates a specific category, use that
    if (activeCategory !== "all") {
      return allProducts.filter((product: ProductWithVariations) => {
        // Filter by the pathname-derived category
        const matchesCategory = product.category.some(
          (cat) => cat.toLowerCase() === activeCategory.toLowerCase(),
        );

        // Apply other filters from the store
        const matchesPriceRange = priceRangeFilter
          ? product.sellingPrice >= priceRangeFilter.min &&
            (priceRangeFilter.max === null ||
              product.sellingPrice <= priceRangeFilter.max)
          : true;

        const matchesStockStatus =
          stockStatusFilter === "all" ||
          getStockStatus(product) === stockStatusFilter;

        const matchesColor =
          !colorFilter ||
          product.variations?.some(
            (variation: Variation) =>
              variation.color.toLowerCase() === colorFilter?.toLowerCase(),
          );

        return (
          matchesCategory &&
          matchesPriceRange &&
          matchesStockStatus &&
          matchesColor
        );
      });
    } else {
      // For "all" category, apply just the filters
      return allProducts.filter((product: ProductWithVariations) => {
        const matchesPriceRange = priceRangeFilter
          ? product.sellingPrice >= priceRangeFilter.min &&
            (priceRangeFilter.max === null ||
              product.sellingPrice <= priceRangeFilter.max)
          : true;

        const matchesStockStatus =
          stockStatusFilter === "all" ||
          getStockStatus(product) === stockStatusFilter;

        const matchesColor =
          !colorFilter ||
          product.variations?.some(
            (variation: Variation) =>
              variation.color.toLowerCase() === colorFilter?.toLowerCase(),
          );

        return matchesPriceRange && matchesStockStatus && matchesColor;
      });
    }
  }, [
    allProducts,
    activeCategory,
    priceRangeFilter,
    stockStatusFilter,
    colorFilter,
  ]);

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
