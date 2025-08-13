import React, { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import useCarData from "../hooks/useCarData";
import SearchInput from "../components/filters/SearchInput";
import ModelFilter from "../components/filters/ModelFilter";
import BrandFilter from "../components/filters/BrandFilter";
import LocationFilter from "../components/filters/LocationFilter";
import PriceRangeFilter from "../components/filters/PriceRangeFilter";

const FilterBar = () => {
  const navigate = useNavigate();
  const { cars } = useCarData();

  const [model, setModel] = useState("");
  const [brandId, setBrandId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);

  const handleSearchClick = () => {
    const queryParams = new URLSearchParams();

    if (model) queryParams.append("model", model);
    if (brandId) queryParams.append("brandIds", brandId);
    if (locationId) queryParams.append("locationIds", locationId);
    if (minPrice) queryParams.append("minPrice", minPrice);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);

    navigate(`/customers/cars?${queryParams.toString()}`);
  };

  return (
<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-6">
  {/* Column 1: SearchInput + Location (fixed width) */}
  <div className="flex flex-col gap-4 w-full md:w-120">
    <SearchInput />
    <LocationFilter cars={cars} locationId={locationId} setLocationId={setLocationId} />
  </div>

  {/* Column 2: Model + Brand + PriceRange (flex-grow) */}
  <div className="flex-1 flex flex-col gap-4">
    <div className="flex gap-4">
      <ModelFilter cars={cars} model={model} setModel={setModel} />
      <BrandFilter cars={cars} brandId={brandId} setBrandId={setBrandId} />
    </div>
    <PriceRangeFilter
      minPrice={minPrice}
      maxPrice={maxPrice}
      setMinPrice={setMinPrice}
      setMaxPrice={setMaxPrice}
    />
  </div>

  {/* Column 3: Search Button (fit content) */}
  <div className="flex items-end m-4 justify-end w-full md:w-fit">
    <Button
      type="primary"
      className="w-full md:w-32 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      onClick={handleSearchClick}
    >
      Search
    </Button>
  </div>
</div>
);
};

export default FilterBar;