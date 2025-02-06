"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Slide } from "./types";
import {
  SLIDE_INTERVAL,
  getNextSlideIndex,
  getPrevSlideIndex,
  slideTranslateClasses,
} from "./utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateSlideInput {
  title: string;
  description: string;
  bgColor: string;
  order: number;
}

interface HeroSliderProps {
  slides?: Slide[];
  autoPlay?: boolean;
  interval?: number;
  onAddSlide?: (data: CreateSlideInput) => void;
}

const bgColorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-red-500", label: "Red" },
];

const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = [],
  autoPlay = true,
  interval = SLIDE_INTERVAL,
  onAddSlide,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSlideInput>({
    title: "",
    description: "",
    bgColor: "",
    order: 1,
  });
  const EMPTY_SLOTS = 4;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSlide?.(formData);
    setFormData({ title: "", description: "", bgColor: "", order: 1 });
    setIsModalOpen(false);
  };

  if (slides.length === 0) {
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Slide</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter slide title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter slide description"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <Select
                  value={formData.bgColor}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bgColor: value })
                  }
                  required
                >
                  <SelectTrigger id="bgColor">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {bgColorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Slide</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

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
            className={`flex-shrink-0 w-full h-full ${slide.bgColor} flex flex-col items-center justify-center text-white`}
          >
            <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
            <p className="text-xl">{slide.description}</p>
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
