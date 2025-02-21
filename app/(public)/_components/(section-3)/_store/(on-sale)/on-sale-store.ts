// stores/useOnSaleStore.ts
import { create } from "zustand";
import {
  createOnSale,
  getOnSaleItemById,
  getOnSaleItems,
} from "../../_actions/(on-sale-actions)/on-sale-actions";

interface OnSaleItem {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  imageUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    displayName: string;
  };
}

interface OnSaleState {
  // State
  onSaleItems: OnSaleItem[];
  isLoading: boolean;
  error: string | null;
  selectedOnSaleItem: OnSaleItem | null;

  // Actions
  fetchOnSaleItems: () => Promise<void>;
  fetchOnSaleItemById: (id: string) => Promise<void>;
  createOnSaleItem: (formData: FormData) => Promise<void>;
  setSelectedOnSaleItem: (item: OnSaleItem | null) => void;
  clearError: () => void;
}

const useOnSaleStore = create<OnSaleState>((set, get) => ({
  // Initial state
  onSaleItems: [],
  isLoading: false,
  error: null,
  selectedOnSaleItem: null,

  // Fetch all on sale items
  fetchOnSaleItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getOnSaleItems();
      if (response.success) {
        set({ onSaleItems: response.data });
      } else {
        set({ error: response.error || "Failed to fetch on sale items" });
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

  // Fetch single on sale item by ID
  fetchOnSaleItemById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getOnSaleItemById(id);
      if (response.success) {
        set({ selectedOnSaleItem: response.data });
      } else {
        set({ error: response.error || "Failed to fetch on sale item" });
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

  // Create on sale item
  createOnSaleItem: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createOnSale(formData);
      if (response.success) {
        // Update the onSaleItems list with the new item
        const currentOnSaleItems = get().onSaleItems;
        set({
          onSaleItems: [...currentOnSaleItems, response.data],
          selectedOnSaleItem: response.data,
        });
      } else {
        set({ error: response.error || "Failed to create on sale item" });
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

  // Set selected on sale item
  setSelectedOnSaleItem: (item: OnSaleItem | null) => {
    set({ selectedOnSaleItem: item });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useOnSaleStore;
