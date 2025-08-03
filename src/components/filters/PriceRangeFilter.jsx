import React from "react";
import { Slider } from "antd";
import { FaDollarSign } from "react-icons/fa";

const PriceRangeFilter = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
  const handleChange = (value) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <FaDollarSign className="text-gray-500" />
        <span className="font-medium">Price Range</span>
      </div>      
      <Slider
        range
        min={0}
        max={3000000}
        step={50000}
        value={[minPrice, maxPrice]}
        onChange={handleChange}
        tooltip={{ formatter: (value) => `$${value.toLocaleString()}` }}
      />
      <div className="flex justify-between text-xs text-gray-600 dark:text-white mt-1">
        <span>${minPrice.toLocaleString()}</span>
        <span>${maxPrice.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;