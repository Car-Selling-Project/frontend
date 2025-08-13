import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from '../api/axiosInstance';

const useBrandData = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation()

  useEffect(() => {
    const fetchBrandsAndLocations = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const params = {};

        if (searchParams.get('name')) params.name = searchParams.get('name');

        console.log("Query params sent:", params); // Debug
        const res = await api.get("/admins/brands", { params });
        setBrands(res.data.brands || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  return { brands, loading };
};

export default useBrandData;