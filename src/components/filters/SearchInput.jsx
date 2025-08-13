import React, { useState } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import useCarData from "../../hooks/useCarData";

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const navigate = useNavigate();
  const { cars } = useCarData();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    const keyword = value.trim().toLowerCase();
    if (!keyword) {
      setFilteredCars([]);
      return;
    }

    const results = cars.filter((car) =>
      car.title?.toLowerCase().includes(keyword)
    );

    setFilteredCars(results);
  };

  const handleSelectCar = (carId) => {
    setSearchQuery("");
    setFilteredCars([]);
    navigate(`/customers/cars/${carId}`);
  };

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      const matched = cars.find((car) =>
        car.title?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

      if (matched) {
        navigate(`/customers/cars/${matched._id}`);
      } else {
        alert("No matching car found.");
      }
    }
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search car by name"
        value={searchQuery}
        onChange={handleSearch}
        onPressEnter={handleSubmit}
        suffix={
          <svg
            onClick={handleSubmit}
            className="cursor-pointer"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
              stroke="#596780"
              strokeWidth="1.5"
            />
            <path d="M22 22L20 20" stroke="#596780" strokeWidth="1.5" />
          </svg>
        }
        className="w-80 h-10 gap-2 !rounded-full shadow-sm"
      />

      {filteredCars.length > 0 && (
        <ul className="absolute top-full mt-1 w-80 bg-white shadow-lg rounded-md border border-gray-200 z-10 max-h-60 overflow-y-auto">
          {filteredCars.map((car) => (
            <li
              key={car._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectCar(car._id)}
            >
              {car.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;