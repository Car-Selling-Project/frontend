import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import useCarData from "../../../hooks/useCarData";

const StarRating = ({ rating }) => {
  const maxStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, index) =>
        index < rating ? (
          <span key={index} className="text-yellow-400 text-lg">★</span>
        ) : (
          <span key={index} className="text-gray-400 text-lg">☆</span>
        )
      )}
    </div>
  );
};

const CostEstimate = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { cars, loading } = useCarData();

  const [selectedCarId, setSelectedCarId] = useState(id || "");
  const car = cars.find((c) => c._id === selectedCarId);

  const mainImageDefault = car?.images?.[0] || null;
  const [mainImage, setMainImage] = useState(mainImageDefault);

  let estimate = null;
  if (car) {
    const tax = Math.round(car.price * 0.1);
    const registrationFee = 500;
    const insurance = 300;
    const totalCost = car.price + tax + registrationFee + insurance;
    estimate = { basePrice: car.price, tax, registrationFee, insurance, totalCost };
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <main className="w-full mx-auto py-8 flex flex-col dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Car Cost Estimator</h1>

      {/* Chọn xe nếu không truyền id */}
      {!id && (
        <select
          className="border rounded p-2 w-full mb-6 dark:bg-gray-700 dark:text-white"
          onChange={(e) => setSelectedCarId(e.target.value)}
          value={selectedCarId}
        >
          <option value="">Select a car model</option>
          {cars.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} - {c.model}
            </option>
          ))}
        </select>
      )}

      {car && (
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Image + Info */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={car.title}
                className="w-full h-[20rem] object-cover"
              />
            </div>
            <div className="flex gap-2 mt-4">
              {car.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  className={`w-16 h-12 object-cover rounded cursor-pointer ${
                    mainImage === img ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold">{car.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {car.brandId?.name} - {car.model}
              </p>
              <StarRating rating={car.rating} />
              <p className="mt-2">{car.description}</p>
            </div>
          </div>

          {/* Right Column - Cost Breakdown */}
          <div className="lg:w-1/2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h3 className="text-xl font-bold mb-4 dark:text-white">On-road Cost Breakdown</h3>
            <table className="w-full text-left dark:text-white">
              <tbody>
                <tr>
                  <td className="py-2">Base Price</td>
                  <td className="py-2 font-medium">
                    ${estimate.basePrice.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Tax (10%)</td>
                  <td className="py-2">${estimate.tax.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2">Registration Fee</td>
                  <td className="py-2">${estimate.registrationFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2">Insurance</td>
                  <td className="py-2">${estimate.insurance.toLocaleString()}</td>
                </tr>
                <tr className="border-t">
                  <td className="py-3 font-bold">Total On-road Cost</td>
                  <td className="py-3 font-bold text-blue-600">
                    ${estimate.totalCost.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <Button
              type="primary"
              size="large"
              className="mt-6 w-full"
              style={{ backgroundColor: "#3563E9", borderColor: "#3563E9", borderRadius: "12px" }}
              onClick={() => navigate(`/customers/cars/${car._id}`)}
            >
              View Full Details
            </Button>
          </div>
        </section>
      )}
    </main>
  );
};

export default CostEstimate;