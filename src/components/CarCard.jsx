import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartOutlined, HeartFilled, StarFilled, StarOutlined } from "@ant-design/icons";
import GasolineIcon from "../assets/icons/gas-station.svg";
import SteeringIcon from "../assets/icons/Car.svg";
import CapacityIcon from "../assets/icons/profile-2user.svg";
import { useFavorites } from "../hooks/useFavorites";
import api from "../api/axiosInstance";

export const StarRating = ({ carId }) => {
  const maxStars = 5;
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const res = await api.get(`/customers/reviewss/${carId}`);
        const reviews = res.data.reviews || [];
        if (reviews.length > 0) {
          const avg =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        setAverageRating(0);
      }
    };
    if (carId) fetchAverageRating();
  }, [carId]);

  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, index) =>
        index < Math.round(averageRating) ? (
          <StarFilled key={index} className="!text-yellow-500 text-base" />
        ) : (
          <StarOutlined key={index} className="!text-gray-400 text-base" />
        )
      )}
      <span className="ml-2 text-sm text-gray-500 dark:text-white">
        {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
      </span>
    </div>
  );
};

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((fav) => fav._id === car._id);

  const [fullCar, setFullCar] = useState(car);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (car._id && (typeof car.brandId === "string" || !car.brandId?.name)) {
        setLoading(true);
        try {
          const response = await api.get(`/customers/cars/${car._id}`); 
          setFullCar(response.data.car || response.data); 
          console.log(response.data.car);
        } catch (error) {
          console.error("❌ Failed to fetch car details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCarDetails();
  }, [car._id, car.brandId]);

  const brandName = fullCar.brandId?.name || (typeof fullCar.brandId === "string" ? "Loading Brand..." : "Unknown Brand");

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 max-w-sm h-fit relative">
      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(fullCar)}
        className="absolute top-4 right-4 text-xl text-gray-500 hover:text-red-500 transition"
      >
        {isFavorite ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
      </button>

      {/* Car Info */}
      <h2 className="text-xl mb-1 font-bold dark:text-white">{fullCar.title}</h2>
      <p className="text-base text-gray-500 dark:text-white mb-2">
        {loading ? "Loading Brand..." : brandName}
      </p>
      <StarRating carId={fullCar._id} />

      {/* Car Image */}
      <img
        src={fullCar.images && fullCar.images.length > 0 ? fullCar.images[0] : "default-image-url.jpg"}
        alt={fullCar.title}
        className="w-full h-40 mx-auto object-contain"
      />

      {/* Car Specs */}
      <div className="flex justify-between items-center mt-3 mb-3 text-gray-700 dark:text-white text-base">
        <div className="flex items-center gap-1">
          <img src={GasolineIcon} alt="Fuel" className="w-5 h-5" />
          {fullCar.fuelType || "N/A"}
        </div>
        <div className="flex items-center gap-1">
          <img src={SteeringIcon} alt="Transmission" className="w-5 h-5" />
          {fullCar.tranmission || "N/A"}
        </div>
        <div className="flex items-center gap-1">
          <img src={CapacityIcon} alt="Capacity" className="w-5 h-5" />
          {fullCar.seat ? `${fullCar.seat} People` : "N/A"}
        </div>
      </div>

      {/* Price */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="dark:text-white">
            <span className="text-primary dark:text-white font-bold text-2xl">
              ${fullCar.price.toLocaleString(2) || "0"}
            </span>
          </p>
        </div>
        {/* Buy Now Button */}
        <button
          onClick={() => navigate(`/customers/cars/${fullCar._id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-base font-semibold hover:bg-blue-700 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default CarCard;