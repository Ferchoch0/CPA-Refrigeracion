import * as SQLite from 'expo-sqlite';

let db = null;

/**
 * Abre la base de datos y crea las tablas necesarias si no existen.
 * Debe llamarse una vez al iniciar la app (en App.js).
 */
export async function initDatabase() {
    db = await SQLite.openDatabaseAsync('cpa_refrigeracion_v2.db');

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            dni TEXT,
            phone TEXT,
            photo TEXT,
            password_hash TEXT NOT NULL,
            last_login TEXT
        );

        CREATE TABLE IF NOT EXISTS clients (
            client_id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            company_name TEXT,
            client_code TEXT,
            contact_person TEXT,
            location TEXT,
            address TEXT
        );

        CREATE TABLE IF NOT EXISTS equipments (
            equipment_id INTEGER PRIMARY KEY,
            client_id INTEGER NOT NULL,
            type_equip_id INTEGER,
            name TEXT,
            code TEXT,
            status TEXT,
            placement TEXT
        );

        CREATE TABLE IF NOT EXISTS question_categories (
            field_category_id INTEGER,
            equipment_id INTEGER NOT NULL,
            name TEXT,
            description TEXT,
            ord INTEGER,
            questions_total INTEGER DEFAULT 0,
            questions_answered INTEGER DEFAULT 0,
            PRIMARY KEY (field_category_id, equipment_id)
        );

        CREATE TABLE IF NOT EXISTS questions (
            field_equip_id INTEGER PRIMARY KEY,
            category_id INTEGER NOT NULL,
            type_equip_id INTEGER,
            name TEXT,
            description TEXT,
            fields_type TEXT,
            options TEXT
        );

        CREATE TABLE IF NOT EXISTS answers (
            field_equip_id INTEGER,
            equipment_id INTEGER NOT NULL,
            value TEXT,
            PRIMARY KEY (field_equip_id, equipment_id)
        );

        CREATE TABLE IF NOT EXISTS pending_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipment_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            answers_json TEXT NOT NULL,
            files_json TEXT,
            created_at TEXT NOT NULL,
            synced INTEGER DEFAULT 0
        );
    `);

    return db;
}

/**
 * Obtiene la instancia de la base de datos.
 * @returns {SQLite.SQLiteDatabase}
 */
export function getDatabase() {
    return db;
}

// ─── Usuarios ───────────────────────────────────────────────

/**
 * Guarda o actualiza las credenciales del usuario en SQLite.
 * @param {object} user - Datos del usuario desde la API
 * @param {string} passwordHash - SHA-256 del password
 */
export async function saveUserCredentials(user, passwordHash) {
    await db.runAsync(
        `INSERT OR REPLACE INTO users (id, email, name, dni, phone, photo, password_hash, last_login)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user.id,
            user.email,
            user.name || null,
            user.dni || null,
            user.phone || null,
            user.photo || null,
            passwordHash,
            new Date().toISOString(),
        ]
    );
}

/**
 * Busca un usuario por email en SQLite.
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export async function getUserByEmail(email) {
    const row = await db.getFirstAsync(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return row || null;
}

// ─── Clientes ───────────────────────────────────────────────

/**
 * Guarda los clientes sincronizados en SQLite.
 * @param {number|string} userId
 * @param {Array} clients
 */
export async function saveClients(userId, clients) {
    await db.runAsync('DELETE FROM clients WHERE user_id = ?', [userId]);

    for (const client of clients) {
        await db.runAsync(
            `INSERT INTO clients (client_id, user_id, company_name, client_code, contact_person, location, address)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                client.client_id,
                userId,
                client.company_name || null,
                client.client_code || null,
                client.contact_person || null,
                client.location || null,
                client.address || null,
            ]
        );
    }
}

/**
 * Obtiene los clientes de un usuario desde SQLite.
 * @param {number|string} userId
 * @returns {Promise<Array>}
 */
export async function getClientsByUserId(userId) {
    return await db.getAllAsync(
        'SELECT * FROM clients WHERE user_id = ?',
        [userId]
    );
}

// ─── Equipos ────────────────────────────────────────────────

/**
 * Guarda los equipos de un cliente en SQLite.
 * @param {number|string} clientId
 * @param {Array} equipments - Lista plana de equipos desde la API
 */
export async function saveEquipments(clientId, equipments) {
    await db.runAsync('DELETE FROM equipments WHERE client_id = ?', [clientId]);

    for (const eq of equipments) {
        await db.runAsync(
            `INSERT OR REPLACE INTO equipments (equipment_id, client_id, type_equip_id, name, code, status, placement)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                eq.equipment_id,
                clientId,
                eq.type_equip_id || null,
                eq.name || null,
                eq.code || null,
                eq.status || null,
                eq.placement || null,
            ]
        );
    }
}

/**
 * Obtiene los equipos de un cliente desde SQLite.
 * @param {number|string} clientId
 * @returns {Promise<Array>}
 */
export async function getEquipmentsByClientId(clientId) {
    return await db.getAllAsync(
        'SELECT * FROM equipments WHERE client_id = ?',
        [clientId]
    );
}

// ─── Categorías de Preguntas ────────────────────────────────

