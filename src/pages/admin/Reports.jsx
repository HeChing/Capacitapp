// ✅ CREAR: src/pages/admin/Reports.jsx

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PermissionGate from '../../hooks/PermissionGate';
import './Reports.css';

function Reports() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    completionRate: 0,
    usersByRole: {},
    coursesByCategory: {},
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const { hasPermission, isManager, currentUser } = usePermissions();

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      // Obtener usuarios
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Obtener cursos
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calcular estadísticas
      const usersByRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const coursesByCategory = courses.reduce((acc, course) => {
        acc[course.category] = (acc[course.category] || 0) + 1;
        return acc;
      }, {});

      // Si es manager, filtrar solo su equipo
      let filteredUsers = users;
      if (isManager() && !hasPermission('reports.viewAll')) {
        filteredUsers = users.filter(
          (user) => user.managerId === currentUser.uid
        );
      }

      setStats({
        totalUsers: filteredUsers.length,
        totalCourses: courses.filter((c) => c.isPublished).length,
        totalEnrollments: Math.floor(Math.random() * 500) + 100, // Simulado
        completionRate: Math.floor(Math.random() * 30) + 60, // Simulado
        usersByRole,
        coursesByCategory,
        recentActivity: generateRecentActivity(), // Simulado
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = () => {
    return [
      {
        id: 1,
        user: 'Juan Pérez',
        action: 'completó',
        item: 'Introducción a React',
        date: '2024-01-15',
      },
      {
        id: 2,
        user: 'María García',
        action: 'se inscribió en',
        item: 'Firebase Avanzado',
        date: '2024-01-14',
      },
      {
        id: 3,
        user: 'Carlos López',
        action: 'completó',
        item: 'Seguridad Web',
        date: '2024-01-13',
      },
      {
        id: 4,
        user: 'Ana Martínez',
        action: 'comenzó',
        item: 'Node.js Básico',
        date: '2024-01-12',
      },
      {
        id: 5,
        user: 'Luis Rodríguez',
        action: 'obtuvo certificado en',
        item: 'JavaScript ES6',
        date: '2024-01-11',
      },
    ];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Cargando reportes...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="reports">
        <div className="reports-header">
          <h1>Reportes y Estadísticas</h1>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
        </div>

        {/* Tarjetas de estadísticas principales */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Usuarios</h3>
              <p className="stat-number">{stats.totalUsers}</p>
              <span className="stat-change positive">+12% vs mes anterior</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Cursos Activos</h3>
              <p className="stat-number">{stats.totalCourses}</p>
              <span className="stat-change positive">+3 nuevos</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>Inscripciones</h3>
              <p className="stat-number">{stats.totalEnrollments}</p>
              <span className="stat-change positive">+25% vs mes anterior</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Tasa de Completación</h3>
              <p className="stat-number">{stats.completionRate}%</p>
              <span className="stat-change negative">-2% vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* Gráficos y tablas */}
        <div className="reports-content">
          <div className="report-section">
            <h2>Distribución por Roles</h2>
            <div className="role-distribution">
              {Object.entries(stats.usersByRole).map(([role, count]) => (
                <div key={role} className="role-bar">
                  <span className="role-label">{role}</span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="role-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="report-section">
            <h2>Cursos por Categoría</h2>
            <div className="category-grid">
              {Object.entries(stats.coursesByCategory).map(
                ([category, count]) => (
                  <div key={category} className="category-card">
                    <h4>{category}</h4>
                    <p className="category-count">{count} cursos</p>
                  </div>
                )
              )}
            </div>
          </div>

          <PermissionGate permissions={['reports.viewAll', 'reports.viewTeam']}>
            <div className="report-section">
              <h2>Actividad Reciente</h2>
              <div className="activity-table">
                <table>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Acción</th>
                      <th>Curso</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.map((activity) => (
                      <tr key={activity.id}>
                        <td>{activity.user}</td>
                        <td>{activity.action}</td>
                        <td>{activity.item}</td>
                        <td>{new Date(activity.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PermissionGate>

          <div className="export-section">
            <PermissionGate permissions={['reports.export']}>
              <button className="btn-export">
                📊 Exportar Reporte Completo
              </button>
            </PermissionGate>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
