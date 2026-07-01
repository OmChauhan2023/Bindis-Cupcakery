import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, phone?: string, password?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    setUser(data);
  };

  const register = async (name: string, email: string, phone?: string, password?: string) => {
    const { data } = await api.post('/auth/register', { name, email, phone, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    setUser(data);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
