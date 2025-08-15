import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosInstance";

const useCarData = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const params = {};

        const carTypes = searchParams.getAll("carTypes");
        if (carTypes.length) params.carTypes = carTypes;

        if (searchParams.get("minPrice")) params.minPrice = searchParams.get("minPrice");
        if (searchParams.get("maxPrice")) params.maxPrice = searchParams.get("maxPrice");
        if (searchParams.get("fuelType")) params.fuelType = searchParams.get("fuelType");
        if (searchParams.get("tranmission")) params.tranmission = searchParams.get("tranmission");
        if (searchParams.get("seat")) params.seat = searchParams.get("seat");
        if (searchParams.get("minRegistrationYear") && searchParams.get("maxRegistrationYear")) {
          params.minRegistrationYear = searchParams.get("minRegistrationYear");
          params.maxRegistrationYear = searchParams.get("maxRegistrationYear");
        }
        if (searchParams.get("inStockOnly")) params.inStockOnly = searchParams.get("inStockOnly");
        if (searchParams.get("minRating")) params.minRating = searchParams.get("minRating");
        if (searchParams.get("model")) params.model = searchParams.get("model");
        if (searchParams.get("brandIds")) params.brandIds = searchParams.get("brandIds");
        if (searchParams.get("locationIds")) params.locationIds = searchParams.get("locationIds");

        // console.log("Query params sent:", params); // Debug
        const response = await api.get("/admins/cars", { params });
        setCars(response.data.cars || response.data || []);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [location.search]);

  return { cars, loading };
};

export default useCarData;