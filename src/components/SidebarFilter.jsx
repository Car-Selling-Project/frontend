import React, { useState } from "react";
import { Checkbox, Slider } from "antd";

const SidebarFilter = ({ onFilterChange }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 250]);

  const carTypes = ["SUV", "Electric SUV", "Sedan", "Coupe"];
  const capacities = [2, 4, 5, 7, 8];

  // Handle Type filter
  const handleTypeChange = (checkedValues) => {
    setSelectedTypes(checkedValues);
    if (onFilterChange) {
      onFilterChange({
        types: checkedValues,
        capacities: selectedCapacities,
        priceRange,
      });
    }
  };

  // Handle Capacity filter
  const handleCapacityChange = (checkedValues) => {
    setSelectedCapacities(checkedValues);
    if (onFilterChange) {
      onFilterChange({
        types: selectedTypes,
        capacities: checkedValues,
        priceRange,
      });
      console.log("Applied capacities filter:", { types: selectedTypes, capacities: checkedValues, priceRange }); // Debug
    }
  };

  // Handle Price filter
  const handlePriceChange = (value) => {
    setPriceRange(value);
    if (onFilterChange) {
      onFilterChange({
        types: selectedTypes,
        capacities: selectedCapacities,
        priceRange: value,
      });
      console.log("Applied price filter:", { types: selectedTypes, capacities: selectedCapacities, priceRange: value }); // Debug
    }
  };

  const typeOptions = carTypes.map((type) => ({
    label: type,
    value: type,
  }));

  const capacityOptions = capacities.map((capacity) => ({
    label: `${capacity} People`,
    value: capacity,
  }));

  return (
    <aside className="w-64 p-4 rounded-lg bg-white shadow-md dark:bg-gray-700">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Filters</h2>

      {/* Type Filter */}
      <div className="mb-6 dark:text-white">
        <h3 className="text-lg font-semibold mb-2">Type</h3>
        <Checkbox.Group
          options={typeOptions}
          value={selectedTypes}
          onChange={handleTypeChange}
          className="flex flex-col gap-2 dark:text-white"
        />
      </div>

      {/* Capacity Filter */}
      <div className="mb-6 dark:text-white">
        <h3 className="text-lg font-semibold mb-2">Capacity</h3>
        <Checkbox.Group
          options={capacityOptions}
          value={selectedCapacities}
          onChange={handleCapacityChange}
          className="flex flex-col gap-2 dark:text-white"
        />
      </div>

      {/* Price Filter */}
      <div className="mb-6 dark:text-white">
        <h3 className="text-lg font-semibold mb-2">Price Range ($)</h3>
        <Slider
          range
          min={0}
          max={250}
          value={priceRange}
          onChange={handlePriceChange}
          tooltip={{ formatter: (value) => `$${value}` }}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-white">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;