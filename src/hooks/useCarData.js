import { useEffect, useState, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api/axiosInstance";

const useCarData = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const viewMode = searchParams.get("viewMode") || "grid";
  const limit = viewMode === "list" ? 5 : 9;
  const page = Number(searchParams.get("page")) || 1;

  const fetchCars = useCallback(async () => {
    try {
      const searchParamsObj = new URLSearchParams(location.search);
      const params = {
        limit,
        page,
      };

      const carTypes = searchParamsObj.get("carTypes");
      if (carTypes) params.carTypes = carTypes;

      if (searchParamsObj.get("minPrice")) params.minPrice = searchParamsObj.get("minPrice");
      if (searchParamsObj.get("maxPrice")) params.maxPrice = searchParamsObj.get("maxPrice");
      if (searchParamsObj.get("fuelTypes")) params.fuelTypes = searchParamsObj.get("fuelTypes");
      if (searchParamsObj.get("tranmissions")) params.tranmissions = searchParamsObj.get("tranmissions"); 
      if (searchParamsObj.get("seat")) params.seat = searchParamsObj.get("seat"); 
      if (searchParamsObj.get("minRegistrationYear") && searchParamsObj.get("maxRegistrationYear")) {
        params.minRegistrationYear = searchParamsObj.get("minRegistrationYear");
        params.maxRegistrationYear = searchParamsObj.get("maxRegistrationYear");
      }
      if (searchParamsObj.get("inStockOnly")) params.inStockOnly = searchParamsObj.get("inStockOnly");
      if (searchParamsObj.get("minRating")) params.minRating = searchParamsObj.get("minRating");
      if (searchParamsObj.get("model")) params.model = searchParamsObj.get("model");
      if (searchParamsObj.get("brandIds")) params.brandIds = searchParamsObj.get("brandIds");
      if (searchParamsObj.get("locationIds")) params.locationIds = searchParamsObj.get("locationIds");
      const exteriorColors = searchParamsObj.get("exteriorColors");
      if (exteriorColors) params.exteriorColors = exteriorColors;

      console.log("Fetch params:", params);
      const response = await api.get("/customers/cars", { params }); 
      console.log("API response:", response.data);
      setCars(response.data.cars || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [location.search, page, limit]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const refetch = useCallback(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, total, page, limit, viewMode, refetch };
};

export default useCarData;