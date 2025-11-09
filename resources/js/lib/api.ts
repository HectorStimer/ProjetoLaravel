import axios, { type AxiosError } from 'axios';
import { router } from '@inertiajs/react';

// Função para obter o token do localStorage ou cookie
function getAuthToken(): string | null {
    // Tenta pegar do localStorage primeiro
    const token = localStorage.getItem('auth_token');
    if (token) return token;
    
    // Tenta pegar do cookie
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
            return decodeURIComponent(value);
        }
    }
    
    return null;
}

const api = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Adicionar token nas requisições se disponível
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Limpar token e redirecionar para login
            localStorage.removeItem('auth_token');
            router.visit('/login');
        }

        if (error.response?.status === 419) {
            window.location.reload();
        }

        return Promise.reject(error);
    },
);

export default api;
