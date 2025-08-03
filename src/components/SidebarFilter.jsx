import React, { useState, useEffect } from "react";
import { Checkbox } from "antd";
import { useSearchParams } from "react-router-dom";

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
import useCarData from "../hooks/useCarData.js";

const SidebarFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { cars } = useCarData();

  const [selectedTypes, setSelectedTypes] = useState(searchParams.getAll("carTypes") || []);
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 3000000);
  const [fuelType, setFuelType] = useState(searchParams.get("fuelType") || "");
  const [transmission, setTransmission] = useState(searchParams.get("tranmission") || "");
  const [seat, setSeat] = useState(searchParams.get("seat") ? Number(searchParams.get("seat")) : null);
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

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedTypes.length) selectedTypes.forEach((type) => params.append("carTypes", type));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (fuelType) params.set("fuelType", fuelType);
    if (transmission) params.set("tranmission", transmission);
    if (seat) params.set("seat", seat);
    if (registrationYear) {
      params.set("minRegistrationYear", registrationYear[0]);
      params.set("maxRegistrationYear", registrationYear[1]);
    }
    if (inStockOnly) params.set("inStockOnly", inStockOnly);
    if (minRating) params.set("minRating", minRating);
    if (model) params.set("model", model);
    if (brandId) params.set("brandIds", brandId);
    if (locationId) params.set("locationIds", locationId);

    setSearchParams(params);
  }, [
    selectedTypes,
    minPrice,
    maxPrice,
    fuelType,
    transmission,
    seat,
    registrationYear,
    inStockOnly,
    minRating,
    model,
    brandId,
    locationId,
  ]);

  const FilterBlock = ({ title, children }) => (
    <div className="mb-5">
      <h3 className="text-base font-semibold mb-2 text-gray-700 dark:text-white capitalized tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <aside className="w-64 p-5 rounded-xl bg-white shadow-md dark:bg-gray-800 overflow-y-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>

      <FilterBlock title="Car Type">
        <CarTypeFilter
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      </FilterBlock>

      <FilterBlock title="Model">
        <ModelFilter
          cars={cars}
          model={model}
          setModel={setModel}
        />
      </FilterBlock>

      <FilterBlock title="Brand">
        <BrandFilter
          cars={cars}
          brandId={brandId}
          setBrandId={setBrandId}
        />
      </FilterBlock>

      <FilterBlock title="Location">
        <LocationFilter
          cars={cars}
          locationId={locationId}
          setLocationId={setLocationId}
        />
      </FilterBlock>

      <FilterBlock title="">
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </FilterBlock>

      <FilterBlock title="Fuel Type">
        <FuelTypeFilter
          fuelType={fuelType}
          setFuelType={setFuelType}
        />
      </FilterBlock>

      <FilterBlock title="Transmission">
        <TransmissionFilter
          transmission={transmission}
          setTransmission={setTransmission}
        />
      </FilterBlock>

      <FilterBlock title="Seat">
        <SeatFilter
          selectedSeat={seat}
          setSelectedSeat={setSeat}
        />
      </FilterBlock>

      <FilterBlock title="Registration Year">
        <RegistrationYearFilter
          registrationYear={registrationYear}
          setRegistrationYear={setRegistrationYear}
        />
      </FilterBlock>

      <FilterBlock title="Availability">
        <StockFilter
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
        />
      </FilterBlock>

      <FilterBlock title="Rating">
        <RatingFilter
          minRating={minRating}
          setMinRating={setMinRating}
        />
      </FilterBlock>
    </aside>
  );
};

export default SidebarFilter;