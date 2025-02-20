// stores/useBestSellerStore.ts

import { create } from "zustand";
import {
  createBestSeller,
  getBestSeller,
  getBestSellerById,
} from "../../_actions/(best-seller-actions.ts)/upload-get-actions";

interface BestSeller {
  id: string;
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    displayName: string;
  };
}

interface BestSellerState {
  // State
  bestSellers: BestSeller[];
  isLoading: boolean;
  error: string | null;
  selectedBestSeller: BestSeller | null;

  // Actions
  fetchBestSellers: () => Promise<void>;
  fetchBestSellerById: (id: string) => Promise<void>;
  createBestSeller: (formData: FormData) => Promise<void>;
  setSelectedBestSeller: (bestSeller: BestSeller | null) => void;
  clearError: () => void;
}

const useBestSellerStore = create<BestSellerState>((set, get) => ({
  // Initial state
  bestSellers: [],
  isLoading: false,
  error: null,
  selectedBestSeller: null,

  // Fetch all best sellers
  fetchBestSellers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getBestSeller();
      if (response.success) {
        set({ bestSellers: response.data });
      } else {
        set({ error: response.error || "Failed to fetch best sellers" });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single best seller by ID
  fetchBestSellerById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getBestSellerById(id);
      if (response.success) {
        set({ selectedBestSeller: response.data });
      } else {
        set({ error: response.error || "Failed to fetch best seller" });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create best seller
  createBestSeller: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createBestSeller(formData);
      if (response.success) {
        // Update the bestSellers list with the new item
        const currentBestSellers = get().bestSellers;
        set({
          bestSellers: [...currentBestSellers, response.data],
          selectedBestSeller: response.data,
        });
      } else {
        set({ error: response.error || "Failed to create best seller" });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Set selected best seller
  setSelectedBestSeller: (bestSeller: BestSeller | null) => {
    set({ selectedBestSeller: bestSeller });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useBestSellerStore;
