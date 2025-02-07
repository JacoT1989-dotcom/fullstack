"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash } from "lucide-react";
import type { Slide } from "./types";
import AddSlideModal from "./AddSlideModal";
import EditSlideModal from "./EditSlideModal";
import {
  SLIDE_INTERVAL,
  getNextSlideIndex,
  getPrevSlideIndex,
  slideTranslateClasses,
} from "./utils";
import type { UserRole } from "@prisma/client";
import { getSlides } from "./get-slides-actions";

interface HeroSliderProps {
  autoPlay?: boolean;
  interval?: number;
  onSlidesChange?: () => void;
  userRole?: UserRole;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  autoPlay = true,
  interval = SLIDE_INTERVAL,
  userRole,
}) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const EMPTY_SLOTS = 4;
  const isEditor = userRole === "EDITOR";

  // Compute if slider should be paused (either modal is open)
  const isPaused = isAddModalOpen || isEditModalOpen;

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const response = await getSlides();
    if (response.success && response.data) {
      setSlides(response.data);
    }
  };

  const nextSlide = useCallback(() => {
    const totalSlides = slides.length > 0 ? slides.length : EMPTY_SLOTS;
    setCurrentSlide((current) => getNextSlideIndex(current, totalSlides));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    const totalSlides = slides.length > 0 ? slides.length : EMPTY_SLOTS;
    setCurrentSlide((current) => getPrevSlideIndex(current, totalSlides));
  }, [slides.length]);

  // Only auto-advance if autoPlay is true and not paused
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, nextSlide]);

  const handleSuccess = () => {
    fetchSlides();
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    // Implement delete functionality
    console.log("Delete slide:", currentSlide);
  };

  // Show a minimal placeholder for non-editors when there are no slides
  if (slides.length === 0 && !isEditor) {
    return (
      <div className="relative w-screen h-[300px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No content available</p>
      </div>
    );
  }

  const totalSlotsToShow = isEditor
    ? Math.max(EMPTY_SLOTS, slides.length)
    : slides.length;

  const renderSlideContent = (index: number) => {
    const slide = slides[index];
    if (slide) {
      return (
        <div
          key={slide.id}
          className={`flex-shrink-0 w-full h-full ${slide.bgColor} flex flex-col items-center justify-center text-white relative`}
        >
          {slide.sliderImageurl && (
            <Image
              src={slide.sliderImageurl}
              alt={slide.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
            <p className="text-xl">{slide.description}</p>
          </div>
        </div>
      );
    } else if (isEditor) {
      return (
        <div
          key={`empty-${index}`}
          className="min-w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={handleAddClick}
        >
          <Plus className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-xl text-gray-500">Add Slide {index + 1}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-screen h-[300px] overflow-hidden">
      {isEditor && slides[currentSlide] && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 rounded-lg p-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const emptySlotIndex = slides.length;
                if (emptySlotIndex < EMPTY_SLOTS) {
                  setCurrentSlide(emptySlotIndex);
                }
              }}
              className="hover:text-blue-400 transition-colors"
              aria-label="Go to empty slot"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleEditClick}
              className="hover:text-blue-400 transition-colors"
              aria-label="Edit current slide"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="hover:text-blue-400 transition-colors"
              aria-label="Delete current slide"
            >
              <Trash className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      <AddSlideModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {slides[currentSlide] && (
        <EditSlideModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleSuccess}
          slide={slides[currentSlide]}
        />
      )}

      <div
        className={`flex transition-transform duration-1000 ease-in-out h-full ${
          slideTranslateClasses[currentSlide]
        }`}
      >
        {[...Array(totalSlotsToShow)].map((_, index) =>
          renderSlideContent(index),
        )}
      </div>

      {slides.length > 0 && !isPaused && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {[...Array(totalSlotsToShow)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index
                ? slides[index]
                  ? "bg-white"
                  : "bg-gray-600"
                : slides[index]
                  ? "bg-white/50"
                  : "bg-gray-300"
            }`}
            aria-label={`Go to ${slides[index] ? "slide" : "empty slot"} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
