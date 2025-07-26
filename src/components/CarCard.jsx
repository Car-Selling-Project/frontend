import React from "react";
import { useNavigate } from "react-router-dom";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import GasolineIcon from "../assets/icons/gas-station.svg";
import SteeringIcon from "../assets/icons/Car.svg";
import CapacityIcon from "../assets/icons/profile-2user.svg";
import { useFavorites } from "../hooks/useFavorites";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((fav) => fav._id === car._id);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 max-w-xs h-fit relative">
      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(car)}
        className="absolute top-4 right-4 text-xl text-gray-500 hover:text-red-500 transition"
      >
        {isFavorite ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
      </button>

      {/* Car Image */}
      <img src={car.image} alt={car.name} className="w-full h-40 mx-auto object-contain" />

      {/* Car Info */}
      <h2 className="text-lg font-bold mt-3 dark:text-white">{car.name}</h2>
      <p className="text-sm text-gray-500 dark:text-white">{car.type}</p>

      {/* Car Specs */}
      <div className="flex justify-between items-center mt-3 text-gray-700 dark:text-white text-sm">
        <div className="flex items-center gap-1">
          <img src={GasolineIcon} alt="Fuel" className="w-4 h-4" />
          {car.gasoline}
        </div>
        <div className="flex items-center gap-1">
          <img src={SteeringIcon} alt="Transmission" className="w-4 h-4" />
          {car.steering}
        </div>
        <div className="flex items-center gap-1">
          <img src={CapacityIcon} alt="Capacity" className="w-4 h-4" />
          {car.capacity} People
        </div>
      </div>

      {/* Price */}
      <div className="flex justify-between items-center mt-4">
        <div>
            <p className="dark:text-white">
            <span className="text-black dark:text-white font-bold">${car.price.discounted.toFixed(2)}</span> / day
            </p>
            <p className="text-gray-400 line-through">${car.price.original.toFixed(2)}</p>
        </div>
        {/* Rent Now Button */}
        <button
          onClick={() => navigate(`/car/${car._id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default CarCard;