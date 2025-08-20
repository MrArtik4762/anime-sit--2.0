import React, { ReactNode } from 'react';
import { AuthContext, AuthContextType } from '../hooks/useAuth';

interface AuthProviderWrapperProps {
  value: AuthContextType;
  children: ReactNode;
}

export const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ value, children }) => {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};