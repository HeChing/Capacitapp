// ✅ CREAR: src/pages/admin/AdminDashboard.jsx

import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const {
    currentUser,
    userRole,
    canManageUsers,
    canCreateCourse,
    canViewReports,
  } = usePermissions();

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {currentUser?.displayName || currentUser?.email}</p>
        <p>
          Tu rol: <span className="badge">{userRole}</span>
        </p>

        <div className="admin-cards">
          {canManageUsers() && (
            <Link to="/admin/usuarios" className="admin-card">
              <div className="card-icon">👥</div>
              <h3>Gestión de Usuarios</h3>
              <p>Administrar usuarios y roles</p>
            </Link>
          )}

          {canCreateCourse() && (
            <Link to="/admin/cursos" className="admin-card">
              <div className="card-icon">📚</div>
              <h3>Gestión de Cursos</h3>
              <p>Crear y administrar cursos</p>
            </Link>
          )}

          {canViewReports() && (
            <Link to="/reportes" className="admin-card">
              <div className="card-icon">📊</div>
              <h3>Reportes</h3>
              <p>Ver estadísticas y reportes</p>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
