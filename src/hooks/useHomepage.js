import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const useHomepageCars = () => {
  const [popularCars, setPopularCars] = useState([]);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageCars = async () => {
      try {
        const res = await axios.get("/customers"); 
        setPopularCars(res.data.popularCars);
        setRecommendedCars(res.data.recommendedCars);
      } catch (err) {
        console.error("❌ Error fetching homepage cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageCars();
  }, []);

  return { popularCars, recommendedCars, loading };
};

export default useHomepageCars;