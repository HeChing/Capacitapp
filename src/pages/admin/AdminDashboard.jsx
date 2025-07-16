// ✅ ACTUALIZAR: src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import {
  FaUsers,
  FaBookOpen,
  FaChartLine,
  FaGraduationCap,
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeCourses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const totalCourses = coursesSnapshot.size;

        const activeCourses = coursesSnapshot.docs.filter(
          (doc) => doc.data().isPublished === true
        ).length;

        const enrollmentsSnapshot = await getDocs(
          collection(db, 'enrollments')
        );
        const totalEnrollments = enrollmentsSnapshot.size;

        setStats({
          totalUsers,
          totalCourses,
          totalEnrollments,
          activeCourses,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* ❌ REMOVER: dashboard-header duplicado */}

      {/* Bienvenida sin título duplicado */}
      <div className="welcome-message">
        <p>Bienvenido, {currentUser?.displayName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Usuarios</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon courses">
            <FaBookOpen />
          </div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Total Cursos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats.activeCourses}</h3>
            <p>Cursos Activos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon enrollments">
            <FaGraduationCap />
          </div>
          <div className="stat-content">
            <h3>{stats.totalEnrollments}</h3>
            <p>Inscripciones</p>
          </div>
        </div>
      </div>

      <div className="dashboard-widgets">
        <div className="widget">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">Hace 2 horas</span>
              <span className="activity-desc">Nuevo usuario registrado</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Hace 4 horas</span>
              <span className="activity-desc">Curso "Seguridad" publicado</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">Hace 1 día</span>
              <span className="activity-desc"> nuevas inscripciones</span>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3>Cursos Populares</h3>
          <div className="popular-courses">
            <div className="course-item">
              <span className="course-name">Introducción a la Seguridad</span>
              <span className="course-enrollments"> inscritos</span>
            </div>
            <div className="course-item">
              <span className="course-name">JavaScript Avanzado</span>
              <span className="course-enrollments"> inscritos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
