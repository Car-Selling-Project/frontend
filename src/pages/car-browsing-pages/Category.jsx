import React from "react";
import useCarData from "../../hooks/useCarData";
import CarCard from "../../components/CarCard";
import { useNavigate } from "react-router-dom";
import SidebarFilter from "../../components/SidebarFilter";
import SearchInput from "../../components/filters/SearchInput";

const Category = () => {
  const { cars, loading } = useCarData();
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    console.log("Search term:", searchTerm);
  };

  const handleViewAll = () => {
    navigate("/customers/cars"); 
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex">
      <SidebarFilter />
      <main className="flex-1 p-6">
        <SearchInput onSearch={handleSearch} />

        <div className="flex justify-between items-center mt-6 mb-4">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Available Cars</h1>
          <button
            onClick={handleViewAll}
            className="text-blue-600 hover:text-blue-400 px-4 py-2 rounded-md text-base underline font-medium"
          >
            View All
          </button>
        </div>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onClick={() => navigate(`/car/${car._id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="dark:text-white">No cars match your filters.</p>
        )}
      </main>
    </div>
  );
};

export default Category;