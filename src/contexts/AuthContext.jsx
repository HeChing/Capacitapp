// ✅ VERIFICAR: src/contexts/AuthContext.jsx
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
      try {
        if (user) {
          console.log('Usuario autenticado:', user.uid); // Debug

          // Obtener datos del usuario desde Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || ROLES.EMPLOYEE;
            const userPermissions =
              ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.EMPLOYEE];

            console.log('Datos del usuario:', userData); // Debug
            console.log('Rol del usuario:', role); // Debug

            setCurrentUser({
              ...user,
              ...userData,
              uid: user.uid,
            });
            setUserRole(role);
            setPermissions(userPermissions);
          } else {
            console.log('Documento de usuario no existe, creando uno nuevo'); // Debug

            // Si no existe el documento, crear uno con rol por defecto
            const defaultUserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
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
        } else {
          console.log('Usuario no autenticado'); // Debug
          setCurrentUser(null);
          setUserRole(null);
          setPermissions([]);
        }
      } catch (error) {
        console.error('Error en AuthContext:', error);
        // En caso de error, establecer valores por defecto
        if (user) {
          setCurrentUser(user);
          setUserRole(ROLES.EMPLOYEE);
          setPermissions(ROLE_PERMISSIONS[ROLES.EMPLOYEE]);
        }
      } finally {
        setLoading(false);
      }
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
    try {
      return await authService.loginWithEmail(email, password);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      return await authService.loginWithGoogle();
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  };

  const register = async (email, password, displayName) => {
    try {
      const result = await authService.register(email, password, displayName);

      // Crear documento de usuario en Firestore
      if (result.user) {
        const userDocRef = doc(db, 'users', result.user.uid);
        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: displayName || result.user.email.split('@')[0],
          role: ROLES.EMPLOYEE,
          department: '',
          createdAt: new Date().toISOString(),
          isActive: true,
        });
      }

      return result;
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      return await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  // En tu AuthContext.jsx, verifica que el value incluya:
  const value = {
    currentUser,
    userRole,
    permissions,
    login,
    loginWithGoogle,
    register,
    logout,
    loading,
    hasPermission, // ← Debe estar aquí
    hasAnyPermission, // ← Debe estar aquí
    hasAllPermissions, // ← Debe estar aquí
    hasRole, // ← Debe estar aquí
    hasAnyRole, // ← Debe estar aquí
    ROLES,
    ROLE_PERMISSIONS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
