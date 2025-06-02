// ✅ ACTUALIZAR: src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Funciones que usan el servicio
  const login = async (email, password) => {
    return await authService.loginWithEmail(email, password);
  };

  const loginWithGoogle = async () => {
    return await authService.loginWithGoogle();
  };

  const register = async (email, password, displayName) => {
    return await authService.register(email, password, displayName);
  };

  const logout = async () => {
    return await authService.logout();
  };

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
