import React from "react";
import CarCard from "../../components/CarCard";
import HeroSection from "../../components/HeroSection";
import { useNavigate } from "react-router-dom";
import useHomepageCars from "../../hooks/useHomepage";
import FilterBar from "../../components/FilterBar"

const Homepage = () => {
  const navigate = useNavigate();
  const { popularCars, recommendedCars, loading } = useHomepageCars();

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main>
      <HeroSection />
      <div className="p-6">
        <FilterBar />
        {/* Popular Cars */}
        <h1 className="text-2xl font-bold mt-10 mb-10 dark:text-white">Popular Cars</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {popularCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>

        {/* Recommended Cars */}
        <h1 className="text-2xl font-bold mt-10 mb-10 dark:text-white">Recommended Cars</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {recommendedCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
            onClick={() => navigate(`/customers/cars`)}
          >
            Show more cars
          </button>
        </div>
      </div>
    </main>
  );
};

export default Homepage;