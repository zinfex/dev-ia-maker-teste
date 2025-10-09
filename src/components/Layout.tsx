import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../utils/auth';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const token = getToken();
    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
            <header style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                <nav style={{ display: 'flex', gap: 12 }}>
                    <Link to="/messages">Mensagens</Link>
                    <Link to="/messages/new">Nova</Link>
                    </nav>
                <div>
                {token ? (
                    <button
                    onClick={() => { clearToken(); navigate('/login'); }}
                    aria-label="Sair"
                    >Sair</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
                </div>
            </header>
            <main style={{ marginTop: 24 }}>{children}</main>
        </div>
    );
}