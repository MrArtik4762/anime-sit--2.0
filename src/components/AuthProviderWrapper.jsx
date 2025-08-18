import React from 'react';
import { AuthContext } from '../hooks/useAuth';

export const AuthProviderWrapper = ({ value, children }) => {
  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};