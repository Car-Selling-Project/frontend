import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const useCarData = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars"); 
        setCars(response.data);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return { cars, loading };
};

export default useCarData;