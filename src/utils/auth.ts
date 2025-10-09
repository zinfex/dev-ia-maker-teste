const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'crud_msgs_token';


export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);


// Observação: para um teste/tarefa, localStorage é aceitável.
// Em produção, considere: expiração/refresh, armazenamento httpOnly (via cookies),
// proteção a XSS e estratégia de logout seguro.