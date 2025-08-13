import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get("/customers/favourites", { withCredentials: true });
        setFavorites(res.data.data.map(fav => fav.carId));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (car) => {
    try {
      const isFav = favorites.find(f => f._id === car._id);
      if (isFav) {
        await axios.delete(`/customers/favourites/${car._id}`, { withCredentials: true });
        setFavorites(favorites.filter(f => f._id !== car._id));
      } else {
        await axios.post("/customers/favourites", { carId: car._id }, { withCredentials: true });
        setFavorites([car, ...favorites]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};