
import { render } from '@testing-library/react';
import MessagesListPage from '../src/pages/MessagesListPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const mockMessages = [
  {
    id: '1',
    title: 'Hello World',
    content: 'This is a test message',
    status: 'published',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Draft Message',
    content: 'This is a draft message',
    status: 'draft',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

// Mock dos hooks da API
jest.mock('../src/api/hooks', () => ({
  useMessages: jest.fn(),
  useDeleteMessage: jest.fn()
}));

describe('MessagesListPage - Render da Lista', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  test('renderiza lista com dados mock', () => {
    const { useMessages, useDeleteMessage } = require('../src/api/hooks');
    
    useMessages.mockReturnValue({
      data: { data: mockMessages, total: 2, page: 1, limit: 10 },
      isLoading: false,
      error: null
    });
    
    useDeleteMessage.mockReturnValue({
      mutate: jest.fn(),
      error: null
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MessagesListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verifica se os elementos estão presentes
    expect(getByText('Mensagens')).toBeTruthy();
    expect(getByText('Hello World')).toBeTruthy();
    expect(getByText('Draft Message')).toBeTruthy();
    expect(getByText('published')).toBeTruthy();
    expect(getByText('draft')).toBeTruthy();
  });
});