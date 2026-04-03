import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (property) => {
    setFavorites((prev) => {
      if (prev.find((item) => item.id === property.id)) return prev;
      return [...prev, property];
    });
  };

  const removeFavorite = (propertyId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== propertyId));
  };

  const isFavorite = (propertyId) => favorites.some((item) => item.id === propertyId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
