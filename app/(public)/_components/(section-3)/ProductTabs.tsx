"use client";
import React, { useState } from "react";
import { Package, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  rating: number;
}

interface ProductSlideProps {
  products: ProductCardProps[];
  isMobile: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, rating }) => (
  <div className="w-full sm:flex-1 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
    <div className="flex justify-center items-center h-48 bg-secondary rounded-md mb-4">
      <Package className="w-16 h-16 text-muted-foreground" />
    </div>
    <h3 className="text-card-foreground font-medium mb-2 line-clamp-1">
      {name}
    </h3>
    <div className="flex justify-between items-center mb-2">
      <span className="text-lg font-semibold text-primary">${price}</span>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);

const ProductSlide: React.FC<ProductSlideProps> = ({ products, isMobile }) => {
  // Ensure products is defined and handle empty case
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = isMobile ? products.slice(0, 2) : products;

  return (
    <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 px-4">
      {displayProducts.map((product, idx) => (
        <ProductCard key={idx} {...product} />
      ))}
    </div>
  );
};

type TabContent = {
  [key: number]: ProductCardProps[][];
};

const ProductTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tabs = [
    { name: "New Arrivals", id: 0 },
    { name: "Best Seller", id: 1 },
    { name: "On Sale", id: 2 },
  ];

  // Restructured data for mobile view (2 products per slide)
  const mobileTabContent: TabContent = {
    0: [
      // New Arrivals
      [
        { name: "Modern Desk Lamp", price: "49.99", rating: 4 },
        { name: "Wireless Earbuds", price: "129.99", rating: 5 },
      ],
      [
        { name: "Smart Watch Pro", price: "199.99", rating: 4 },
        { name: "Laptop Stand", price: "39.99", rating: 5 },
      ],
      [
        { name: "Bluetooth Speaker", price: "79.99", rating: 4 },
        { name: "Gaming Mouse", price: "59.99", rating: 5 },
      ],
      [
        { name: "Mechanical Keyboard", price: "149.99", rating: 4 },
        { name: "USB-C Hub", price: "45.99", rating: 4 },
      ],
    ],
    1: [
      // Best Seller - similar structure
      [
        { name: "Coffee Maker", price: "89.99", rating: 5 },
        { name: "Air Purifier", price: "159.99", rating: 4 },
      ],
      [
        { name: "Robot Vacuum", price: "299.99", rating: 5 },
        { name: "Blender Pro", price: "79.99", rating: 4 },
      ],
      [
        { name: "Smart Bulb Set", price: "49.99", rating: 4 },
        { name: "Security Camera", price: "129.99", rating: 5 },
      ],
      [
        { name: "Wireless Charger", price: "34.99", rating: 4 },
        { name: "Fitness Tracker", price: "89.99", rating: 5 },
      ],
    ],
    2: [
      // On Sale - similar structure
      [
        { name: "Phone Case", price: "14.99", rating: 4 },
        { name: "Screen Protector", price: "9.99", rating: 4 },
      ],
      [
        { name: "Power Bank", price: "29.99", rating: 5 },
        { name: "Cable Organizer", price: "19.99", rating: 4 },
      ],
      [
        { name: "Desktop Stand", price: "24.99", rating: 4 },
        { name: "Webcam Cover", price: "7.99", rating: 4 },
      ],
      [
        { name: "Mouse Pad XL", price: "19.99", rating: 5 },
        { name: "Desk Mat", price: "15.99", rating: 4 },
      ],
    ],
  };

  const desktopTabContent: TabContent = {
    0: [
      // New Arrivals
      [
        { name: "Modern Desk Lamp", price: "49.99", rating: 4 },
        { name: "Wireless Earbuds", price: "129.99", rating: 5 },
        { name: "Smart Watch Pro", price: "199.99", rating: 4 },
        { name: "Laptop Stand", price: "39.99", rating: 5 },
      ],
      [
        { name: "Bluetooth Speaker", price: "79.99", rating: 4 },
        { name: "Gaming Mouse", price: "59.99", rating: 5 },
        { name: "Mechanical Keyboard", price: "149.99", rating: 4 },
        { name: "USB-C Hub", price: "45.99", rating: 4 },
      ],
    ],
    1: [
      // Best Seller
      [
        { name: "Coffee Maker", price: "89.99", rating: 5 },
        { name: "Air Purifier", price: "159.99", rating: 4 },
        { name: "Robot Vacuum", price: "299.99", rating: 5 },
        { name: "Blender Pro", price: "79.99", rating: 4 },
      ],
      [
        { name: "Smart Bulb Set", price: "49.99", rating: 4 },
        { name: "Security Camera", price: "129.99", rating: 5 },
        { name: "Wireless Charger", price: "34.99", rating: 4 },
        { name: "Fitness Tracker", price: "89.99", rating: 5 },
      ],
    ],
    2: [
      // On Sale
      [
        { name: "Phone Case", price: "14.99", rating: 4 },
        { name: "Screen Protector", price: "9.99", rating: 4 },
        { name: "Power Bank", price: "29.99", rating: 5 },
        { name: "Cable Organizer", price: "19.99", rating: 4 },
      ],
      [
        { name: "Desktop Stand", price: "24.99", rating: 4 },
        { name: "Webcam Cover", price: "7.99", rating: 4 },
        { name: "Mouse Pad XL", price: "19.99", rating: 5 },
        { name: "Desk Mat", price: "15.99", rating: 4 },
      ],
    ],
  };

  // Ensure we have valid content and handle edge cases
  const currentContent = isMobile ? mobileTabContent : desktopTabContent;
  const tabContent = currentContent || desktopTabContent; // Fallback to desktop if mobile content is undefined
  const maxSlides = isMobile ? 4 : 2;

  // Ensure we have valid products for the current tab and slide
  const currentProducts = tabContent[activeTab]?.[activeSlide];
  if (!currentProducts) {
    setActiveSlide(0); // Reset to first slide if current slide is invalid
  }

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % maxSlides);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  return (
    <div className="w-full py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSlide(0);
              }}
              className={`px-4 md:px-8 py-4 font-medium text-base md:text-lg transition-colors relative whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Products Container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="transition-transform duration-300 ease-in-out">
              <ProductSlide
                products={tabContent[activeTab]?.[activeSlide] || []}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-background border border-border rounded-full p-2 shadow-md hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-background border border-border rounded-full p-2 shadow-md hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(maxSlides)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 rounded-full transition-colors
                  ${activeSlide === idx ? "bg-primary" : "bg-secondary"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
