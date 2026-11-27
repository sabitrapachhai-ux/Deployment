import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('repair_user')); } catch { return null; }
  });
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('repair_token', data.data.token);
    localStorage.setItem('repair_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
  };
  const logout = () => {
    localStorage.removeItem('repair_token');
    localStorage.removeItem('repair_user');
    setUser(null);
  };
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
