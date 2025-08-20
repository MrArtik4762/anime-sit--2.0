import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, getProfile } from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  theme: string;
  privacy: {
    profileVisible: boolean;
    favoritesVisible: boolean;
  };
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        // Пользователь не аутентифицирован, это нормально
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Вход пользователя
  const login = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      setUser(response.user);
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Регистрация пользователя
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await register(username, email, password);
      setUser(response.user);
      navigate('/profile');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Выход пользователя
  const logout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};