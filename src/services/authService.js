import { apiPost } from '../constants/api';
import { saveUserCredentials, getUserByEmail } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/**
 * Genera un hash SHA-256 de un string usando la Web Crypto API.
 * @param {string} text
 * @returns {Promise<string>} - Hash hexadecimal
 */
async function hashPassword(text) {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        text
    );
}

/**
 * Verifica las credenciales del usuario.
 * - Con internet: valida contra la API → si devuelve success, guarda/actualiza credenciales en SQLite
 * - Sin internet: valida contra SQLite local
 *
 * @param {string} email
 * @param {string} pass
 * @returns {Promise<{success: boolean, user?: object, isOnline?: boolean, error?: string}>}
 */
export async function login(email, pass) {
    try {
        const result = await apiPost('technicalController.php', {
            action: 'verifyUser',
            email,
            pass,
        });

        console.log('📦 result:', JSON.stringify(result));

        if (result.success) {
            const passHash = await hashPassword(pass);
            console.log('🔑 hash generado:', passHash);
            
            await saveUserCredentials(result.user, passHash);
            console.log('💾 credenciales guardadas en SQLite');

            await AsyncStorage.setItem('user', JSON.stringify(result.user));
            console.log('💾 usuario guardado en AsyncStorage');

            return { success: true, user: result.user, isOnline: true };
        } else {
            return { success: false, error: 'invalid_credentials' };
        }
    } catch (networkError) {
        console.log('❌ ERROR en login:', networkError.message, networkError.stack);
        return loginOffline(email, pass);
    }
}

/**
 * Intenta autenticar al usuario usando las credenciales almacenadas en SQLite.
 * @param {string} email
 * @param {string} pass
 * @returns {Promise<{success: boolean, user?: object, isOnline?: boolean, error?: string}>}
 */
async function loginOffline(email, pass) {
    const storedUser = await getUserByEmail(email);

    if (!storedUser) {
        // No hay sesión previa guardada para este email
        return { success: false, error: 'no_previous_session' };
    }

    // Comparar hash del password ingresado con el almacenado
    const inputHash = await hashPassword(pass);

    if (inputHash === storedUser.password_hash) {
        const user = {
            id: storedUser.id,
            email: storedUser.email,
            name: storedUser.name,
            dni: storedUser.dni,
            phone: storedUser.phone,
            photo: storedUser.photo,
        };
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return { success: true, user, isOnline: false };
    } else {
        return { success: false, error: 'invalid_credentials' };
    }
}
