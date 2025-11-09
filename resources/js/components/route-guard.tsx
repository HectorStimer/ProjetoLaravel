import { useUserRole } from '@/hooks/use-user-role';
import { router } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';

interface RouteGuardProps {
    children: ReactNode;
    allowedRoles: Array<'admin' | 'triagist' | 'doctor'>;
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * Componente para proteger rotas baseado na função do usuário
 */
export function RouteGuard({ 
    children, 
    allowedRoles, 
    redirectTo = '/dashboard',
    fallback = null 
}: RouteGuardProps) {
    const { hasAnyRole, user } = useUserRole();

    useEffect(() => {
        // Se não houver usuário ou função não permitida, redireciona
        if (!user || !hasAnyRole(allowedRoles)) {
            router.visit(redirectTo);
        }
    }, [user, allowedRoles, redirectTo, hasAnyRole]);

    // Se não houver usuário ou função não permitida, mostra fallback
    if (!user || !hasAnyRole(allowedRoles)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

