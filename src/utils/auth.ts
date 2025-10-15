import { API_CONFIG } from "../config/api";

const TOKEN_KEY = API_CONFIG.KEY;
 
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);