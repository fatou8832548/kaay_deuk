/**
 * API Interceptor - Gère les erreurs JWT et les erreurs d'authentification globalement
 * Ce service wraps toutes les requêtes API pour intercepter les 401 et gérer les tokens expirés
 */

import * as SecureStore from 'expo-secure-store';

// Callback pour gérer la déconnexion (sera défini lors de l'initialisation)
let onUnauthorizedCallback = null;

/**
 * Initialiser le callback pour gérer l'authentification échouée
 * @param {Function} callback - Fonction à appeler quand l'utilisateur doit être déconnecté
 */
export const initializeApiInterceptor = (callback) => {
  onUnauthorizedCallback = callback;
};

/**
 * Wrapper pour les requêtes API avec gestion des erreurs JWT
 * @param {string} url - URL de la requête
 * @param {Object} options - Options fetch (method, headers, body, etc.)
 * @returns {Promise<Response>} - Réponse de la requête
 */
export const fetchWithInterceptor = async (url, options = {}) => {
  try {
    // Récupérer le token
    const token = await SecureStore.getItemAsync('authToken');

    // Ajouter le token aux headers si disponible et pas déjà présent
    if (token && options.headers && !options.headers['Authorization']) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Faire la requête
    const response = await fetch(url, options);

    // Vérifier si c'est une erreur 401 (Unauthorized)
    if (response.status === 401) {
      console.error('Erreur 401 Unauthorized - Token JWT invalide ou expiré');

      // Créer une erreur personnalisée
      const error = new Error('Token JWT invalide ou expiré');
      error.isAuthError = true;
      error.statusCode = 401;

      // Appeler le callback de déconnexion si configuré
      if (onUnauthorizedCallback) {
        try {
          await onUnauthorizedCallback();
        } catch (callbackError) {
          console.error('Erreur dans le callback d\'authentification:', callbackError);
        }
      }

      throw error;
    }

    return response;
  } catch (error) {
    // Re-throw l'erreur
    throw error;
  }
};

/**
 * Valider le token en faisant une requête authentifiée simple
 * @param {string} apiEndpoint - URL de base de l'API
 * @returns {Promise<boolean>} - true si le token est valide, false sinon
 */
export const validateToken = async (apiEndpoint) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (!token) {
      console.log('Aucun token trouvé');
      return false;
    }

    // Faire une requête simple pour vérifier le token
    // On utilise le endpoint de profil utilisateur qui devrait être protégé
    const response = await fetch(`${apiEndpoint}/utilisateurs/profil`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      console.log('Token invalide ou expiré');
      return false;
    }

    if (response.ok) {
      console.log('Token valide');
      return true;
    }

    // Autres erreurs (500, etc.)
    console.warn('Erreur lors de la validation du token:', response.status);
    return false;
  } catch (error) {
    console.error('Erreur validation token:', error);
    return false;
  }
};

/**
 * Supprimer le token et les données utilisateur (déconnexion)
 */
export const clearAuthData = async () => {
  try {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
    console.log('Données d\'authentification supprimées');
  } catch (error) {
    console.error('Erreur suppression données auth:', error);
  }
};
