import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

export function ReservationProvider({ children }) {
  const [reservations, setReservations] = useState([]);

  const addReservation = (property) => {
    setReservations((prev) => {
      if (prev.find((item) => item.id === property.id)) return prev;
      return [...prev, property];
    });
  };

  const removeReservation = (propertyId) => {
    setReservations((prev) => prev.filter((item) => item.id !== propertyId));
  };

  const hasReservation = (propertyId) => reservations.some((item) => item.id === propertyId);

  return (
    <ReservationContext.Provider value={{ reservations, addReservation, removeReservation, hasReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  return useContext(ReservationContext);
}
