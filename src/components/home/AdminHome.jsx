// ✅ CREAR: src/components/home/AdminHome.jsx

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    publishedCourses: 0,
  });
  const [setLoading] = useState(true);
  const { currentUser } = usePermissions();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Obtener estadísticas
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const coursesSnapshot = await getDocs(collection(db, 'courses'));

      const activeUsersQuery = query(
        collection(db, 'users'),
        where('isActive', '==', true)
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);

      const publishedCoursesQuery = query(
        collection(db, 'courses'),
        where('isPublished', '==', true)
      );
      const publishedCoursesSnapshot = await getDocs(publishedCoursesQuery);

      setStats({
        totalUsers: usersSnapshot.size,
        totalCourses: coursesSnapshot.size,
        activeUsers: activeUsersSnapshot.size,
        publishedCourses: publishedCoursesSnapshot.size,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-home">
        <div className="welcome-section">
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {currentUser?.displayName || currentUser?.email}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon users">👥</div>
            <div className="stat-content">
              <h3>Usuarios Totales</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <span className="stat-label">{stats.activeUsers} activos</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon courses">📚</div>
            <div className="stat-content">
              <h3>Cursos Totales</h3>
              <p className="stat-value">{stats.totalCourses}</p>
              <span className="stat-label">
                {stats.publishedCourses} publicados
              </span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon enrollments">📝</div>
            <div className="stat-content">
              <h3>Inscripciones</h3>
              <p className="stat-value">0</p>
              <span className="stat-label">Este mes</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon completion">✅</div>
            <div className="stat-content">
              <h3>Tasa Completación</h3>
              <p className="stat-value">0%</p>
              <span className="stat-label">Promedio general</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <Link to="/admin/usuarios" className="action-card">
              <span className="action-icon">👤</span>
              <span>Gestionar Usuarios</span>
            </Link>
            <Link to="/admin/cursos" className="action-card">
              <span className="action-icon">📖</span>
              <span>Gestionar Cursos</span>
            </Link>
            <Link to="/reportes" className="action-card">
              <span className="action-icon">📊</span>
              <span>Ver Reportes</span>
            </Link>
            <Link to="/admin/configuracion" className="action-card">
              <span className="action-icon">⚙️</span>
              <span>Configuración</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminHome;
