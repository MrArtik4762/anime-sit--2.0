import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Даем время на проверку аутентификации
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Если требуется аутентификация, но пользователь не вошел
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Если аутентификация не требуется, но пользователь вошел
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default Protected;