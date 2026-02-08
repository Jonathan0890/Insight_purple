// src/hooks/useAuth.ts
import { useAuth as useAuthContext } from '../context/AuthContext';

// Re-exportar el hook principal
export const useAuth = useAuthContext;

// Hook adicional para verificar permisos
export const useAuthCheck = () => {
  const { user } = useAuth();
  
  return {
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    user
  };
};