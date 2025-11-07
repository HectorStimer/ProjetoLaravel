import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Patient {
    id: number;
    name: string;
    document: string | null;
    birth_date: string;
    phone: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: number;
    name: string;
    avg_service_time_minutes: number | null;
    created_at: string;
    updated_at: string;
}

export interface QueueEntry {
    id: number;
    patient_id: number;
    service_id: number;
    priority: number;
    status: 'waiting' | 'called' | 'in_service' | 'finished' | 'canceled';
    arrived_at: string;
    called_at: string | null;
    started_at: string | null;
    finished_at: string | null;
    estimated_service_time: number | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
    patient?: Patient;
    service?: Service;
}

export interface Triage {
    id: number;
    patient_id: number;
    triagist_id: number;
    score: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    patient?: Patient;
    triagist?: User;
}
