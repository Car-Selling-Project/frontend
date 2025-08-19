import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import CarTypeFilter from "./filters/CarTypeFilter.jsx";
import PriceRangeFilter from "./filters/PriceRangeFilter";
import FuelTypeFilter from "./filters/FuelTypeFilter";
import TransmissionFilter from "./filters/TransmissionFilter";
import SeatFilter from "./filters/SeatFilter";
import RegistrationYearFilter from "./filters/RegistrationYearFilter";
import StockFilter from "./filters/StockFilter";
import RatingFilter from "./filters/RatingFilter.jsx";
import ModelFilter from "../components/filters/ModelFilter";
import BrandFilter from "../components/filters/BrandFilter";
import LocationFilter from "../components/filters/LocationFilter";
import ExteriorColorFilter from "./filters/ExteriorColorFilter.jsx";
import useCarData from "../hooks/useCarData.js";

const SidebarFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cars, loading } = useCarData();

  // --- Local states for smooth UI ---
  const [selectedType, setSelectedType] = useState(searchParams.get("carTypes") || "");
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 300000);
  const [fuelType, setFuelType] = useState(searchParams.get("fuelTypes") || "");
  const [tranmissions, setTranmissions] = useState(searchParams.get("tranmissions") || ""); 
  const [selectedSeat, setSelectedSeat] = useState(searchParams.get("seat") ? searchParams.get("seat").split(",").map(Number) : []); 
  const [registrationYear, setRegistrationYear] = useState(
    searchParams.get("minRegistrationYear") && searchParams.get("maxRegistrationYear")
      ? [Number(searchParams.get("minRegistrationYear")), Number(searchParams.get("maxRegistrationYear"))]
      : [1986, new Date().getFullYear()]
  );
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStockOnly") === "true");
  const [minRating, setMinRating] = useState(Number(searchParams.get("minRating")) || 0);
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [brandId, setBrandId] = useState(searchParams.get("brandIds") || "");
  const [locationId, setLocationId] = useState(searchParams.get("locationIds") || "");
  const [selectedColor, setSelectedColor] = useState(searchParams.getAll("exteriorColors") || []);

  // --- Debounced URL update function ---
  const updateURL = useDebouncedCallback(
    (filters) => {
      const params = new URLSearchParams();
      if (filters.selectedType) params.set("carTypes", filters.selectedType);
      if (filters.minPrice != null) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice != null) params.set("maxPrice", filters.maxPrice);
      if (filters.fuelType) params.set("fuelTypes", filters.fuelType);
      if (filters.tranmissions) params.set("tranmissions", filters.tranmissions);
      if (filters.selectedSeat && filters.selectedSeat.length > 0) params.set("seat", filters.selectedSeat.join(",")); // Gửi mảng dưới dạng chuỗi
      if (filters.registrationYear) {
        params.set("minRegistrationYear", filters.registrationYear[0]);
        params.set("maxRegistrationYear", filters.registrationYear[1]);
      }
      if (filters.inStockOnly) params.set("inStockOnly", filters.inStockOnly);
      if (filters.minRating) params.set("minRating", filters.minRating);
      if (filters.model) params.set("model", filters.model);
      if (filters.brandId) params.set("brandIds", filters.brandId);
      if (filters.locationId) params.set("locationIds", filters.locationId);
      if (filters.selectedColor && filters.selectedColor.length > 0) {
        params.set("exteriorColors", filters.selectedColor.join(","));
      }

      setSearchParams(params);
    },
    300 // debounce 300ms
  );

  // --- Sync URL whenever local state changes ---
  useEffect(() => {
    updateURL({
      selectedType,
      minPrice,
      maxPrice,
      fuelType,
      tranmissions,
      selectedSeat,
      registrationYear,
      inStockOnly,
      minRating,
      model,
      brandId,
      locationId,
      selectedColor,
    });
  }, [
    selectedType,
    minPrice,
    maxPrice,
    fuelType,
    tranmissions,
    selectedSeat,
    registrationYear,
    inStockOnly,
    minRating,
    model,
    brandId,
    locationId,
    selectedColor,
    updateURL,
  ]);

  // --- Filter block wrapper ---
  const FilterBlock = ({ title, children }) => (
    <div className="mb-5">
      {title && <h3 className="text-base font-semibold mb-2 text-gray-700 dark:text-white capitalized tracking-wide">{title}</h3>}
      {children}
    </div>
  );

  if (loading) return <div>Loading filters...</div>;

  return (
    <aside className="w-64 p-5 rounded-xl bg-white shadow-md dark:bg-gray-800 overflow-y-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>

      <FilterBlock title="Car Type">
        <CarTypeFilter cars={cars} carType={selectedType} setCarType={setSelectedType} />
      </FilterBlock>

      <FilterBlock title="Model">
        <ModelFilter cars={cars} model={model} setModel={setModel} />
      </FilterBlock>

      <FilterBlock title="Brand">
        <BrandFilter cars={cars} brandId={brandId} setBrandId={setBrandId} />
      </FilterBlock>

      <FilterBlock title="Location">
        <LocationFilter cars={cars} locationId={locationId} setLocationId={setLocationId} />
      </FilterBlock>

      <FilterBlock title="">
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </FilterBlock>

      <FilterBlock title="Exterior Color">
        <ExteriorColorFilter cars={cars} color={selectedColor} setColor={setSelectedColor} />
      </FilterBlock>

      <FilterBlock title="Fuel Type">
        <FuelTypeFilter cars={cars} fuelType={fuelType} setFuelType={setFuelType} />
      </FilterBlock>

      <FilterBlock title="Transmission">
        <TransmissionFilter cars={cars} tranmissions={tranmissions} setTranmissions={setTranmissions} /> 
      </FilterBlock>

      <FilterBlock title="Seat">
        <SeatFilter selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} /> 
      </FilterBlock>

      <FilterBlock title="Registration Year">
        <RegistrationYearFilter registrationYear={registrationYear} setRegistrationYear={setRegistrationYear} /> 
      </FilterBlock>

      <FilterBlock title="Availability">
        <StockFilter inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} />
      </FilterBlock>

      <FilterBlock title="Rating">
        <RatingFilter minRating={minRating} setMinRating={setMinRating} />
      </FilterBlock>
    </aside>
  );
};

export default SidebarFilter;