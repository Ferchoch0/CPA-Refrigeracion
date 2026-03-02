import { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';

/**
 * Hook para cargar y filtrar la lista de clientes asignados a un técnico.
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
                    setAllClients([]);
                    setFilteredClients([]);
                }
            } catch (error) {
                console.log('Error fetchClients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [userId]);

    return { allClients, filteredClients, setFilteredClients, loading };
}
