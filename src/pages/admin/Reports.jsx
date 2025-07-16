// ✅ CORREGIR: src/pages/admin/Reports.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
// Cambiar esta línea:
// import { FaDownload, FaChart, FaUsers, FaBook } from 'react-icons/fa';
// Por esta:
import { FaDownload, FaChartBar, FaUsers, FaBook } from 'react-icons/fa';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState({
    userStats: {},
    courseStats: {},
    enrollmentStats: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // Obtener estadísticas de usuarios
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map((doc) => doc.data());

      const userStats = {
        total: users.length,
        byRole: users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {}),
        active: users.filter((user) => user.isActive).length,
      };

      // Obtener estadísticas de cursos
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs.map((doc) => doc.data());

      const courseStats = {
        total: courses.length,
        published: courses.filter((course) => course.isPublished).length,
        byCategory: courses.reduce((acc, course) => {
          acc[course.category] = (acc[course.category] || 0) + 1;
          return acc;
        }, {}),
      };

      // Obtener estadísticas de inscripciones
      const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
      const enrollments = enrollmentsSnapshot.docs.map((doc) => doc.data());

      const enrollmentStats = {
        total: enrollments.length,
        completed: enrollments.filter((e) => e.status === 'completed').length,
        active: enrollments.filter((e) => e.status === 'active').length,
      };

      setReportData({ userStats, courseStats, enrollmentStats });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    // Lógica para exportar reportes
    console.log(`Exportando reporte: ${type}`);
  };

  if (loading) {
    return <div className="loading">Generando reportes...</div>;
  }

  return (
    <div className="reports">
      <div className="page-header">
        <h1>Reportes y Estadísticas</h1>
        <div className="export-buttons">
          <button onClick={() => exportReport('users')} className="btn-export">
            <FaDownload />
            Exportar Usuarios
          </button>
          <button
            onClick={() => exportReport('courses')}
            className="btn-export"
          >
            <FaDownload />
            Exportar Cursos
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {/* Estadísticas de Usuarios */}
        <div className="report-card">
          <div className="report-header">
            <FaUsers />
            <h3>Estadísticas de Usuarios</h3>
          </div>
          <div className="report-content">
            <div className="stat-item">
              <span className="stat-label">Total Usuarios:</span>
              <span className="stat-value">{reportData.userStats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Usuarios Activos:</span>
              <span className="stat-value">{reportData.userStats.active}</span>
            </div>
            <div className="roles-breakdown">
              <h4>Por Rol:</h4>
              {Object.entries(reportData.userStats.byRole || {}).map(
                ([role, count]) => (
                  <div key={role} className="role-stat">
                    <span>{role}:</span>
                    <span>{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas de Cursos */}
        <div className="report-card">
          <div className="report-header">
            <FaBook />
            <h3>Estadísticas de Cursos</h3>
          </div>
          <div className="report-content">
            <div className="stat-item">
              <span className="stat-label">Total Cursos:</span>
              <span className="stat-value">{reportData.courseStats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cursos Publicados:</span>
              <span className="stat-value">
                {reportData.courseStats.published}
              </span>
            </div>
            <div className="categories-breakdown">
              <h4>Por Categoría:</h4>
              {Object.entries(reportData.courseStats.byCategory || {}).map(
                ([category, count]) => (
                  <div key={category} className="category-stat">
                    <span>{category}:</span>
                    <span>{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas de Inscripciones */}
        <div className="report-card">
          <div className="report-header">
            {/* Cambiar FaChart por FaChartBar */}
            <FaChartBar />
            <h3>Estadísticas de Inscripciones</h3>
          </div>
          <div className="report-content">
            <div className="stat-item">
              <span className="stat-label">Total Inscripciones:</span>
              <span className="stat-value">
                {reportData.enrollmentStats.total}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completadas:</span>
              <span className="stat-value">
                {reportData.enrollmentStats.completed}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">En Progreso:</span>
              <span className="stat-value">
                {reportData.enrollmentStats.active}
              </span>
            </div>
            <div className="completion-rate">
              <span className="stat-label">Tasa de Finalización:</span>
              <span className="stat-value">
                {reportData.enrollmentStats.total > 0
                  ? Math.round(
                      (reportData.enrollmentStats.completed /
                        reportData.enrollmentStats.total) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
