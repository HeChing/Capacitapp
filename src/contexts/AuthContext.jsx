// ✅ ACTUALIZAR: src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

// Definir roles del sistema
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

// Definir permisos por rol
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'users.create',
    'users.edit',
    'users.delete',
    'users.view',
    'users.assignRoles',
    'courses.create',
    'courses.edit',
    'courses.delete',
    'courses.publish',
    'courses.view',
    'courses.enroll',
    'reports.viewAll',
    'reports.export',
    'settings.manage',
  ],
  [ROLES.ADMIN]: [
    'users.create',
    'users.edit',
    'users.view',
    'courses.create',
    'courses.edit',
    'courses.delete',
    'courses.publish',
    'courses.view',
    'courses.enroll',
    'reports.viewAll',
    'reports.export',
  ],
  [ROLES.INSTRUCTOR]: [
    'courses.create',
    'courses.edit',
    'courses.view',
    'courses.viewOwn',
    'reports.viewOwn',
    'users.viewStudents',
  ],
  [ROLES.MANAGER]: [
    'users.viewTeam',
    'courses.view',
    'courses.enroll',
    'courses.assignToTeam',
    'reports.viewTeam',
    'reports.viewOwn',
  ],
  [ROLES.EMPLOYEE]: [
    'courses.view',
    'courses.enroll',
    'reports.viewOwn',
    'profile.edit',
  ],
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Obtener datos del usuario desde Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || ROLES.EMPLOYEE;
            const userPermissions =
              ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.EMPLOYEE];

            setCurrentUser({
              ...user,
              ...userData,
              uid: user.uid,
            });
            setUserRole(role);
            setPermissions(userPermissions);
          } else {
            // Si no existe el documento, crear uno con rol por defecto
            const defaultUserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || '',
              role: ROLES.EMPLOYEE,
              department: '',
              createdAt: new Date().toISOString(),
              isActive: true,
            };

            await setDoc(userDocRef, defaultUserData);

            setCurrentUser({
              ...user,
              ...defaultUserData,
            });
            setUserRole(ROLES.EMPLOYEE);
            setPermissions(ROLE_PERMISSIONS[ROLES.EMPLOYEE]);
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
          setCurrentUser(user);
          setUserRole(ROLES.EMPLOYEE);
          setPermissions(ROLE_PERMISSIONS[ROLES.EMPLOYEE]);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setPermissions([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  // Función para verificar si el usuario tiene uno de varios permisos
  const hasAnyPermission = (permissionList) => {
    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  // Función para verificar si el usuario tiene todos los permisos
  const hasAllPermissions = (permissionList) => {
    return permissionList.every((permission) =>
      permissions.includes(permission)
    );
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return userRole === role;
  };

  // Función para verificar si el usuario tiene uno de varios roles
  const hasAnyRole = (roleList) => {
    return roleList.includes(userRole);
  };

  // Funciones de autenticación existentes
  const login = async (email, password) => {
    return await authService.loginWithEmail(email, password);
  };

  const loginWithGoogle = async () => {
    return await authService.loginWithGoogle();
  };

  const register = async (email, password, displayName) => {
    const result = await authService.register(email, password, displayName);

    // Crear documento de usuario en Firestore
    if (result.user) {
      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName || '',
        role: ROLES.EMPLOYEE,
        department: '',
        createdAt: new Date().toISOString(),
        isActive: true,
      });
    }

    return result;
  };

  const logout = async () => {
    return await authService.logout();
  };

  const value = {
    currentUser,
    userRole,
    permissions,
    login,
    loginWithGoogle,
    register,
    logout,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    ROLES,
    ROLE_PERMISSIONS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
