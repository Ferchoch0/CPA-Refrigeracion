import { getClients } from './clientService';
import {
    getEquipmentsByClient,
    getQuestionsCategory,
    getQuestionsByType,
} from './equipmentService';
import {
    saveClients,
    saveEquipments,
    saveQuestionCategories,
    saveQuestions,
    saveLocalAnswers,
    getPendingAnswers,
    markPendingAsSynced,
} from './database';
import { saveAnswers } from './equipmentService';

/**
 * Sincroniza todos los datos necesarios después de un login exitoso con internet.
 * Acepta un callback opcional para reportar progreso.
 * @param {number|string} userId
 * @param {function} onProgress - Callback (current, total, label)
 */
export async function syncDataAfterLogin(userId, onProgress) {
    const report = onProgress || (() => { });

    try {
        // 1. Obtener clientes
        report(0, 0, 'Obteniendo clientes...');
        const clientResult = await getClients(userId);
        if (!clientResult.success || !clientResult.clients) {
            console.log('No se pudieron sincronizar clientes:', clientResult.error);
            return;
        }

        await saveClients(userId, clientResult.clients);

        // 2. Contar total de pasos para el progreso
        // Total = clientes + equipos + categorías (se irá actualizando)
        let totalSteps = clientResult.clients.length;
        let currentStep = 0;

        report(currentStep, totalSteps, `Descargando equipos...`);

        // Recopilar todos los equipos
        const allEquipments = [];
        for (const client of clientResult.clients) {
            try {
                const equipments = await getEquipmentsByClient(client.client_id);
                if (Array.isArray(equipments) && !equipments.error) {
                    await saveEquipments(client.client_id, equipments);
                    allEquipments.push(...equipments.map(eq => ({ ...eq, client_id: client.client_id })));
                }
            } catch (eqErr) {
                console.log(`Error sync equipos cliente ${client.client_id}:`, eqErr);
            }
            currentStep++;
            report(currentStep, totalSteps, `Descargando equipos... (${currentStep}/${totalSteps})`);
        }

        // Ahora totalSteps incluye los equipos
        totalSteps = allEquipments.length;
        currentStep = 0;
        report(currentStep, totalSteps, `Descargando formularios...`);

        // 3. Para cada equipo, sincronizar categorías y preguntas
        for (const eq of allEquipments) {
            try {
                const categories = await getQuestionsCategory(eq.equipment_id);
                if (Array.isArray(categories) && !categories.error) {
                    await saveQuestionCategories(eq.equipment_id, categories);

                    for (const cat of categories) {
                        try {
                            const qData = await getQuestionsByType(
                                cat.field_category_id,
                                eq.type_equip_id,
                                eq.equipment_id
                            );
                            if (qData && !qData.error) {
                                if (qData.questions) {
                                    await saveQuestions(
                                        cat.field_category_id,
                                        eq.type_equip_id,
                                        qData.questions
                                    );
                                }
                                if (qData.answers) {
                                    await saveLocalAnswers(eq.equipment_id, qData.answers);
                                }
                            }
                        } catch (qErr) {
                            console.log(`Error sync preguntas cat ${cat.field_category_id}:`, qErr);
                        }
                    }
                }
            } catch (catErr) {
                console.log(`Error sync categorías equipo ${eq.equipment_id}:`, catErr);
            }
            currentStep++;
            report(currentStep, totalSteps, `Descargando formularios... (${currentStep}/${totalSteps})`);
        }

        report(totalSteps, totalSteps, '¡Sincronización completa!');
        console.log('Sincronización completa');
    } catch (error) {
        console.error('Error en sincronización post-login:', error);
    }
}

/**
 * Sube las respuestas pendientes almacenadas en SQLite al servidor.
 * Acepta un callback opcional para reportar progreso.
 * @param {function} onProgress - Callback (current, total)
 * @returns {Promise<{uploaded: number, total: number}>}
 */
export async function syncPendingAnswers(onProgress) {
    const report = onProgress || (() => { });

    try {
        const pending = await getPendingAnswers();
        if (pending.length === 0) return { uploaded: 0, total: 0 };

        console.log(`Sincronizando ${pending.length} respuestas pendientes...`);
        let uploaded = 0;

        for (let i = 0; i < pending.length; i++) {
            const item = pending[i];
            try {
                const answers = JSON.parse(item.answers_json);
                const files = item.files_json ? JSON.parse(item.files_json) : {};

                const formData = new FormData();
                formData.append('action', 'saveAnswers');
                formData.append('equipment_id', item.equipment_id);
                formData.append('user_id', item.user_id);

                for (const [fieldId, value] of Object.entries(answers)) {
                    formData.append(`answer_${fieldId}`, value ?? '');
                }

                for (const [fieldId, fileList] of Object.entries(files)) {
                    fileList.forEach((file, index) => {
                        formData.append(`file_${fieldId}_${index}`, {
                            uri: file.uri,
                            name: file.name,
                            type: file.type,
                        });
                    });
                }

                const response = await saveAnswers(formData);
                const text = await response.text();
                console.log(`Pendiente ${item.id} sincronizado:`, text);

                await markPendingAsSynced(item.id);
                uploaded++;
            } catch (uploadErr) {
                console.log(`Error subiendo pendiente ${item.id}:`, uploadErr);
            }
            report(i + 1, pending.length);
        }

        return { uploaded, total: pending.length };
    } catch (error) {
        console.error('Error en syncPendingAnswers:', error);
        return { uploaded: 0, total: 0 };
    }
}

/**
 * Verifica cuántas respuestas pendientes hay sin sincronizar.
 * @returns {Promise<number>}
 */
export async function getPendingCount() {
    const pending = await getPendingAnswers();
    return pending.length;
}
