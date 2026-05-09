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

    // Stocker le token JWT
    if (data.access_token) {
      await AsyncStorage.setItem('authToken', data.access_token);
    }

    // Stocker les informations utilisateur
    if (data.utilisateur) {
      await AsyncStorage.setItem('user', JSON.stringify(data.utilisateur));
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
    console.error('Erreur logout:', error);
    throw error;
  }
};

/**
 * Récupère l'utilisateur connecté depuis le stockage
 */
export const getCurrentUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
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
    console.error('Erreur getAuthToken:', error);
    return null;
  }
};
