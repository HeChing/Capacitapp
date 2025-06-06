// ✅ CREAR: src/components/RoleProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RoleProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requireAll = false,
  redirectTo = '/inicio',
}) {
  const {
    currentUser,
    loading,
    hasAnyRole,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Cargando...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Verificar roles
  if (allowedRoles.length > 0) {
    const hasRequiredRole = hasAnyRole(allowedRoles);
    if (!hasRequiredRole) {
      return <Navigate to={redirectTo} />;
    }
  }

  // Verificar permisos
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      return <Navigate to={redirectTo} />;
    }
  }

  return children;
}

export default RoleProtectedRoute;
