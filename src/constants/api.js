import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig.extra.API_URL;

/**
 * Helper para hacer POST con JSON al backend.
 * @param {string} endpoint - Nombre del controlador (ej: "clientController.php")
 * @param {object} body - Objeto a enviar como JSON
 * @returns {Promise<any>} - Respuesta parseada como JSON
 */
export async function apiPost(endpoint, body) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

/**
 * Helper para hacer POST con FormData al backend.
 * @param {string} endpoint
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export async function apiPostForm(endpoint, formData) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  return response;
}

/**
 * Helper para hacer GET al backend.
 * @param {string} endpoint - Ruta con query params incluido (ej: "equipmentsController.php?action=getEquipmentsByClient&client_id=1")
 * @returns {Promise<any>}
 */
export async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}/${endpoint}`);
  return response.json();
}
