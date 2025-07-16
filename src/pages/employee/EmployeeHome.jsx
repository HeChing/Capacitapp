// ✅ ACTUALIZAR: src/pages/employee/EmployeeHome.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { enrollmentService } from '../../services/enrollmentService';
import {
  FaBookOpen,
  FaTrophy,
  FaChartLine,
  FaClock,
  FaPlay,
  FaEye,
  FaGraduationCap,
  FaArrowRight,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './EmployeeHome.css';

const EmployeeHome = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchEmployeeData();
    }
  }, [currentUser]);

  const fetchEmployeeData = async () => {
    try {
      // ✅ CORREGIR: Usar la colección correcta 'enrollmentId'
      const enrollments = await enrollmentService.getUserEnrollments(
        currentUser.uid
      );

      // Obtener información detallada de los cursos inscritos
      const coursePromises = enrollments.map(async (enrollment) => {
        try {
          const courseDoc = await getDoc(
            doc(db, 'courses', enrollment.courseId)
          );
          if (courseDoc.exists()) {
            return {
              ...enrollment,
              courseData: { id: courseDoc.id, ...courseDoc.data() },
            };
          }
          return null;
        } catch (error) {
          console.error('Error fetching course:', error);
          return null;
        }
      });

      const coursesWithData = (await Promise.all(coursePromises)).filter(
        Boolean
      );

      // Calcular estadísticas reales
      const enrolledCourses = enrollments.length;
      const completedCourses = enrollments.filter(
        (e) => e.status === 'completed'
      ).length;
      const inProgressCourses = enrollments.filter(
        (e) => e.status === 'active'
      ).length;

      // ✅ CORREGIR: Calcular horas totales basándose en cursos reales
      const totalHours = coursesWithData.reduce((total, enrollment) => {
        return total + (enrollment.courseData?.duration || 0);
      }, 0);

      setStats({
        enrolledCourses,
        completedCourses,
        inProgressCourses,
        totalHours,
      });

      // ✅ AGREGAR: Obtener cursos recientes (en progreso o completados recientemente)
      const recent = coursesWithData
        .filter(
          (enrollment) =>
            enrollment.status === 'active' || enrollment.status === 'completed'
        )
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
        .slice(0, 3);

      setRecentCourses(recent);

      // ✅ AGREGAR: Obtener cursos recomendados (publicados, no inscritos)
      await fetchRecommendedCourses(enrollments.map((e) => e.courseId));
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedCourses = async (enrolledCourseIds) => {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('isPublished', '==', true)
      );
      const coursesSnapshot = await getDocs(coursesQuery);

      const availableCourses = coursesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((course) => !enrolledCourseIds.includes(course.id))
        .slice(0, 4); // Mostrar solo 4 recomendados

      setRecommendedCourses(availableCourses);
    } catch (error) {
      console.error('Error fetching recommended courses:', error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'En progreso',
      completed: 'Completado',
      paused: 'Pausado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="loading">Cargando tu progreso...</div>;
  }

  return (
    <div className="employee-home">
      <div className="dashboard-header">
        <h1>Mi Área de Aprendizaje</h1>
        <p>Bienvenido, {currentUser?.displayName}</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon enrolled">
            <FaBookOpen />
          </div>
          <div className="stat-content">
            <h3>{stats.enrolledCourses}</h3>
            <p>Cursos Inscritos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <FaTrophy />
          </div>
          <div className="stat-content">
            <h3>{stats.completedCourses}</h3>
            <p>Completados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats.inProgressCourses}</h3>
            <p>En Progreso</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hours">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{stats.totalHours}h</h3>
            <p>Horas de Contenido</p>
          </div>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="dashboard-actions">
        <Link to="/dashboard/mis-cursos" className="action-btn primary">
          <FaBookOpen />
          Ver Mis Cursos
        </Link>
        <Link to="/dashboard/cursos" className="action-btn secondary">
          <FaEye />
          Explorar Catálogo
        </Link>
        <Link to="/dashboard/logros" className="action-btn secondary">
          <FaTrophy />
          Ver Logros
        </Link>
      </div>

      {/* ✅ AGREGAR: Sección de cursos recientes */}
      {recentCourses.length > 0 && (
        <div className="recent-courses-section">
          <div className="section-header">
            <h3>Continúa tu aprendizaje</h3>
            <Link to="/dashboard/mis-cursos" className="view-all-link">
              Ver todos
              <FaArrowRight />
            </Link>
          </div>

          <div className="courses-preview">
            {recentCourses.map((enrollment) => (
              <div key={enrollment.id} className="course-preview-card">
                <div className="course-header">
                  <h4>{enrollment.courseData.title}</h4>
                  <span className={`status-badge ${enrollment.status}`}>
                    {getStatusLabel(enrollment.status)}
                  </span>
                </div>

                <p className="course-description">
                  {enrollment.courseData.description}
                </p>

                <div className="course-progress">
                  <div className="progress-info">
                    <span>Progreso: {enrollment.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="course-meta">
                  <span className="meta-item">
                    <FaClock />
                    {enrollment.courseData.duration}h
                  </span>
                  <span className="meta-item">
                    <FaGraduationCap />
                    {enrollment.courseData.level}
                  </span>
                </div>

                <Link
                  to={`/dashboard/course/${enrollment.courseData.id}`}
                  className="btn-continue-course"
                >
                  <FaPlay />
                  {enrollment.status === 'completed' ? 'Revisar' : 'Continuar'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ AGREGAR: Cursos recomendados */}
      {recommendedCourses.length > 0 && (
        <div className="recommended-courses-section">
          <div className="section-header">
            <h3>Cursos recomendados para ti</h3>
            <Link to="/dashboard/cursos" className="view-all-link">
              Ver catálogo completo
              <FaArrowRight />
            </Link>
          </div>

          <div className="courses-grid">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="recommended-course-card">
                <div className="course-category">{course.category}</div>
                <h4>{course.title}</h4>
                <p className="course-description">{course.description}</p>

                <Link
                  to={`/dashboard/course-details/${course.id}`}
                  className="btn-view-course"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progreso general */}
      <div className="progress-section">
        <h3>Mi Progreso General</h3>
        <div className="progress-overview">
          <div className="progress-item">
            <span className="progress-label">Cursos Completados</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${stats.enrolledCourses > 0 ? (stats.completedCourses / stats.enrolledCourses) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span className="progress-percentage">
              {stats.enrolledCourses > 0
                ? Math.round(
                    (stats.completedCourses / stats.enrolledCourses) * 100
                  )
                : 0}
              %
            </span>
          </div>

          {stats.enrolledCourses === 0 && (
            <div className="no-courses-message">
              <FaBookOpen className="empty-icon" />
              <h4>¡Comienza tu journey de aprendizaje!</h4>
              <p>
                Aún no tienes cursos inscritos. Explora nuestro catálogo y
                encuentra cursos perfectos para ti.
              </p>
              <Link to="/dashboard/cursos" className="btn-explore">
                <FaEye />
                Explorar Cursos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
