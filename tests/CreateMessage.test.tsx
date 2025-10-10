import React from 'react';
import { render } from '@testing-library/react';
import MessageFormPage from '../src/pages/MessageFormPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const mutateAsync = jest.fn().mockResolvedValue({ id: '123' });

jest.mock('../src/api/hooks', () => ({
    useMessage: () => ({ data: null, isLoading: false }),
    useCreateMessage: () => ({ mutateAsync, error: null }),
    useUpdateMessage: () => ({ mutateAsync, error: null })
}));

test('cria mensagem ao enviar formulário', async () => {
    const qc = new QueryClient();
    const { getByLabelText, getByText } = render(
        <QueryClientProvider client={qc}>
            <MemoryRouter>
                <MessageFormPage />
            </MemoryRouter>
        </QueryClientProvider>
    );
    
    const titleInput = getByLabelText('Título');
    const contentInput = getByLabelText('Conteúdo');
    const statusSelect = getByLabelText('Status');
    const submitButton = getByText('Criar');
    
    titleInput.value = 'Novo';
    titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    contentInput.value = 'Conteúdo com mais de 10 chars';
    contentInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    statusSelect.value = 'draft';
    statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
    
    submitButton.click();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mutateAsync).toHaveBeenCalled();
});