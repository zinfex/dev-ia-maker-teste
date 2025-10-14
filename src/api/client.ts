import { getToken, clearToken } from '../utils/auth';
import { parseProblem } from '../utils/error';
import type { Message, Paginated } from '../types/message';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(init.headers as Record<string, string>),
    };

    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (init.body && !(init.headers as any)?.['Content-Type']) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

    if (!res.ok) {
    if (res.status === 401) {
        // token inválido/expirado
        clearToken();
    }
        const pd = await parseProblem(res);
        throw pd;
    }

    if (res.status === 204) return undefined as unknown as T;


    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return (await res.json()) as T;


    return (await res.text()) as unknown as T;
}


export type LoginResponse = { accessToken: string; tokenType: 'Bearer'; expiresIn: number };


export const api = {
    login: (body: { username: string; password: string }) =>
    apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

    listMessages: (q: { page?: number; limit?: number; status?: string }) => {
        const params = new URLSearchParams();
        if (q.page) params.set('page', String(q.page));
        if (q.limit) params.set('limit', String(q.limit));
        if (q.status) params.set('status', q.status);
        return apiFetch<Paginated<Message>>('/messages?' + params.toString());
    },
    
    getMessage: (id: string) => apiFetch<Message>(`/messages?id=${id}`),
    
    createMessage: (body: unknown) => apiFetch<Message>('/messages', { method: 'POST', body: JSON.stringify(body) }),
    
    updateMessage: (id: string, body: unknown, partial?: boolean) => apiFetch<Message>(`/messages?id=${id}`, { method: partial ? 'PATCH' : 'PUT', body: JSON.stringify(body) }),

    deleteMessage: (id: string) => apiFetch<void>(`/messages?id=${id}`, { method: 'DELETE' }),
};
