// ✅ CREAR: src/components/home/InstructorHome.jsx

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import './InstructorHome.css';

function InstructorHome() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = usePermissions();

  useEffect(() => {
    if (currentUser) {
      fetchInstructorData();
    }
  }, [currentUser]);

  const fetchInstructorData = async () => {
    try {
      // Obtener cursos del instructor
      const instructorCoursesQuery = query(
        collection(db, 'courses'),
        where('instructorId', '==', currentUser.uid)
      );
      const coursesSnapshot = await getDocs(instructorCoursesQuery);
      const courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calcular estadísticas
      const publishedCourses = courses.filter((course) => course.isPublished);
      const totalStudents = courses.reduce(
        (sum, course) => sum + (course.enrolledUsers?.length || 0),
        0
      );

      setStats({
        totalCourses: courses.length,
        publishedCourses: publishedCourses.length,
        totalStudents: totalStudents,
        activeStudents: Math.floor(totalStudents * 0.7), // Simulado
      });

      // Obtener los 3 cursos más recientes
      const recent = courses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentCourses(recent);
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="instructor-home">
        <div className="welcome-section">
          <h1>Panel de Instructor</h1>
          <p>Bienvenido, {currentUser?.displayName || 'Instructor'}</p>
        </div>

        <div className="instructor-stats">
          <div className="stat-card">
            <div className="stat-icon courses">📚</div>
            <div className="stat-info">
              <h3>Mis Cursos</h3>
              <p className="stat-number">{stats.totalCourses}</p>
              <span className="stat-detail">
                {stats.publishedCourses} publicados
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon students">👥</div>
            <div className="stat-info">
              <h3>Total Estudiantes</h3>
              <p className="stat-number">{stats.totalStudents}</p>
              <span className="stat-detail">
                {stats.activeStudents} activos
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rating">⭐</div>
            <div className="stat-info">
              <h3>Calificación</h3>
              <p className="stat-number">4.8</p>
              <span className="stat-detail">Promedio general</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completion">📈</div>
            <div className="stat-info">
              <h3>Tasa Completación</h3>
              <p className="stat-number">78%</p>
              <span className="stat-detail">De tus cursos</span>
            </div>
          </div>
        </div>

        <div className="course-management-section">
          <div className="section-header">
            <h2>Mis Cursos Recientes</h2>
            <Link to="/admin/cursos" className="view-all-link">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="loading">Cargando cursos...</div>
          ) : recentCourses.length > 0 ? (
            <div className="recent-courses-grid">
              {recentCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <h3>{course.title}</h3>
                    <span
                      className={`course-badge ${course.isPublished ? 'published' : 'draft'}`}
                    >
                      {course.isPublished ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>

                  <p className="course-description">{course.description}</p>

                  <div className="course-metrics">
                    <div className="metric">
                      <span className="metric-icon">👥</span>
                      <span>
                        {course.enrolledUsers?.length || 0} estudiantes
                      </span>
                    </div>
                    <div className="metric">
                      <span className="metric-icon">⏱️</span>
                      <span>{course.duration} horas</span>
                    </div>
                  </div>

                  <div className="course-actions">
                    <Link
                      to={`/curso/${course.id}/editar`}
                      className="btn-action edit"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/curso/${course.id}/estudiantes`}
                      className="btn-action view"
                    >
                      Ver Estudiantes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No has creado ningún curso todavía</p>
              <Link to="/admin/cursos" className="btn-create-course">
                Crear Mi Primer Curso
              </Link>
            </div>
          )}
        </div>

        <div className="quick-actions-section">
          <h2>Acciones Rápidas</h2>
          <div className="quick-actions-grid">
            <Link to="/admin/cursos" className="quick-action">
              <span className="action-icon">➕</span>
              <span className="action-text">Crear Nuevo Curso</span>
            </Link>
            <Link to="/mis-estudiantes" className="quick-action">
              <span className="action-icon">👨‍🎓</span>
              <span className="action-text">Ver Estudiantes</span>
            </Link>
            <Link to="/calificaciones" className="quick-action">
              <span className="action-icon">📝</span>
              <span className="action-text">Calificaciones</span>
            </Link>
            <Link to="/reportes" className="quick-action">
              <span className="action-icon">📊</span>
              <span className="action-text">Mis Reportes</span>
            </Link>
          </div>
        </div>

        <div className="tips-section">
          <h2>💡 Consejos para Instructores</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>Mantén tu contenido actualizado</h4>
              <p>
                Revisa regularmente tus cursos y actualiza el contenido según
                sea necesario.
              </p>
            </div>
            <div className="tip-card">
              <h4>Interactúa con tus estudiantes</h4>
              <p>
                Responde preguntas y proporciona retroalimentación para mejorar
                el aprendizaje.
              </p>
            </div>
            <div className="tip-card">
              <h4>Analiza las métricas</h4>
              <p>
                Usa los reportes para entender qué funciona y qué puede mejorar
                en tus cursos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default InstructorHome;
