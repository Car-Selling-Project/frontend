import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarFilter from "../../components/SidebarFilter";
import CarCard from "../../components/CarCard";
import useCarData from "../../hooks/useCarData";

const Category = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cars, loading } = useCarData();

  const {
    filteredCars: initialFilteredCars = [],
    pickUp = { location: null, date: null },
    dropOff = { location: null, date: null },
  } = location.state || {};

  const [searchResults, setSearchResults] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    if (!loading) {
      const baseCars = initialFilteredCars.length > 0 ? initialFilteredCars : cars;
      console.log("Initial cars:", baseCars);
      setSearchResults(baseCars);
      setFilteredCars(baseCars);
    }
  }, [loading, cars, initialFilteredCars]);

  const handleSearch = (results) => {
    setSearchResults(results);
    setFilteredCars(results);
  };

  const handleFilterChange = ({ types, capacities, priceRange }) => {
    let filtered = [...searchResults];

    if (types.length > 0) {
      filtered = filtered.filter((car) => types.includes(car.type));
    }

    if (capacities.length > 0) {
      filtered = filtered.filter((car) => capacities.includes(car.capacity));
    }

    filtered = filtered.filter(
      (car) =>
        car.price.discounted >= priceRange[0] && car.price.discounted <= priceRange[1]
    );

    setFilteredCars(filtered);
  };

  const handleViewAll = () => {
    console.log("View all cars:", cars);
    setSearchResults(cars);
    setFilteredCars(cars);
  };

  return (
    <div className="flex">
      <SidebarFilter onFilterChange={handleFilterChange} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Available Cars</h1>

        <div className="flex justify-between items-center mt-6 mb-2">
          <h2 className="text-xl font-semibold dark:text-white">Search Results</h2>
          <button
            onClick={handleViewAll}
            className="text-blue-600 hover:text-blue-400 px-4 py-2 rounded-md text-base underline cursor-pointer font-medium"
          >
            View All
          </button>
        </div>
        {loading ? (
          <p className="dark:text-white">Loading cars...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <CarCard
                  key={car._id || car.id}
                  car={car}
                  onClick={() => navigate(`/car/${car._id || car.id}`)}
                />
              ))
            ) : (
              <p className="dark:text-white">No cars match your filters.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Category;