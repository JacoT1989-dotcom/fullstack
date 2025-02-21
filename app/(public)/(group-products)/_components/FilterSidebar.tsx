"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";

interface SelectedFilters {
  [key: string]: string[];
}

const FilterSidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    "Stock Level": [],
    Color: [],
    "Price Range": [],
    Material: [],
    Gender: [],
  });

  const filters = {
    "Stock Level": ["In Stock", "Out of Stock", "Low Stock"],
    Color: ["Black", "White", "Red", "Blue", "Green"],
    "Price Range": ["Under $50", "$50-$100", "$100-$200", "Over $200"],
    Material: ["Cotton", "Polyester", "Wool", "Leather", "Denim"],
    Gender: ["Men", "Women", "Unisex"],
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter(
          (item) => item !== value,
        );
      } else {
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      "Stock Level": [],
      Color: [],
      "Price Range": [],
      Material: [],
      Gender: [],
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (filters) => filters.length > 0,
  );

  const FilterSection = ({
    title,
    options,
  }: {
    title: string;
    options: string[];
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleDropdown(title)}
        className="flex justify-between items-center w-full py-3 px-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {openDropdown === title ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {openDropdown === title && (
        <div className="px-4 pb-3 space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters[title].includes(option)}
                onChange={() => handleFilterChange(title, option)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const SidebarContent = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-black hover:text-white bg-red-500 p-3 rounded-md"
            >
              Clear all
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([category, values]) =>
              values.map((value) => (
                <span
                  key={`${category}-${value}`}
                  className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700"
                >
                  {value}
                  <button
                    onClick={() => handleFilterChange(category, value)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )),
            )}
          </div>
        )}
      </div>
      <div className="divide-y divide-gray-200">
        {Object.entries(filters).map(([title, options]) => (
          <FilterSection key={title} title={title} options={options} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-black text-white rounded-full p-4 shadow-lg z-50 flex items-center justify-center"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-6 w-6" />
      </button>

      {/* Mobile Slide-over */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
