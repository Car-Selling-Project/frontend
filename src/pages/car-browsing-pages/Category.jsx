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
    <div className="w-full flex">
      <SidebarFilter />
      <main className="w-full flex items-center flex-col p-6">
        <div className="w-full">
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
        </div>

        {cars.length > 0 ? (
          <div className="flex justify-center w-full">
            <div className="w-full grid grid-cols-4 gap-10">
              {cars.map((car) => (
                <CarCard
                  key={car._id}
                  car={car}
                  onClick={() => navigate(`/car/${car._id}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="dark:text-white">No cars match your filters.</p>
        )}
      </main>
    </div>
  );
};

export default Category;