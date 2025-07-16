// ✅ CREAR: src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { FaEdit, FaTrash, FaUserPlus, FaSearch } from 'react-icons/fa';
import './UserManagement.css';

const UserManagement = () => {
  const { ROLES } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !isActive,
        updatedAt: new Date().toISOString(),
      });

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive: !isActive } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn-primary">
          <FaUserPlus />
          Agregar Usuario
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="role-filter"
        >
          <option value="all">Todos los roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Administrador</option>
          <option value="instructor">Instructor</option>
          <option value="manager">Manager</option>
          <option value="employee">Empleado</option>
        </select>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                    <span>{user.displayName || 'Sin nombre'}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="employee">Empleado</option>
                    <option value="instructor">Instructor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrador</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td>{user.department || 'Sin asignar'}</td>
                <td>
                  <span
                    className={`status ${user.isActive ? 'active' : 'inactive'}`}
                  >
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-action edit" title="Editar">
                      <FaEdit />
                    </button>
                    <button
                      className={`btn-action ${user.isActive ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      title={user.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {user.isActive ? '❌' : '✅'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
