import React from 'react';
import { render } from '@testing-library/react';
import MessagesListPage from '../src/pages/MessagesListPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../src/api/hooks', () => ({
    useMessages: () => ({
        data: { data: [ { id:'1', title:'Hello', body:'World', status:'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() } ], meta: { page:1, limit:10, total:1 } },
        isLoading: false,
        error: null,
    }),
    useDeleteMessage: () => ({ mutate: jest.fn(), error: null })
}));
    
test('renderiza lista com dados mock', () => {
    const qc = new QueryClient();
    const { getByText } = render(
        <QueryClientProvider client={qc}>
            <MemoryRouter>
                <MessagesListPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
    expect(getByText('Mensagens')).toBeInTheDocument();
    expect(getByText('Hello')).toBeInTheDocument();
});