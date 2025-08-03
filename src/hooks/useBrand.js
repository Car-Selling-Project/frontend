import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance"

const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get("/brands");
        setBrands(res.data);
      } catch (err) {
        setError(err.message || "Error fetching brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
};

export default useBrands;