import { API_URL, apiGet, apiPost, apiPostForm } from '../constants/api';

/**
 * Obtiene los equipos de un cliente.
 */
export async function getEquipmentsByClient(clientId) {
    return apiGet(`equipmentsController.php?action=getEquipmentsByClient&client_id=${clientId}`);
}

/**
 * Actualiza el estado de un equipo.
 */
export async function updateEquipmentStatus(equipmentId, status) {
    return apiPost('equipmentsController.php', {
        action: 'updateEquipmentStatus',
        equipment_id: equipmentId,
        status,
    });
}

/**
 * Agrega un nuevo equipo a un cliente.
 */
export async function addEquipment(clientId, typeEquipId) {
    return apiPost('equipmentsController.php', {
        action: 'addEquipment',
        client_id: clientId,
        type_equip_id: typeEquipId,
    });
}

/**
 * Obtiene las categorías de preguntas para un equipo.
 */
export async function getQuestionsCategory(equipmentId) {
    return apiGet(`equipmentsController.php?action=getQuestionsCategory&equipment_id=${equipmentId}`);
}

/**
 * Obtiene las preguntas por tipo y categoría.
 */
export async function getQuestionsByType(categoryId, typeEquipId, equipmentId) {
    return apiGet(
        `equipmentsController.php?action=getQuestionsByType&category_id=${categoryId}&type_equip_id=${typeEquipId}&equipment_id=${equipmentId}`
    );
}

/**
 * Obtiene las imágenes asociadas a un equipo.
 */
export async function getImagesByEquipmentId(equipmentId) {
    return apiGet(`equipmentsController.php?action=getImagesByEquipmentId&equipment_id=${equipmentId}`);
}

/**
 * Construye la URL completa para obtener una imagen del servidor.
 */
export function getImageUrl(imageName) {
    return `${API_URL}/equipmentsController.php?action=getImage&name=${encodeURIComponent(imageName)}`;
}

/**
 * Guarda las respuestas de un formulario de equipo.
 * @param {FormData} formData
 * @returns {Promise<Response>} - La respuesta cruda (para leer .text())
 */
export async function saveAnswers(formData) {
    return apiPostForm('equipmentsController.php', formData);
}
