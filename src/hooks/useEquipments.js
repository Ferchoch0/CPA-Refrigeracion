import { useState, useEffect } from 'react';
import { getEquipmentsByClient } from '../services/equipmentService';
import { getEquipmentsByClientId } from '../services/database';

/**
 * Agrupa una lista plana de equipos por código.
 * Equipos con el mismo `code` se agrupan como unidades de un mismo equipo físico.
 */
function agruparEquipos(equipos) {
    const mapa = {};
    equipos.forEach((eq) => {
        const key = eq.code;
        if (!mapa[key]) {
            mapa[key] = { ...eq, unidades: [] };
        }
        mapa[key].unidades.push(eq);
    });
    return Object.values(mapa);
}

/**
 * Hook para cargar, agrupar y filtrar equipos de un cliente.
 * Con internet: obtiene de la API. Sin internet: obtiene de SQLite local.
 *
 * @param {number|string} clientId
 * @returns {{ equipos, filteredEquipos, loading, search, estadoFiltro, handleSearch, handleFiltrarEstado, refetch, getTotales }}
 */
export default function useEquipments(clientId) {
    const [equipos, setEquipos] = useState([]);
    const [filteredEquipos, setFilteredEquipos] = useState([]);
    const [search, setSearch] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('Todos');
    const [loading, setLoading] = useState(true);

    const fetchEquipos = async () => {
        setLoading(true);
        try {
            const data = await getEquipmentsByClient(clientId);

            if (!data.error) {
                const agrupados = agruparEquipos(data);
                setEquipos(agrupados);
                setFilteredEquipos(agrupados);
            } else {
                console.error('Error:', data.error);
                // Intentar cargar desde SQLite
                await loadFromSQLite();
            }
        } catch (err) {
            console.log('Sin conexión, cargando equipos desde SQLite...');
            await loadFromSQLite();
        } finally {
            setLoading(false);
        }
    };

    const loadFromSQLite = async () => {
        try {
            const localData = await getEquipmentsByClientId(clientId);
            const agrupados = agruparEquipos(localData);
            setEquipos(agrupados);
            setFilteredEquipos(agrupados);
        } catch (dbErr) {
            console.error('Error cargando equipos locales:', dbErr);
            setEquipos([]);
            setFilteredEquipos([]);
        }
    };

    useEffect(() => {
        if (clientId) fetchEquipos();
    }, [clientId]);

    const handleSearch = (text, estado = estadoFiltro) => {
        setSearch(text);
        let filtered = [...equipos];

        if (estado !== 'Todos') {
            filtered = filtered.filter((eq) => eq.status === estado);
        }
        if (text.trim() !== '') {
            filtered = filtered.filter((eq) =>
                eq.name.toLowerCase().includes(text.toLowerCase())
            );
        }
        setFilteredEquipos(filtered);
    };

    const handleFiltrarEstado = (estado) => {
        setEstadoFiltro(estado);
        handleSearch(search, estado);
    };

    const getTotales = () => {
        const total = equipos.length;
        const activos = equipos.filter((e) => e.status === 'Activo').length;
        const revision = equipos.filter((e) => e.status === 'Activo: Requiere revisión').length;
        const inactivos = equipos.filter((e) => e.status === 'Inactivo').length;
        const baja = equipos.filter((e) => e.status === 'Dado de baja').length;
        return { total, activos, revision, inactivos, baja };
    };

    return {
        equipos,
        filteredEquipos,
        loading,
        search,
        estadoFiltro,
        handleSearch,
        handleFiltrarEstado,
        refetch: fetchEquipos,
        getTotales,
    };
}
