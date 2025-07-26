import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCarData from "../../hooks/useCarData";
import { Button } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import CarCard from "../../components/CarCard";

// StarRating component
export const StarRating = ({ rating }) => {
  const maxStars = 5;
  return (
    <div className="flex items-center mt-4">
      {[...Array(maxStars)].map((_, index) =>
        index < rating ? (
          <StarFilled key={index} className="!text-yellow-500 text-2xl" />
        ) : (
          <StarOutlined key={index} className="!text-gray-400 text-2xl" />
        )
      )}
    </div>
  );
};

const Details = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { cars, loading } = useCarData();

  const car = cars.find((c) => c._id === id);

  const defaultImages = ["/View.png", "/View 2.jpg", "/View 3.jpg"];
  const images = car ? [...defaultImages, car.image] : [];

  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [car]);

  if (loading) {
    return <div className="text-center dark:text-white py-10">Loading car details...</div>;
  }

  if (!car) {
    return <div className="text-center text-red-600 dark:text-red-400 py-10">Car not found.</div>;
  }

  return (
    <main className="max-w-6xl mx-auto py-8 flex flex-col dark:text-white">
      {/* Car Info */}
      <div className="flex flex-col lg:flex-row justify-center gap-8">
        {/* Image Slideshow */}
        <section className="mt-6 w-full lg:w-1/2">
          <img src={mainImage} alt={car.name} className="w-full h-100 object-cover rounded-lg shadow-md bg-primary" />
          <div className="flex gap-4 mt-4 justify-between">
            {images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Preview ${index}`} 
                className={`w-32 h-20 rounded-md cursor-pointer object-cover ${
                  selectedImage === index ? "border-4 border-blue-500 scale-105" : ""
                }`}
                onClick={() => {
                  setMainImage(img);
                  setSelectedImage(index);
                }}
              />
            ))}
          </div>
        </section>

        {/* Car Information */}
        <section className="mt-6 w-full lg:w-1/2 bg-white rounded-lg p-6 dark:bg-gray-800">
          <h1 className="text-3xl font-bold">{car.name}</h1>
          <StarRating rating={car.rating} />

          <section className="flex flex-col gap-4 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Car Information</h3>
              <p className="text-gray-500 my-4 dark:text-gray-200">{car.description}</p>
              <ul className="grid grid-cols-2 space-y-2">
                <li><strong>Type:</strong> {car.type}</li>
                <li><strong>Steering:</strong> {car.steering}</li>
                <li><strong>Capacity:</strong> {car.capacity} Person</li>
                <li><strong>Gasoline:</strong> {car.gasoline}</li>
              </ul>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 line-through">
                ${car.price.original} / day
              </h3>
              <h2 className="text-3xl font-bold text-blue-600 dark:text-white">
                ${car.price.discounted} / day
              </h2>
              <Button
                type="primary"
                size="large"
                className="mt-4"
                onClick={() => navigate(`/checkout?carId=${car._id}`)}
              >
                Rent Now
              </Button>
            </div>
          </section>
        </section>
      </div>

      {/* Static Reviews */}
      <section className="mt-12 bg-white rounded-lg p-6 dark:bg-gray-800">
        <div className="flex flex-row gap-4 mb-4 items-center">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <span className="text-lg font-semibold text-white bg-primary w-20 h-10 p-1 text-center rounded-lg">14</span>
        </div>
        <div className="space-y-6">
          {[
            {
              name: "Alex Stanton",
              role: "CEO at Bukalapak",
              date: "21 July 2022",
              image: "/Profill.png",
              review: "We are very happy with the service from MORENT. A great selection of cars at affordable prices!",
            },
            {
              name: "Skylar Dias",
              role: "CEO at Amazon",
              date: "20 July 2022",
              image: "/Profill (1).png",
              review: "Morent provides excellent service with a user-friendly experience. Will rent again!",
            },
          ].map((review, index) => (
            <div key={index} className="p-4 rounded-lg flex flex-row items-start justify-between">
              <div className="flex flex-row gap-4">
                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="text-left">
                  <h3 className="font-bold text-xl">{review.name}</h3>
                  <span className="text-gray-500 text-xs">{review.role}</span>
                  <p className="mt-2">{review.review}</p>
                </div>
              </div>
              <div className="text-gray-500 text-sm text-right">{review.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Cars */}
      <div className="mt-10 flex flex-row items-end justify-between">
        <h1 className="text-2xl font-bold">Recommended Cars</h1>
        <Button className="!text-base" type="link" onClick={() => navigate("/category")}>
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {cars
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6)
          .map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
      </div>
    </main>
  );
};

export default Details;