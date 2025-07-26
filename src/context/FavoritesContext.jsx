import React, { createContext, useState } from "react";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (car) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === car.id)
        ? prevFavorites.filter((fav) => fav.id !== car.id)
        : [...prevFavorites, car]
    );
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};