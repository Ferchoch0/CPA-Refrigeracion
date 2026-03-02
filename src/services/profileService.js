import { API_URL, apiPostForm } from '../constants/api';

/**
 * Sube una nueva foto de perfil.
 * @param {string|number} userId
 * @param {{uri: string, name: string, type: string}} photoFile
 * @returns {Promise<{success: boolean, filename?: string, error?: string}>}
 */
export async function uploadProfilePhoto(userId, photoFile) {
    const formData = new FormData();
    formData.append('action', 'uploadProfilePhoto');
    formData.append('userId', userId);
    formData.append('photo', photoFile);

    const response = await apiPostForm('technicalController.php', formData);
    return response.json();
}

/**
 * Devuelve la URL completa de la foto de perfil.
 */
export function getProfilePhotoUrl(filename) {
    return `${API_URL}/upload/profile/${filename}`;
}
