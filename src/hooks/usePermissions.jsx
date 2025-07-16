// ✅ USAR: src/hooks/usePermissions.js (el tuyo está perfecto)
import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const {
    currentUser,
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    ROLES,
  } = useAuth();

  // Funciones helper para verificar roles específicos
  const isAdmin = () => {
    return hasAnyRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);
  };

  const isInstructor = () => {
    return hasRole(ROLES.INSTRUCTOR);
  };

  const isManager = () => {
    return hasRole(ROLES.MANAGER);
  };

  const isEmployee = () => {
    return hasRole(ROLES.EMPLOYEE);
  };

  const isSuperAdmin = () => {
    return hasRole(ROLES.SUPER_ADMIN);
  };

  // Funciones helper para verificar permisos específicos
  const canCreateCourse = () => {
    return hasPermission('courses.create');
  };

  const canEditCourse = () => {
    return hasPermission('courses.edit');
  };

  const canDeleteCourse = () => {
    return hasPermission('courses.delete');
  };

  const canViewReports = () => {
    return hasAnyPermission([
      'reports.viewAll',
      'reports.viewTeam',
      'reports.viewOwn',
    ]);
  };

  const canManageUsers = () => {
    return hasAnyPermission(['users.create', 'users.edit', 'users.delete']);
  };

  const canManageCourses = () => {
    return hasAnyPermission([
      'courses.create',
      'courses.edit',
      'courses.delete',
    ]);
  };

  return {
    // Datos del usuario
    currentUser,
    userRole,
    permissions,

    // Funciones de verificación genéricas
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,

    // Funciones de verificación de roles específicos
    isAdmin,
    isInstructor,
    isManager,
    isEmployee,
    isSuperAdmin,

    // Funciones de verificación de permisos específicos
    canCreateCourse,
    canEditCourse,
    canDeleteCourse,
    canViewReports,
    canManageUsers,
    canManageCourses,

    // Constantes
    ROLES,
  };
}
