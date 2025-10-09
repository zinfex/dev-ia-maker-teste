import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import MessagesListPage from './pages/MessagesListPage';
import MessageDetailPage from './pages/MessageDetailPage';
import MessageFormPage from './pages/MessageFormPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getToken } from './utils/auth';

const qc = new QueryClient();

function Protected({ children }:{ children: JSX.Element }){
    const token = getToken();
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

export const router = createBrowserRouter([
    {
    path: '/',
    element: (
        <QueryClientProvider client={qc}>
            <Layout>
                <></>
            </Layout>
        </QueryClientProvider>
    ),
    children: []
    },
    {
    path: '/login',
    element: (
        <QueryClientProvider client={qc}>
            <Layout>
                <LoginPage />
            </Layout>
        </QueryClientProvider>
    )
    },
    {
    path: '/messages',
    element: (
        <QueryClientProvider client={qc}>
            <Layout>
                <Protected>
                    <MessagesListPage />
                </Protected>
            </Layout>
        </QueryClientProvider>
        )
    },
    {
    path: '/messages/new',
    element: (
        <QueryClientProvider client={qc}>
            <Layout>
                <Protected>
                    <MessageFormPage />
                </Protected>
            </Layout>
        </QueryClientProvider>
    )
    },
    {
    path: '/messages/:id',
    element: (
        <QueryClientProvider client={qc}>
            <Layout>
                <Protected>
                    <MessageDetailPage />
                </Protected>
            </Layout>
        </QueryClientProvider>
    )
    },
]);