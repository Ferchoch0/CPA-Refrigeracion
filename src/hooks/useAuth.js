import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook para cargar y gestionar el usuario autenticado desde AsyncStorage.
 * Se usa en Home, Profile, Answers y donde se necesite el usuario actual.
 *
 * @returns {{ user: object|null, loading: boolean, setUser: Function }}
 */
export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    /**
     * Actualiza el usuario en estado y en AsyncStorage.
     */
    const updateUser = async (updatedUser) => {
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return { user, loading, setUser: updateUser };
}
