// stores/use-slide-store.ts
import { create } from "zustand";
import { Slide, SlideResponse } from "../../types";
import { getSlides } from "../get-slides-actions";
import { createSlide } from "../action";
import { deleteSlide } from "../delete-actions";
import { updateSlide } from "../update-actions";

interface SlideState {
  slides: Slide[];
  isLoading: boolean;
  error: string | null;

  // Fetch slides
  fetchSlides: () => Promise<void>;

  // Create slide
  createSlide: (formData: FormData) => Promise<SlideResponse>;

  // Update slide
  updateSlide: (formData: FormData) => Promise<SlideResponse>;

  // Delete slide
  deleteSlide: (id: string) => Promise<SlideResponse>;

  // Reorder slides
  reorderSlides: (updates: { id: string; newOrder: number }[]) => Promise<void>;

  // Set slides directly (useful for SSR hydration)
  setSlides: (slides: Slide[]) => void;

  // Reset state
  reset: () => void;
}

const initialState = {
  slides: [],
  isLoading: false,
  error: null,
};

export const useSlideStore = create<SlideState>()((set, get) => ({
  ...initialState,

  fetchSlides: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getSlides();
      if (response.success && response.data) {
        set({ slides: response.data });
      } else {
        throw new Error(response.error || "Failed to fetch slides");
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

  createSlide: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createSlide(formData);
      if (response.success && response.data) {
        set((state) => ({
          slides: [...state.slides, response.data!],
        }));
      }
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  updateSlide: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateSlide(formData);
      if (response.success && response.data) {
        set((state) => ({
          slides: state.slides.map((slide) =>
            slide.id === response.data!.id ? response.data! : slide,
          ),
        }));
      }
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSlide: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deleteSlide(id);
      if (response.success) {
        set((state) => ({
          slides: state.slides.filter((slide) => slide.id !== id),
        }));
      }
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  reorderSlides: async (updates: { id: string; newOrder: number }[]) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSlides = [...get().slides];
      updates.forEach(({ id, newOrder }) => {
        const slideIndex = updatedSlides.findIndex((slide) => slide.id === id);
        if (slideIndex !== -1) {
          updatedSlides[slideIndex] = {
            ...updatedSlides[slideIndex],
            order: newOrder,
          };
        }
      });

      // Sort slides by order
      updatedSlides.sort((a, b) => a.order - b.order);
      set({ slides: updatedSlides });
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

  setSlides: (slides: Slide[]) => {
    set({ slides, error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