/**
 * Guarda las categorías de preguntas de un equipo en SQLite.
 * @param {number|string} equipmentId
 * @param {Array} categories
 */
export async function saveQuestionCategories(equipmentId, categories) {
    await db.runAsync('DELETE FROM question_categories WHERE equipment_id = ?', [equipmentId]);

    for (const cat of categories) {
        await db.runAsync(
            `INSERT OR REPLACE INTO question_categories
             (field_category_id, equipment_id, name, description, ord, questions_total, questions_answered)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                cat.field_category_id,
                equipmentId,
                cat.name || null,
                cat.description || null,
                cat.ord || null,
                cat.questions_total || 0,
                cat.questions_answered || 0,
            ]
        );
    }
}

/**
 * Obtiene las categorías de preguntas de un equipo desde SQLite.
 * @param {number|string} equipmentId
 * @returns {Promise<Array>}
 */
export async function getQuestionCategoriesByEquipmentId(equipmentId) {
    return await db.getAllAsync(
        'SELECT * FROM question_categories WHERE equipment_id = ? ORDER BY ord',
        [equipmentId]
    );
}

// ─── Preguntas ──────────────────────────────────────────────

/**
 * Guarda las preguntas en SQLite.
 * @param {number|string} categoryId
 * @param {number|string} typeEquipId
 * @param {number|string} equipmentId
 * @param {Array} questions - Lista de preguntas con campo options (array)
 */
export async function saveQuestions(categoryId, typeEquipId, questions) {
    if (typeEquipId == null) {
        await db.runAsync(
            'DELETE FROM questions WHERE category_id = ? AND type_equip_id IS NULL',
            [categoryId]
        );
    } else {
        await db.runAsync(
            'DELETE FROM questions WHERE category_id = ? AND type_equip_id = ?',
            [categoryId, typeEquipId]
        );
    }

    for (const q of questions) {
        await db.runAsync(
            `INSERT OR REPLACE INTO questions
             (field_equip_id, category_id, type_equip_id, name, description, fields_type, options)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                q.field_equip_id,
                categoryId,
                typeEquipId,
                q.name || null,
                q.description || null,
                q.fields_type || null,
                q.options ? JSON.stringify(q.options) : null,
            ]
        );
    }
}

/**
 * Obtiene las preguntas desde SQLite.
 * @param {number|string} categoryId
 * @param {number|string} typeEquipId
 * @param {number|string} equipmentId
 * @returns {Promise<Array>}
 */
export async function getLocalQuestions(categoryId, typeEquipId, equipmentId) {
    let rows;
    if (typeEquipId == null) {
        rows = await db.getAllAsync(
            `SELECT * FROM questions WHERE category_id = ? AND type_equip_id IS NULL`,
            [categoryId]
        );
    } else {
        rows = await db.getAllAsync(
            `SELECT * FROM questions WHERE category_id = ? AND (type_equip_id = ? OR type_equip_id IS NULL)`,
            [categoryId, typeEquipId]
        );
    }

    return rows.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null,
    }));
}
// ─── Respuestas ─────────────────────────────────────────────

/**
 * Guarda respuestas existentes (descargadas del servidor) en SQLite.
 * @param {number|string} equipmentId
 * @param {object} answersObj - Objeto {field_equip_id: value}
 */
export async function saveLocalAnswers(equipmentId, answersObj) {
    // Sin DELETE — usar solo REPLACE
    for (const [fieldId, value] of Object.entries(answersObj)) {
        await db.runAsync(
            'INSERT OR REPLACE INTO answers (field_equip_id, equipment_id, value) VALUES (?, ?, ?)',
            [fieldId, equipmentId, value ?? '']
        );
    }
}

/**
 * Obtiene las respuestas de un equipo desde SQLite.
 * @param {number|string} equipmentId
 * @returns {Promise<object>} - Objeto {field_equip_id: value}
 */
export async function getLocalAnswers(equipmentId) {
    const rows = await db.getAllAsync(
        'SELECT * FROM answers WHERE equipment_id = ?',
        [equipmentId]
    );

    const answersObj = {};
    rows.forEach(row => {
        answersObj[row.field_equip_id] = row.value;
    });
    return answersObj;
}

// ─── Cola de Respuestas Pendientes ──────────────────────────

/**
 * Guarda una respuesta pendiente de sincronizar.
 * @param {object} data - {equipment_id, user_id, answers, files}
 */
export async function savePendingAnswer(data) {
    await db.runAsync(
        `INSERT INTO pending_answers (equipment_id, user_id, answers_json, files_json, created_at, synced)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [
            data.equipment_id,
            data.user_id,
            JSON.stringify(data.answers),
            data.files ? JSON.stringify(data.files) : null,
            new Date().toISOString(),
        ]
    );
}

/**
 * Obtiene todas las respuestas pendientes de sincronizar.
 * @returns {Promise<Array>}
 */
export async function getPendingAnswers() {
    return await db.getAllAsync(
        'SELECT * FROM pending_answers WHERE synced = 0 ORDER BY created_at ASC'
    );
}

/**
 * Marca una respuesta pendiente como sincronizada.
 * @param {number} id
 */
export async function markPendingAsSynced(id) {
    await db.runAsync(
        'UPDATE pending_answers SET synced = 1 WHERE id = ?',
        [id]
    );
}