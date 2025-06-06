// ✅ CREAR: src/components/PermissionGate.jsx

import { usePermissions } from './usePermissions';

function PermissionGate({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = null,
  showError = false,
}) {
  const { hasAnyPermission, hasAllPermissions, hasAnyRole } = usePermissions();

  // Verificar roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return showError ? (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          margin: '10px 0',
        }}
      >
        No tienes permisos para ver este contenido.
      </div>
    ) : (
      fallback
    );
  }

  // Verificar permisos
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasRequiredPermissions) {
      return showError ? (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            margin: '10px 0',
          }}
        >
          No tienes permisos para ver este contenido.
        </div>
      ) : (
        fallback
      );
    }
  }

  return children;
}

export default PermissionGate;
