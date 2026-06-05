import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [freeVisitUsed, setFreeVisitUsed] = useState(false);

  // Charger l'état de la visite gratuite au démarrage
  useEffect(() => {
    async function loadFreeVisitStatus() {
      try {
        const used = await AsyncStorage.getItem('freeVisitUsed');
        if (used === 'true') {
          setFreeVisitUsed(true);
        }
      } catch (error) {
        console.error('Erreur chargement statut visite gratuite:', error);
      }
    }
    loadFreeVisitStatus();
  }, []);

  // Fonction pour marquer la visite gratuite comme utilisée
  const markFreeVisitAsUsed = async () => {
    try {
      await AsyncStorage.setItem('freeVisitUsed', 'true');
      setFreeVisitUsed(true);
    } catch (error) {
      console.error('Erreur sauvegarde statut visite gratuite:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, freeVisitUsed, markFreeVisitAsUsed }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
