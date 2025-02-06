import { slides } from "./types";

export const SLIDE_INTERVAL = 5000;

export const getNextSlideIndex = (currentIndex: number): number => {
  return (currentIndex + 1) % slides.length;
};

export const getPrevSlideIndex = (currentIndex: number): number => {
  return (currentIndex - 1 + slides.length) % slides.length;
};

export const slideTranslateClasses = [
  "-translate-x-0",
  "-translate-x-full",
  "-translate-x-[200%]",
  "-translate-x-[300%]",
];
