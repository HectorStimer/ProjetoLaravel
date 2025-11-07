import axios, { type AxiosError } from 'axios';
import { router } from '@inertiajs/react';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            router.visit('/login');
        }

        if (error.response?.status === 419) {
            window.location.reload();
        }

        return Promise.reject(error);
    },
);

export default api;
