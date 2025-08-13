import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useCarData from "../../hooks/useCarData";
import { Button } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import CarCard from "../../components/CarCard";

// StarRating component
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
  const { cars, error, loading } = useCarData();

  const car = cars.find((c) => c._id === id);
  console.log(car)

  const defaultImages = car?.images || [];
  const images = car ? [...defaultImages, car.image] : [];

  const [mainImage, setMainImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [car, images]);


  if (loading) {
    return <div className="text-center dark:text-white py-10">Loading car details...</div>;
  }

  // if (error) {
  //   return <div className="text-center text-red-600 dark:text-red-400 py-10">Error: {error}</div>;
  // }

  if (!car) {
    return <div className="text-center text-red-600 dark:text-red-400 py-10">Car not found.</div>;
  }
  const brandName = car.brandId?.name || (typeof car.brandId === "string" ? "Loading Brand..." : "Unknown Brand");

  return (
    <main className="w-full mx-auto py-8 flex flex-col dark:text-white">
      {/* Car Info */}
      <div className="flex flex-col justify-center gap-8">
        {/* Left Column - Images, Title, Reviews */}
        <section className="mt-6 w-full flex flex-col">
          <div className="flex flex-row gap-6 mx-5 items-stretch">
            {/* Image Slideshow */}
            <div className="mt-6 w-1/2 mx-5 flex flex-col">
              <div className="flex justify-center items-center rounded-lg overflow-hidden">
                {/* <img src={mockData.image[0]} alt='car1' className="rounded-lg shadow-md bg-primary flex-1" style={{ objectFit: 'cover', height: '25rem', width: '100%' }} /> */}
                <img src={mainImage} alt='car1' className="rounded-lg shadow-md bg-primary flex-1" style={{ objectFit: 'cover', height: '25rem', width: '100%' }} />
              </div>
              <div className="flex gap-4 mt-4 justify-between">
                {car.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Preview ${index}`}
                    className={`w-[2.5rem] h-[2rem] rounded-md cursor-pointer object-cover ${selectedImage === index ? "border-4 border-blue-500 scale-105" : ""
                      }`}
                    onClick={() => {
                      setMainImage(img);
                      setSelectedImage(index);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Title and Price Section */}
            <div className="mt-6 w-1/2 bg-white rounded-lg p-10 dark:bg-gray-800 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-4" style={{ color: '#1A202C' }}>{car.title}</h1>
                <div className="flex flex-row justify-between">
                  <h2 classNAme="text-xl font-semibold mb-4 text-subtitle">{brandName}</h2>
                  <h2 classNAme="text-xl font-semibold mb-4 text-subtitle">{brandName}</h2>
                </div>
                <StarRating rating={car.rating} />
                <p>{car.description}</p>
                <div className="mt-4 flex flex-row items-center justify-between gap-2">
                  <div>
                    <h2 className="text-3xl font-bold text-primary dark:text-white">
                      $ {car.price}
                    </h2>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex mt-6">
                    <Button
                      type="primary"
                      size="large"
                      className="flex-1"
                      style={{ backgroundColor: '#3563E9', borderColor: '#3563E9', borderRadius: '16px', marginRight: '10px' }}
                    >
                      Book Test Drive
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      className="flex-1"
                      style={{ backgroundColor: '#3563E9', borderColor: '#3563E9', borderRadius: '16px', marginLeft: '10px' }}
                    >
                      Cost Estimate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column - Car Details Sidebar */}
        <section className="h-full mt-6 w-full flex flex-row">
          {/* Reviews Section */}
          <div className="bg-white rounded-lg p-6 dark:bg-gray-800 mx-5 w-2/3">
            <div className="flex flex-row gap-4 mb-4 items-center">
              <h2 className="text-2xl font-bold" style={{ color: '#1A202C' }}>Reviews</h2>
              <span className="text-lg font-semibold text-white w-20 h-10 p-1 text-center rounded-lg" style={{ backgroundColor: '#3563E9' }}>14</span>
            </div>
            <div className="">
              {[
                {
                  name: "Alex Stanton",
                  role: "CEO at Bukalapak",
                  date: "21 July 2022",
                  image: "/Profill.png",
                  review: "We are very happy with the service from MORENT. A great selection of car at affordable prices!",
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
                      <h3 className="font-bold text-xl" style={{ color: '#1A202C' }}>{review.name}</h3>
                      <span className="text-xs" style={{ color: '#90A3BF' }}>{review.role}</span>
                      <p className="mt-2" style={{ color: '#1A202C' }}>{review.review}</p>
                    </div>
                  </div>
                  <div className="text-sm text-right" style={{ color: '#90A3BF' }}>{review.date}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Car Details Panel */}
          <div className="dark:bg-slate-800 bg-white text-white rounded-lg p-6 mb-6 mx-5 w-1/3">
            <h2 className="text-xl font-bold mb-6 text-black dark:text-white">Car details</h2>
            <div className="">
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Brand</span>
                <span className="font-medium text-black dark:text-white">{typeof car.brandId === 'object' ? car.brandId?.name : car.brandId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Model</span>
                <span className="font-medium text-black dark:text-white">{typeof car.model === 'object' ? car.model?.name : car.model}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Year</span>
                <span className="font-medium text-black dark:text-white">{car.registrationYear}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Body Type</span>
                <span className="font-medium text-black dark:text-white">{typeof car.carType === 'object' ? car.carType?.name : car.carType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Seats</span>
                <span className="font-medium text-black dark:text-white">{car.seat} People</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Exterior Color</span>
                <span className="font-medium text-black dark:text-white">{typeof car.exteriorColor === 'object' ? car.exteriorColor?.name : car.exteriorColor}</span>
              </div>
            </div>

            <hr className="border-gray-600 my-6" />

            <h3 className="text-lg font-bold mb-4 dark:text-white text-black">Engine</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Fuel Type</span>
                <span className="font-medium text-black dark:text-white">{typeof car.fuelType === 'object' ? car.fuelType?.name : car.fuelType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Consumption</span>
                <span className="font-medium text-black dark:text-white">{car.engine?.fuelconsumsion || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Transmission</span>
                <span className="font-medium text-black dark:text-white">{typeof car.tranmission === 'object' ? car.tranmission?.name : car.tranmission}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Power</span>
                <span className="font-medium text-black dark:text-white">{car.engine?.power || 'N/A'}</span>
              </div>
            </div>

            <hr className="border-gray-600 my-6" />

            <h3 className="text-lg font-bold mb-4 dark:text-white text-black">Dimensions</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Length</span>
                <span className="font-medium text-black dark:text-white">{car.dimension?.length || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Width</span>
                <span className="font-medium text-black dark:text-white">{car.dimension?.width || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#90A3BF' }}>Height</span>
                <span className="font-medium text-black dark:text-white">{car.dimension?.height || 'N/A'}</span>
              </div>
            </div>

            <hr className="border-gray-600 my-6" />

            <div className="mb-4">
              <a href="#" className="font-medium" style={{ color: '#3563E9' }}>Reviews ↗</a>
            </div>

            <div className="flex items-center justify-between mb-6">
              <StarRating rating={car.rating} />
              <span className="text-sm" style={{ color: '#90A3BF' }}>(12 Reviews)</span>
            </div>

            <Link to ='/customers/comparison'>
              <Button
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-500"
                size="large"
              >
                🔄 Compare
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Recommended car */}
      <div className="mt-10 flex flex-row items-end justify-between">
        <h1 className="text-2xl font-bold">Recommended Cars</h1>
        <Button className="!text-base" type="link" onClick={() => navigate("/customers/cars")}>
          View All
        </Button>
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {cars
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6)
            .map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default Details;