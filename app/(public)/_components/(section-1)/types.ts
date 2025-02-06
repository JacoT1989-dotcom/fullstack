export interface Slide {
  id: number;
  title: string;
  description: string;
  bgColor: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "Welcome to Our Platform",
    description: "Discover amazing features and possibilities",
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Premium Quality",
    description: "Experience the best in class service",
    bgColor: "bg-purple-500",
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "We're here to help you anytime",
    bgColor: "bg-green-500",
  },
  {
    id: 4,
    title: "Join Today",
    description: "Start your journey with us",
    bgColor: "bg-red-500",
  },
];
