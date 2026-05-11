/**
 * Service API pour la gestion des visites 3D
 */

import { API_CONFIG } from '../config/apiConfig';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = API_CONFIG.API_ENDPOINT;

/**
 * Récupère le token JWT depuis le stockage
 */
const getAuthToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    return token;
  } catch (error) {
    console.error('Erreur récupération token:', error);
    return null;
  }
};

/**
 * Vérifie si un chercheur peut accéder à une visite 3D
 * @param {number} chercheurId - ID du chercheur
 * @returns {Promise<Object>} - Statut d'accès
 */
export const verifierAccesVisite3D = async (chercheurId) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Utilisateur non authentifié');
    }

    const url = `${API_BASE_URL}/visites-3d/verifier-acces/${chercheurId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error((errorData.data?.message) || errorData.message || 'Erreur lors de la vérification d\'accès');
    }

    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.error('Erreur verifierAccesVisite3D:', error);
    throw error;
  }
};

/**
 * Enregistre une nouvelle visite 3D
 * @param {number} chercheurId - ID du chercheur
 * @param {number} logementId - ID du logement
 * @param {number} dureeVisite - Durée de la visite en secondes (optionnel)
 * @returns {Promise<Object>} - Détails de la visite enregistrée
 */
export const enregistrerVisite3D = async (chercheurId, logementId, dureeVisite = 0) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Utilisateur non authentifié');
    }

    const url = `${API_BASE_URL}/visites-3d/enregistrer`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        chercheurId,
        logementId,
        dureeVisite,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error((errorData.data?.message) || errorData.message || 'Erreur lors de l\'enregistrement de la visite');
    }

    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.error('Erreur enregistrerVisite3D:', error);
    throw error;
  }
};

/**
 * Récupère l'historique des visites 3D d'un chercheur
 * @param {number} chercheurId - ID du chercheur
 * @returns {Promise<Object>} - Historique des visites
 */
export const getHistoriqueVisites3D = async (chercheurId) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Utilisateur non authentifié');
    }

    const url = `${API_BASE_URL}/visites-3d/historique/${chercheurId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération de l\'historique');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur getHistoriqueVisites3D:', error);
    throw error;
  }
};
