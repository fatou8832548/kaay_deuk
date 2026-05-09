/**
 * Service API pour l'authentification
 */

import { API_CONFIG } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = API_CONFIG.API_ENDPOINT;

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>} - Utilisateur créé
 */
export const register = async (userData) => {
  try {
    const url = `${API_BASE_URL}/auth/register`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();

    // Stocker le token JWT avec gestion d'erreur
    if (data.access_token) {
      try {
        await AsyncStorage.setItem('authToken', data.access_token);
      } catch (storageError) {
        console.warn('Erreur lors du stockage du token:', storageError);
      }
    }

    // Stocker les informations utilisateur
    if (data.utilisateur) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(data.utilisateur));
      } catch (storageError) {
        console.warn('Erreur lors du stockage de l\'utilisateur:', storageError);
      }
    }

    return data;
  } catch (error) {
    console.error('Erreur register:', error);
    throw error;
  }
};

/**
 * Connexion d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} motDePasse - Mot de passe
 * @returns {Promise<Object>} - Token et informations utilisateur
 */
export const login = async (email, motDePasse) => {
  try {
    const url = `${API_BASE_URL}/auth/login`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, motDePasse }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la connexion');
    }

    const data = await response.json();

    // Stocker le token JWT avec gestion d'erreur
    if (data.access_token) {
      try {
        await AsyncStorage.setItem('authToken', data.access_token);
      } catch (storageError) {
        console.warn('Erreur lors du stockage du token:', storageError);
      }
    }

    // Stocker les informations utilisateur
    if (data.utilisateur) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(data.utilisateur));
      } catch (storageError) {
        console.warn('Erreur lors du stockage de l\'utilisateur:', storageError);
      }
    }

    return data;
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
};

/**
 * Déconnexion de l'utilisateur
 */
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.warn('Erreur logout:', error);
    // Ne pas lever l'erreur, la déconnexion devrait réussir même si AsyncStorage échoue
  }
};

/**
 * Récupère l'utilisateur connecté depuis le stockage
 */
export const getCurrentUser = async () => {
  try {
    // Ajouter un délai pour s'assurer qu'AsyncStorage est prêt
    if (!AsyncStorage._primed) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    if (error.message && error.message.includes('Native module is null')) {
      console.warn('AsyncStorage pas encore initialisé, tentative de récupération retardée');
      // Attendre un peu et réessayer
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      } catch (retryError) {
        console.error('Erreur lors de la tentative de récupération de l\'utilisateur:', retryError);
        return null;
      }
    }
    console.error('Erreur getCurrentUser:', error);
    return null;
  }
};

/**
 * Récupère le token JWT
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.warn('Erreur getAuthToken:', error);
    return null;
  }
};
