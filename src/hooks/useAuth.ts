import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProviderWrapper } from '../components/AuthProviderWrapper';

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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Проверка аутентификации при загрузке (демо режим)
  useEffect(() => {
    // Имитация проверки аутентификации
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Вход пользователя (демо режим)
  const login = async (email: string, password: string) => {
    // Имитация входа
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoUser: User = {
      _id: '1',
      username: 'DemoUser',
      email: email,
      avatar: '/placeholder.jpg',
      theme: 'system',
      privacy: {
        profileVisible: true,
        favoritesVisible: true
      },
      role: 'user'
    };
    
    setUser(demoUser);
    navigate('/profile');
  };

  // Регистрация пользователя (демо режим)
  const register = async (username: string, email: string, password: string) => {
    // Имитация регистрации
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      _id: Date.now().toString(),
      username,
      email,
      avatar: '/placeholder.jpg',
      theme: 'system',
      privacy: {
        profileVisible: true,
        favoritesVisible: true
      },
      role: 'user'
    };
    
    setUser(newUser);
    navigate('/profile');
  };

  // Выход пользователя
  const logout = async () => {
    setUser(null);
    navigate('/');
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
    AuthProviderWrapper,
    { value },
    children
  );
};