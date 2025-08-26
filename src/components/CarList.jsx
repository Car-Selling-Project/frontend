// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { HeartFilled, HeartOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
// import { useFavorites } from "../hooks/useFavorites";
// import GasolineIcon from "../assets/icons/gas-station.svg";
// import SteeringIcon from "../assets/icons/Car.svg";
// import CapacityIcon from "../assets/icons/profile-2user.svg";

// const StarRating = ({ rating }) => {
//   const maxStars = 5;
//   return (
//     <div className="flex items-center">
//       {[...Array(maxStars)].map((_, index) =>
//         index < rating ? (
//           <StarFilled key={index} className="!text-yellow-500 text-base" />
//         ) : (
//           <StarOutlined key={index} className="!text-gray-400 text-base" />
//         )
//       )}
//     </div>
//   );
// };

// const CarListItem = ({ car }) => {
//   const navigate = useNavigate();
//   const { favorites, toggleFavorite } = useFavorites();
//   const isFavorite = favorites.some((fav) => fav._id === car._id);

//   const brandName =
//     typeof car.brandId === "string"
//       ? "Loading Brand..."
//       : car.brandId?.name || "Unknown Brand";

//   return (
//     <div className="flex bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 mb-4">
//       {/* Car Image */}
//       <img
//         src={car.images?.[0] || "default-image-url.jpg"}
//         alt={car.title}
//         className="w-48 h-48 object-contain rounded-lg"
//       />

//       {/* Info Section */}
//       <div className="flex-1 ml-4 flex flex-col justify-between">
//         <div>
//           <div className="flex justify-between items-start mb-2">
//             <div>
//               <h2 className="text-xl font-bold dark:text-white">{car.title}</h2>
//               <p className="text-base text-gray-500 dark:text-white">{brandName}</p>
//             </div>
//             <button onClick={() => toggleFavorite(car)}>
//               {isFavorite ? (
//                 <HeartFilled style={{ color: "#ff4d4f", fontSize: 20 }} />
//               ) : (
//                 <HeartOutlined style={{ fontSize: 20 }} />
//               )}
//             </button>
//           </div>
//           <StarRating rating={car.rating || 0} />

//           <p className="text-sm mt-2 text-gray-600 dark:text-white line-clamp-2">
//             {car.description || "No description provided"}
//           </p>
              
//           {/* Specs */}
//           <div className="flex gap-6 mt-3 text-base text-gray-700 dark:text-white">
//             <div className="flex items-center gap-1">
//               <img src={GasolineIcon} alt="Fuel" className="w-5 h-5" />
//               {car.fuelType}
//             </div>
//             <div className="flex items-center gap-1">
//               <img src={SteeringIcon} alt="Transmission" className="w-5 h-5" />
//               {car.tranmission}
//             </div>
//             <div className="flex items-center gap-1">
//               <img src={CapacityIcon} alt="Seats" className="w-5 h-5" />
//               {car.seat} People
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-between items-center mt-4">
//           {/* Price & Rating */}
//           <div>
//             <div className="text-primary text-2xl font-bold dark:text-white">
//               ${car.price.toLocaleString(2)}
//             </div>
//           </div>

//           {/* Action */}
//           <button
//             onClick={() => navigate(`/customers/cars/${car._id}`)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base font-semibold"
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarListItem;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { useFavorites } from "../hooks/useFavorites";
import GasolineIcon from "../assets/icons/gas-station.svg";
import SteeringIcon from "../assets/icons/Car.svg";
import CapacityIcon from "../assets/icons/profile-2user.svg";
import api from "../api/axiosInstance";

const StarRating = ({ carId }) => {
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

const CarListItem = ({ car }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.some((fav) => fav._id === car._id);

  const brandName =
    typeof car.brandId === "string"
      ? "Loading Brand..."
      : car.brandId?.name || "Unknown Brand";
      

  return (
    <div className="flex bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 mb-4">
      {/* Car Image */}
      <img
        src={car.images?.[0] || "default-image-url.jpg"}
        alt={car.title}
        className="w-48 h-48 object-contain rounded-lg"
      />

      {/* Info Section */}
      <div className="flex-1 ml-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-bold dark:text-white">{car.title}</h2>
              <p className="text-base text-gray-500 dark:text-white">{brandName}</p>
            </div>
            <button onClick={() => toggleFavorite(car)}>
              {isFavorite ? (
                <HeartFilled style={{ color: "#ff4d4f", fontSize: 20 }} />
              ) : (
                <HeartOutlined style={{ fontSize: 20 }} />
              )}
            </button>
          </div>
          {/* Show average rating */}
          <StarRating carId={car._id} />
          

          <p className="text-sm mt-2 text-gray-600 dark:text-white line-clamp-2">
            {car.description || "No description provided"}
          </p>
              
          {/* Specs */}
          <div className="flex gap-6 mt-3 text-base text-gray-700 dark:text-white">
            <div className="flex items-center gap-1">
              <img src={GasolineIcon} alt="Fuel" className="w-5 h-5" />
              {car.fuelType}
            </div>
            <div className="flex items-center gap-1">
              <img src={SteeringIcon} alt="Transmission" className="w-5 h-5" />
              {car.tranmission}
            </div>
            <div className="flex items-center gap-1">
              <img src={CapacityIcon} alt="Seats" className="w-5 h-5" />
              {car.seat} People
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Price & Rating */}
          <div>
            <div className="text-primary text-2xl font-bold dark:text-white">
              ${car.price.toLocaleString(2)}
            </div>
          </div>

          {/* Action */}
          <button
            onClick={() => navigate(`/customers/cars/${car._id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base font-semibold"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarListItem;