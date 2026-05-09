/**
 * Service API pour l'authentification
 */

import { API_CONFIG } from '../config/apiConfig';
import * as SecureStore from 'expo-secure-store';

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

    // Le backend peut retourner {data: {access_token, utilisateur}} ou directement {access_token, utilisateur}
    const actualData = data.data || data;
    const token = actualData.access_token;
    const utilisateur = actualData.utilisateur;

    // Stocker le token JWT avec gestion d'erreur
    if (token) {
      try {
        await SecureStore.setItemAsync('authToken', token);
        console.log('Token stocké avec succès (register)');
      } catch (storageError) {
        console.error('Erreur lors du stockage du token:', storageError);
        throw new Error('Impossible de stocker le token d\'authentification');
      }
    } else {
      throw new Error('Token d\'authentification manquant dans la réponse');
    }

    // Stocker les informations utilisateur
    if (utilisateur) {
      try {
        await SecureStore.setItemAsync('user', JSON.stringify(utilisateur));
        console.log('Utilisateur stocké avec succès (register):', utilisateur.email);
      } catch (storageError) {
        console.error('Erreur lors du stockage de l\'utilisateur:', storageError);
        throw new Error('Impossible de stocker les informations utilisateur');
      }
    } else {
      throw new Error('Informations utilisateur manquantes dans la réponse');
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

    // Le backend peut retourner {data: {access_token, utilisateur}} ou directement {access_token, utilisateur}
    const actualData = data.data || data;
    const token = actualData.access_token;
    const utilisateur = actualData.utilisateur;

    // Stocker le token JWT avec gestion d'erreur
    if (token) {
      try {
        await SecureStore.setItemAsync('authToken', token);
        console.log('Token stocké avec succès (login)');
      } catch (storageError) {
        console.error('Erreur lors du stockage du token:', storageError);
        throw new Error('Impossible de stocker le token d\'authentification');
      }
    } else {
      throw new Error('Token d\'authentification manquant dans la réponse');
    }

    // Stocker les informations utilisateur
    if (utilisateur) {
      try {
        await SecureStore.setItemAsync('user', JSON.stringify(utilisateur));
        console.log('Utilisateur stocké avec succès (login):', utilisateur.email);
      } catch (storageError) {
        console.error('Erreur lors du stockage de l\'utilisateur:', storageError);
        throw new Error('Impossible de stocker les informations utilisateur');
      }
    } else {
      throw new Error('Informations utilisateur manquantes dans la réponse');
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
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
  } catch (error) {
    console.warn('Erreur logout:', error);
    // Ne pas lever l'erreur, la déconnexion devrait réussir même si SecureStore échoue
  }
};

/**
 * Récupère l'utilisateur connecté depuis le stockage
 */
export const getCurrentUser = async () => {
  try {
    const userStr = await SecureStore.getItemAsync('user');
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
    return await SecureStore.getItemAsync('authToken');
  } catch (error) {
    console.warn('Erreur getAuthToken:', error);
    return null;
  }
};
