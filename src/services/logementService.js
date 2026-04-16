/**
 * Service API pour la gestion des logements
 * Ce service gère tous les appels API pour récupérer, filtrer et gérer les logements
 */

import { API_CONFIG } from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.API_ENDPOINT;

/**
 * Récupère la liste des logements avec pagination et filtres optionnels
 * 
 * @param {Object} options - Options de requête
 * @param {number} options.page - Numéro de page (défaut: 1)
 * @param {number} options.limit - Nombre d'éléments par page (défaut: 10)
 * @param {string} options.ville - Filtrer par ville
 * @param {number} options.prixMin - Prix minimum mensuel
 * @param {number} options.prixMax - Prix maximum mensuel
 * @param {boolean} options.disponible - Filtrer par disponibilité
 * @param {number} options.typeLogementId - Filtrer par type de logement
 * @param {string} options.sortBy - Champ de tri (dateCreation, prix, superficie, nombrePieces, titre)
 * @param {string} options.sortOrder - Ordre de tri (asc ou desc)
 * @returns {Promise<Object>} - Réponse contenant les logements et informations de pagination
 */
export const getLogements = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      ville = null,
      prixMin = null,
      prixMax = null,
      disponible = null,
      typeLogementId = null,
      sortBy = 'dateCreation',
      sortOrder = 'desc',
    } = options;

    // Construire les query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (ville) params.append('ville', ville);
    if (prixMin) params.append('prixMin', prixMin);
    if (prixMax) params.append('prixMax', prixMax);
    if (disponible !== null) params.append('disponible', disponible);
    if (typeLogementId) params.append('typeLogementId', typeLogementId);
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);

    const url = `${API_BASE_URL}/logements?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des logements');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur getLogements:', error);
    throw error;
  }
};

/**
 * Récupère un logement spécifique par son ID
 * 
 * @param {number} id - ID du logement
 * @returns {Promise<Object>} - Détails complets du logement
 */
export const getLogementById = async (id) => {
  try {
    const url = `${API_BASE_URL}/logements/${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logement introuvable');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur getLogementById:', error);
    throw error;
  }
};

/**
 * Récupère les logements les plus récents (recommandés)
 * 
 * @param {number} limit - Nombre de logements à retourner (défaut: 10)
 * @returns {Promise<Object>} - Liste des logements recommandés
 */
export const getLogementsRecommandes = async (limit = 10) => {
  return getLogements({
    page: 1,
    limit,
    sortBy: 'dateCreation',
    sortOrder: 'desc',
    disponible: true,
  });
};

/**
 * Recherche des logements par ville
 * 
 * @param {string} ville - Ville de recherche
 * @param {number} limit - Nombre de résultats (défaut: 10)
 * @returns {Promise<Object>} - Logements trouvés
 */
export const searchLogementsByVille = async (ville, limit = 10) => {
  return getLogements({
    page: 1,
    limit,
    ville,
    disponible: true,
  });
};

/**
 * Filtre les logements par gamme de prix
 * 
 * @param {number} prixMin - Prix minimum
 * @param {number} prixMax - Prix maximum
 * @param {number} limit - Nombre de résultats (défaut: 10)
 * @returns {Promise<Object>} - Logements correspondant à la gamme de prix
 */
export const filterLogementsByPrice = async (prixMin, prixMax, limit = 10) => {
  return getLogements({
    page: 1,
    limit,
    prixMin,
    prixMax,
    disponible: true,
  });
};

/**
 * Filtre les logements par type
 * 
 * @param {number} typeLogementId - ID du type de logement
 * @param {number} limit - Nombre de résultats (défaut: 10)
 * @returns {Promise<Object>} - Logements du type spécifié
 */
export const filterLogementsByType = async (typeLogementId, limit = 10) => {
  return getLogements({
    page: 1,
    limit,
    typeLogementId,
    disponible: true,
  });
};

export default {
  getLogements,
  getLogementById,
  getLogementsRecommandes,
  searchLogementsByVille,
  filterLogementsByPrice,
  filterLogementsByType,
};
