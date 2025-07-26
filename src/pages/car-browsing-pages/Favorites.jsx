import React from "react";
import CarCard from "../../components/CarCard";
import { useFavorites } from "../../hooks/useFavorites";

const Favorite = () => {
  const { favorites } = useFavorites();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Favorite Cars</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite cars added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {favorites.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;