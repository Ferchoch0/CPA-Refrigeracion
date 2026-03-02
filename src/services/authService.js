import { apiPost } from '../constants/api';

/**
 * Verifica las credenciales del usuario.
 * @param {string} email
 * @param {string} pass
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function login(email, pass) {
    return apiPost('technicalController.php', {
        action: 'verifyUser',
        email,
        pass,
    });
}
