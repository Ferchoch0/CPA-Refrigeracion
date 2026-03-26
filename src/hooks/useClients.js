import { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';
import { getClientsByUserId } from '../services/database';

/**
 * Hook para cargar y filtrar la lista de clientes asignados a un técnico.
 * Con internet: obtiene de la API. Sin internet: obtiene de SQLite local.
 *
 * @param {number|string|null} userId
 * @returns {{ allClients: Array, filteredClients: Array, setFilteredClients: Function, loading: boolean }}
 */
export default function useClients(userId) {
    const [allClients, setAllClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchClients = async () => {
            setLoading(true);
            try {
                const result = await getClients(userId);
                if (result.success) {
                    setAllClients(result.clients);
                    setFilteredClients(result.clients);
                } else {
                    console.log('Error al traer clientes:', result.error);
                    // Intentar cargar desde SQLite como fallback
                    await loadClientsFromSQLite(userId);
                }
            } catch (error) {
                console.log('Sin conexión, cargando clientes desde SQLite...');
                await loadClientsFromSQLite(userId);
            } finally {
                setLoading(false);
            }
        };

        const loadClientsFromSQLite = async (id) => {
            try {
                const localClients = await getClientsByUserId(id);
                setAllClients(localClients);
                setFilteredClients(localClients);
            } catch (dbError) {
                console.log('Error al cargar clientes locales:', dbError);
                setAllClients([]);
                setFilteredClients([]);
            }
        };

        fetchClients();
    }, [userId]);

    return { allClients, filteredClients, setFilteredClients, loading };
}
