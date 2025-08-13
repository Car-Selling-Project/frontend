import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const useHomepageCars = () => {
  const [popularCars, setPopularCars] = useState([]);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageCars = async () => {
      try {
        const [popularRes, recommendRes] = await Promise.all([
          axios.get("/customers/popularcars"),
          axios.get("/customers/recommendcars"),
        ]);

        setPopularCars(popularRes.data.cars || []);
        setRecommendedCars(recommendRes.data.cars || []);
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