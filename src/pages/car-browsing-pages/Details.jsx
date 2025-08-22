import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import CarCard from "../../components/CarCard";
import api from "../../api/axiosInstance"; 
import useCarData from "../../hooks/useCarData";
import ReviewSection from "../../components/Review"

// StarRating component (unchanged)
export const StarRating = ({ rating }) => {
  const maxStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, index) =>
        index < rating ? (
          <StarFilled key={index} className="!text-yellow-400 text-lg" />
        ) : (
          <StarOutlined key={index} className="!text-gray-400 text-lg" />
        )
      )}
    </div>
  );
};

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars: recommendedCars, loading: recommendedLoading } = useCarData(); // Only for recommended cars

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch car details by ID
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/customers/cars/${id}`);
        setCar(response.data.car || response.data); // Adjust based on your API response structure
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError(err.response?.data?.message || "Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id]);

  // Set main image once car is loaded
  useEffect(() => {
    if (car) {
      const defaultImages = car.images || [];
      const images = [...defaultImages, car.image].filter(Boolean); // Remove undefined/null images
      if (images.length > 0) {
        setMainImage(images[0]);
      }
    }
  }, [car]);

  if (loading) {
    return <div className="text-center dark:text-white py-10">Loading car details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400 py-10">Error: {error}</div>;
  }

  if (!car) {
    return <div className="text-center text-red-600 dark:text-red-400 py-10">Car not found.</div>;
  }

  const brandName = car.brandId?.name || (typeof car.brandId === "string" ? "Loading Brand..." : "Unknown Brand");

  return (
  <main className="w-full mx-auto py-8 flex flex-col gap-12 dark:text-white">
    {/* Car Details Section */}
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-5">
      {/* Left: Images */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-700">
          <img
            src={mainImage || "default-image-url.jpg"}
            alt={car.title}
            className="w-full h-[25rem] object-contain"
          />
        </div>
        <div className="flex gap-3 mt-2 overflow-x-auto">
          {(car.images || []).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Preview ${index}`}
              className={`w-20 h-14 rounded-md cursor-pointer object-cover transition-transform duration-200 ${
                selectedImage === index ? "border-2 border-blue-500 scale-105" : ""
              }`}
              onClick={() => { setMainImage(img); setSelectedImage(index); }}
            />
          ))}
        </div>

        {/* Title & Price */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
          <h2 className="text-xl text-gray-500 dark:text-gray-300 mb-2">{brandName}</h2>
          <StarRating rating={car.rating} />
          <p className="mt-4 text-gray-700 dark:text-gray-200">{car.description}</p>
          <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
            <h2 className="text-3xl font-bold text-primary dark:text-white">
              $ {car.price?.toLocaleString() || "N/A"}
            </h2>
            <div className="flex flex-1 gap-3">
              <Link to="/customers/test-drive" className="flex-1">
                <Button block type="primary" size="large" className="rounded-lg bg-blue-600 border-blue-600">
                  Book Test Drive
                </Button>
              </Link>
              <Button
                block
                type="primary"
                size="large"
                onClick={() => navigate(`/customers/cost-estimate/${car._id}`)}
                className="rounded-lg bg-blue-600 border-blue-600"
              >
                Cost Estimate
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection carId={car._id} />
      </div>

      {/* Right: Car Details Sidebar */}
      <aside className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col justify-between">
        <h2 className="text-xl font-bold mb-4">Car Details</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-200">
          <div className="flex justify-between"><span>Brand</span><span>{brandName}</span></div>
          <div className="flex justify-between"><span>Model</span><span>{car.model?.name || car.model || "N/A"}</span></div>
          <div className="flex justify-between"><span>Year</span><span>{car.registrationYear || "N/A"}</span></div>
          <div className="flex justify-between"><span>Seats</span><span>{car.seat || "N/A"}</span></div>
          <div className="flex justify-between"><span>Body Type</span><span>{car.carType?.name || car.carType || "N/A"}</span></div>
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        <h3 className="font-bold mb-2">Engine</h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-200">
          <div className="flex justify-between"><span>Fuel Type</span><span>{car.fuelType?.name || car.fuelType || "N/A"}</span></div>
          <div className="flex justify-between"><span>Transmission</span><span>{car.tranmission?.name || car.tranmission || "N/A"}</span></div>
          <div className="flex justify-between"><span>Power</span><span>{car.engine?.power || "N/A"}</span></div>
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        <h3 className="font-bold mb-2">Dimensions</h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-200">
          <div className="flex justify-between"><span>Length</span><span>{car.dimension?.length || "N/A"}</span></div>
          <div className="flex justify-between"><span>Width</span><span>{car.dimension?.width || "N/A"}</span></div>
          <div className="flex justify-between"><span>Height</span><span>{car.dimension?.height || "N/A"}</span></div>
        </div>

        <Link to="/customers/comparison" className="mt-6">
          <Button block className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500">
            🔄 Compare
          </Button>
        </Link>
      </aside>
    </section>

    {/* Recommended Cars */}
    <section className="px-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recommended Cars</h2>
        <Button type="link" onClick={() => navigate("/customers/cars")}>View All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedLoading ? (
          <p>Loading recommended cars...</p>
        ) : (
          recommendedCars
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6)
            .map((car) => <CarCard key={car._id} car={car} />)
        )}
      </div>
    </section>
  </main>
  );
};

export default Details;