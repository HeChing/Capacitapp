import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import { userService } from '../services/userService';
import {
  FaUser,
  FaToggleOn,
  FaToggleOff,
  FaUserShield,
  FaUserTie,
  FaUserFriends,
} from 'react-icons/fa';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { users: usersList, error: fetchError } =
        await userService.getAllUsers();
      if (fetchError) {
        setError(fetchError);
      } else {
        setUsers(usersList || []);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await userService.changeUserRole(userId, newRole);
      if (!error) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        alert('Error al cambiar el rol: ' + error);
      }
    } catch (err) {
      console.error('Error changing user role:', err);
      alert('Error al cambiar el rol: ' + err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const { error } = await userService.toggleUserStatus(
        userId,
        !currentStatus
      );
      if (!error) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isActive: !currentStatus } : user
          )
        );
      } else {
        alert('Error al cambiar el estado: ' + error);
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Error al cambiar el estado: ' + err.message);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield style={{ color: '#dc3545' }} />;
      case 'encargado':
        return <FaUserTie style={{ color: '#ffc107' }} />;
      case 'empleado':
        return <FaUserFriends style={{ color: '#28a745' }} />;
      default:
        return <FaUser />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: 'Administrador', class: 'badge-admin' },
      encargado: { text: 'Encargado', class: 'badge-encargado' },
      empleado: { text: 'Empleado', class: 'badge-empleado' },
    };
    return badges[role] || { text: 'Sin Rol', class: 'badge-default' };
  };

  const formatDate = (date) => {
    if (!date) return 'Nunca';

    try {
      // Si es un timestamp de Firestore
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
      }
      // Si es una fecha normal
      if (date instanceof Date) {
        return date.toLocaleDateString();
      }
      // Si es un string
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      return 'Fecha inválida';
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <p>Cargando usuarios...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={loadUsers}>Reintentar</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="user-management">
          <div className="page-header">
            <h2>Gestión de Usuarios</h2>
            <p>Administra roles y permisos de usuarios</p>
          </div>

          <div className="users-stats">
            <div className="stat-card">
              <FaUserShield />
              <div>
                <span>{users.filter((u) => u.role === 'admin').length}</span>
                <p>Administradores</p>
              </div>
            </div>
            <div className="stat-card">
              <FaUserTie />
              <div>
                <span>
                  {users.filter((u) => u.role === 'encargado').length}
                </span>
                <p>Encargados</p>
              </div>
            </div>
            <div className="stat-card">
              <FaUserFriends />
              <div>
                <span>{users.filter((u) => u.role === 'empleado').length}</span>
                <p>Empleados</p>
              </div>
            </div>
          </div>

          <div className="users-table-container">
            {users.length === 0 ? (
              <div className="no-users">
                <p>No hay usuarios registrados</p>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Última conexión</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const roleBadge = getRoleBadge(user.role);

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt={user.displayName}
                                />
                              ) : (
                                <FaUser />
                              )}
                            </div>
                            <div>
                              <strong>
                                {user.displayName || 'Sin nombre'}
                              </strong>
                              <small>
                                {user.department || 'Sin departamento'}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <div className="role-cell">
                            {getRoleIcon(user.role)}
                            <span className={`role-badge ${roleBadge.class}`}>
                              {roleBadge.text}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}
                          >
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>{formatDate(user.lastLogin)}</td>
                        <td>
                          <div className="action-buttons">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              className="role-select"
                            >
                              <option value="empleado">Empleado</option>
                              <option value="encargado">Encargado</option>
                              <option value="admin">Admin</option>
                            </select>

                            <button
                              onClick={() =>
                                handleToggleStatus(user.id, user.isActive)
                              }
                              className={`toggle-btn ${user.isActive ? 'active' : 'inactive'}`}
                              title={
                                user.isActive
                                  ? 'Desactivar usuario'
                                  : 'Activar usuario'
                              }
                            >
                              {user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RoleProtectedRoute>
  );
}

export default UserManagement;
