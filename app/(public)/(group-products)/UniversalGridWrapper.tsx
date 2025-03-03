"use client";

import React from "react";
import { Variation } from "@/app/(admin)/admin/(sidebar)/(products)/products/create/types";

// Define the common product structure
export interface ProductBase {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
  variations?: Variation[];
}

// Props for the grid wrapper
interface UniversalGridWrapperProps {
  products: ProductBase[];
  productType: "headwear" | "apparel" | "collection";
  children?: React.ReactNode;
}

// The universal grid wrapper component
const UniversalGridWrapper: React.FC<UniversalGridWrapperProps> = ({
  products,
  productType,
  children,
}) => {
  // Common empty state handling
  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  // If custom children are provided, render them
  if (children) {
    return <div className="grid-container">{children}</div>;
  }

  // Get the route path based on product type
  const getRoutePath = (type: string, productId: string) => {
    switch (type) {
      case "headwear":
        return `/all-in-headwear/${productId}`;
      case "apparel":
        return `/apparel/${productId}`;
      case "collection":
      default:
        return `/all-collections/${productId}`;
    }
  };

  // The wrapper just handles the container, routing logic, and empty state
  // The actual grid display is delegated to the specific grid components
  return (
    <div className="universal-grid-wrapper">
      {/* 
        This component doesn't render the actual grid - it passes data to child components
        that handle the specific rendering and routing logic based on the productType
      */}
      {children}
    </div>
  );
};

export default UniversalGridWrapper;
