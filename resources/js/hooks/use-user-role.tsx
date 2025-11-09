import { usePage } from '@inertiajs/react';
import { type SharedData, type User } from '@/types';

/**
 * Hook para verificar a função/role do usuário autenticado
 */
export function useUserRole() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const isAdmin = (): boolean => {
        return user?.function === 'admin';
    };

    const isTriagist = (): boolean => {
        return user?.function === 'triagist';
    };

    const isDoctor = (): boolean => {
        return user?.function === 'doctor';
    };

    const hasRole = (role: 'admin' | 'triagist' | 'doctor'): boolean => {
        return user?.function === role;
    };

    const hasAnyRole = (roles: Array<'admin' | 'triagist' | 'doctor'>): boolean => {
        if (!user?.function) return false;
        return roles.includes(user.function);
    };

    return {
        user,
        isAdmin: isAdmin(),
        isTriagist: isTriagist(),
        isDoctor: isDoctor(),
        hasRole,
        hasAnyRole,
        function: user?.function,
    };
}

