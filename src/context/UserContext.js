import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [freeVisitUsed, setFreeVisitUsed] = useState(false);
  const [userInteractions, setUserInteractions] = useState(0);
  const [loginSuggestionShown, setLoginSuggestionShown] = useState(false);

  // Charger l'état de la visite gratuite et des interactions au démarrage
  useEffect(() => {
    async function loadUserState() {
      try {
        const [used, interactions, suggestionShown] = await Promise.all([
          AsyncStorage.getItem('freeVisitUsed'),
          AsyncStorage.getItem('userInteractions'),
          AsyncStorage.getItem('loginSuggestionShown'),
        ]);

        if (used === 'true') {
          setFreeVisitUsed(true);
        }

        if (interactions) {
          setUserInteractions(parseInt(interactions, 10) || 0);
        }

        if (suggestionShown === 'true') {
          setLoginSuggestionShown(true);
        }
      } catch (error) {
        console.error('Erreur chargement état utilisateur:', error);
      }
    }
    loadUserState();
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

  // Fonction pour incrémenter les interactions utilisateur
  const incrementInteractions = async () => {
    try {
      const newCount = userInteractions + 1;
      await AsyncStorage.setItem('userInteractions', newCount.toString());
      setUserInteractions(newCount);
      return newCount;
    } catch (error) {
      console.error('Erreur incrémentation interactions:', error);
      return userInteractions;
    }
  };

  // Fonction pour vérifier si on doit afficher la suggestion de connexion
  const shouldShowLoginSuggestion = () => {
    // Afficher la suggestion à partir de la 2ème interaction si l'utilisateur n'est pas connecté
    // et si la suggestion n'a pas déjà été montrée
    return !user && userInteractions >= 2 && !loginSuggestionShown;
  };

  // Fonction pour marquer la suggestion comme affichée
  const markLoginSuggestionShown = async () => {
    try {
      await AsyncStorage.setItem('loginSuggestionShown', 'true');
      setLoginSuggestionShown(true);
    } catch (error) {
      console.error('Erreur sauvegarde statut suggestion:', error);
    }
  };

  // Réinitialiser le tracking quand l'utilisateur se connecte
  useEffect(() => {
    if (user) {
      // Reset les compteurs quand l'utilisateur se connecte
      setUserInteractions(0);
      setLoginSuggestionShown(false);
      AsyncStorage.multiRemove(['userInteractions', 'loginSuggestionShown']);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      freeVisitUsed,
      markFreeVisitAsUsed,
      userInteractions,
      incrementInteractions,
      shouldShowLoginSuggestion,
      markLoginSuggestionShown,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
