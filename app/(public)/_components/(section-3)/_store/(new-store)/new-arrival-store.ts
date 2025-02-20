// stores/useNewArrivalsStore.ts
import { create } from "zustand";
import {
  createNewArrival,
  getNewArrivals,
  getNewArrivalById,
} from "../../_actions/(new-arrivals-actions)/upload-get-actions";

interface NewArrival {
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

interface NewArrivalsState {
  // State
  newArrivals: NewArrival[];
  isLoading: boolean;
  error: string | null;
  selectedNewArrival: NewArrival | null;

  // Actions
  fetchNewArrivals: () => Promise<void>;
  fetchNewArrivalById: (id: string) => Promise<void>;
  createNewArrival: (formData: FormData) => Promise<void>;
  setSelectedNewArrival: (newArrival: NewArrival | null) => void;
  clearError: () => void;
}

const useNewArrivalsStore = create<NewArrivalsState>((set, get) => ({
  // Initial state
  newArrivals: [],
  isLoading: false,
  error: null,
  selectedNewArrival: null,

  // Fetch all new arrivals
  fetchNewArrivals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getNewArrivals();
      if (response.success) {
        set({ newArrivals: response.data });
      } else {
        set({ error: response.error || "Failed to fetch new arrivals" });
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

  // Fetch single new arrival by ID
  fetchNewArrivalById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getNewArrivalById(id);
      if (response.success) {
        set({ selectedNewArrival: response.data });
      } else {
        set({ error: response.error || "Failed to fetch new arrival" });
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

  // Create new arrival
  createNewArrival: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createNewArrival(formData);
      if (response.success) {
        // Update the newArrivals list with the new item
        const currentNewArrivals = get().newArrivals;
        set({
          newArrivals: [...currentNewArrivals, response.data],
          selectedNewArrival: response.data,
        });
      } else {
        set({ error: response.error || "Failed to create new arrival" });
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

  // Set selected new arrival
  setSelectedNewArrival: (newArrival: NewArrival | null) => {
    set({ selectedNewArrival: newArrival });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useNewArrivalsStore;
