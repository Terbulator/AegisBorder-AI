import { createContext, useContext, useCallback, useState, useMemo } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'aegisborder_user';

const isDev = import.meta.env.DEV;
const ADMIN_EMAIL = isDev ? 'admin@aegisborder.dev' : 'admin@aegisborder.gov';
const ANALYST_EMAIL = isDev ? 'analyst@aegisborder.dev' : 'analyst@aegisborder.gov';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 300));
    const lower = String(email || '').trim().toLowerCase();
    if (lower === ADMIN_EMAIL && password === 'admin123') {
      const u = { id: 'usr_001', name: 'Arjun Mehta', email: lower, role: 'admin' };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return u;
    }
    if (lower === ANALYST_EMAIL && password === 'analyst123') {
      const u = { id: 'usr_002', name: 'Priya Nair', email: lower, role: 'analyst' };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return u;
    }
    const err = new Error('Invalid credentials');
    err.code = 'AUTH_CREDENTIALS';
    throw err;
  }, []);

  const signup = useCallback(async ({ name, email, password, role }) => {
    await new Promise(r => setTimeout(r, 300));
    const lower = String(email || '').trim().toLowerCase();
    const u = { id: crypto.randomUUID(), name: name || lower.split('@')[0], email: lower, role: role || 'analyst' };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ user, login, signup, logout, isAdmin: user?.role === 'admin' }), [user, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
