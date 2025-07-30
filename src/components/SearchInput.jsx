import React, { useState, useEffect } from "react";
import { Input } from "antd";
import useCarData from "../hooks/useCarData";
import { useNavigate } from "react-router-dom";

const SearchInput = ({ onSelectCar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const navigate = useNavigate();

  const { cars } = useCarData();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredCars([]);
      return;
    }

    const results = cars.filter((car) =>
      car.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCars(results);
  };

  const handleSelectCar = (car) => {
    setSearchQuery("");
    setFilteredCars([]);
    if (onSelectCar) {
      onSelectCar(car);
    } else {
      navigate(`/car/${car._id}`);
    }
  };

  return (
    <div className="relative w-1/3">
      <Input
        placeholder="Search something here"
        prefix={
          <svg
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
            <path
              d="M22 22L20 20"
              stroke="#596780"
              strokeWidth="1.5"
            />
          </svg>
        }
        className="w-80 h-10 gap-2 !rounded-full shadow-sm"
        onChange={handleSearch}
        value={searchQuery}
      />
      {filteredCars.length > 0 && (
        <ul className="absolute top-full mt-1 w-80 bg-white shadow-lg rounded-md border border-gray-200 z-10">
          {filteredCars.map((car) => (
            <li
              key={car._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectCar(car)}
            >
              {car.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;