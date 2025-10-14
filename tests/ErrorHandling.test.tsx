
import { render } from '@testing-library/react';
import MessageFormPage from '../src/pages/MessageFormPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { ProblemDetails } from '../src/types/problem';

const mockCreateMessage = jest.fn();

// Mock dos hooks da API
jest.mock('../src/api/hooks', () => ({
  useCreateMessage: jest.fn(),
  useUpdateMessage: jest.fn(),
  useMessage: jest.fn()
}));

describe('Tratamento de Erros do Servidor', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    
    mockCreateMessage.mockClear();
  });

  test('exibe erro de validação do servidor na criação', async () => { 
    const { useCreateMessage, useUpdateMessage, useMessage } = require('../src/api/hooks');
    
    const validationError: ProblemDetails = {
      title: 'Validation Error',
      status: 400,
      detail: 'Invalid input data',
      invalid_params: [
        { name: 'title', reason: 'Title is required' },
        { name: 'content', reason: 'Content must be at least 10 characters' }
      ]
    };
    
    useMessage.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    });
    
    useCreateMessage.mockReturnValue({
      mutateAsync: mockCreateMessage,
      isPending: false,
      error: validationError
    });
    
    useUpdateMessage.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      error: null
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MessageFormPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    
    const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
    const contentInput = document.querySelector('textarea[name="body"]') as HTMLTextAreaElement;
    const submitButton = getByText('Criar');
    
    titleInput.value = 'Test';
    titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    contentInput.value = 'Short';
    contentInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    submitButton.click();
    
    // Verifica se o erro aparece
    setTimeout(() => {
      expect(getByText('Validation Error')).toBeTruthy();
      expect(getByText('Invalid input data')).toBeTruthy();
    }, 100);
  });
});