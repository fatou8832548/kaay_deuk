/**
 * Configuration API centralisée
 * Tous les services API utilisent cette URL de base
 */

const API_BASE_URL = 'https://spirituously-overcomplex-cherry.ngrok-free.dev';
const API_ENDPOINT = `${API_BASE_URL}/api`;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  API_ENDPOINT: API_ENDPOINT,
  TIMEOUT: 30000,
};

export default API_CONFIG;
