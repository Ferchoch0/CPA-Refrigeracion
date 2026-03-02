import { apiPost } from '../constants/api';

/**
 * Obtiene los clientes asignados a un técnico.
 * @param {number|string} userId
 * @returns {Promise<{success: boolean, clients?: Array, error?: string}>}
 */
export async function getClients(userId) {
    return apiPost('clientController.php', {
        action: 'getClients',
        userId,
    });
}
