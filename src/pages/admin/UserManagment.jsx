// ✅ CREAR: src/pages/admin/UserManagement.jsx

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { usePermissions } from '../hooks/usePermissions';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PermissionGate from '../hooks/PermissionGate';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const { ROLES } = usePermissions();
  // const { ROLES, hasPermission } = usePermissions();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });

      // Actualizar el estado local
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      setEditingUser(null);
      alert('Rol actualizado correctamente');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { isActive: !currentStatus });

      // Actualizar el estado local
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );

      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Cargando usuarios...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="user-management">
        <h1>Gestión de Usuarios</h1>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Departamento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName || 'Sin nombre'}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUser === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        onBlur={() => setEditingUser(null)}
                        autoFocus
                      >
                        {Object.entries(ROLES).map(([key, value]) => (
                          <option key={value} value={value}>
                            {key.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>{user.department || 'No asignado'}</td>
                  <td>
                    <span
                      className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}
                    >
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <PermissionGate permissions={['users.edit']}>
                        <button
                          className="btn-edit"
                          onClick={() => setEditingUser(user.id)}
                        >
                          Editar Rol
                        </button>
                      </PermissionGate>

                      <PermissionGate permissions={['users.edit']}>
                        <button
                          className={`btn-toggle ${user.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                          onClick={() =>
                            handleStatusToggle(user.id, user.isActive)
                          }
                        >
                          {user.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserManagement;
