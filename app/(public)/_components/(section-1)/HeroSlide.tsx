"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Slide, CreateSlideInput } from "./types";
import AddSlideModal from "./AddSlideModal";
import {
  SLIDE_INTERVAL,
  getNextSlideIndex,
  getPrevSlideIndex,
  slideTranslateClasses,
} from "./utils";
import type { UserRole } from "@prisma/client";

interface HeroSliderProps {
  slides?: Slide[];
  autoPlay?: boolean;
  interval?: number;
  onAddSlide?: (data: CreateSlideInput) => void;
  userRole?: UserRole;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = [],
  autoPlay = true,
  interval = SLIDE_INTERVAL,
  onAddSlide,
  userRole,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const EMPTY_SLOTS = 4;
  const isEditor = userRole === "EDITOR";

  const nextSlide = () => {
    setCurrentSlide((current) => getNextSlideIndex(current, EMPTY_SLOTS));
  };

  const prevSlide = () => {
    setCurrentSlide((current) => getPrevSlideIndex(current, EMPTY_SLOTS));
  };

  useEffect(() => {
    if (!autoPlay || slides.length > 0 || isModalOpen) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length, isModalOpen]);

  const handleAddSlide = (data: CreateSlideInput) => {
    onAddSlide?.(data);
    setIsModalOpen(false);
  };

  // Show a minimal placeholder for non-editors when there are no slides
  if (slides.length === 0 && !isEditor) {
    return (
      <div className="relative w-screen h-[300px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No content available</p>
      </div>
    );
  }

  // Show empty slots with add buttons only for editors
  if (slides.length === 0 && isEditor) {
    return (
      <div className="relative w-screen h-[300px] overflow-hidden">
        <div className="flex h-full">
          <div
            className={`flex min-w-full transition-transform duration-1000 ease-in-out ${
              slideTranslateClasses[currentSlide]
            }`}
          >
            {[...Array(EMPTY_SLOTS)].map((_, index) => (
              <div
                key={index}
                className="min-w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-xl text-gray-500">Add Slide {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-300/50 p-2 rounded-full hover:bg-gray-300/70 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-300/50 p-2 rounded-full hover:bg-gray-300/70 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {[...Array(EMPTY_SLOTS)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? "bg-gray-600" : "bg-gray-300"
              }`}
              aria-label={`Go to empty slot ${index + 1}`}
            />
          ))}
        </div>

        <AddSlideModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddSlide}
        />
      </div>
    );
  }

  // Regular slider view for when there are slides
  return (
    <div className="relative w-screen h-[300px] overflow-hidden">
      <div
        className={`flex transition-transform duration-1000 ease-in-out h-full ${
          slideTranslateClasses[currentSlide]
        }`}
      >
        {slides.map((slide) => (
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
        ))}
      </div>

      {slides.length > 1 && (
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
