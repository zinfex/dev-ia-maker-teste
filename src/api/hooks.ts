import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, User, type LoginResponse } from './client';
import type { Message, Paginated } from '../types/message';
import { setToken } from '../utils/auth';

export function useLogin() {
    return useMutation<LoginResponse, unknown, { username: string; password: string }>({
        mutationFn: api.login,
        onSuccess: (data) => {
            setToken(data.token);
        },
    });
}

export function useCreateUser() {
    return useMutation<User, unknown, { username: string; password: string }>({
        mutationFn: api.createUser,
    });
}

export function useMessages(params: { page: number; limit: number; status?: string }) {
    return useQuery<Paginated<Message>>({
        queryKey: ['messages', params],
        queryFn: () => api.listMessages(params),
        staleTime: 5_000,
    });
}

export function useMessage(id: string) {
    return useQuery<Message>({ queryKey: ['message', id], queryFn: () => api.getMessage(id), enabled: !!id });
}

export function useCreateMessage() {
    const qc = useQueryClient();
    return useMutation<Message, unknown, Omit<Message, 'id' | 'created_at' | 'updated_at'>>({
        mutationFn: (payload) => api.createMessage(payload),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['messages'] }); },
    });
}

export function useUpdateMessage(id: string) {
    const qc = useQueryClient();
        return useMutation<Message, unknown, Partial<Message>>({
        mutationFn: (payload) => api.updateMessage(id, payload, true),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['message', id] });
            qc.invalidateQueries({ queryKey: ['messages'] });
        },
    });
}

export function useDeleteMessage() {
    const qc = useQueryClient();
    return useMutation<void, unknown, string>({
        mutationFn: (id) => api.deleteMessage(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['messages'] });
        },
    });
}
