// ✅ ACTUALIZAR: src/pages/MisCursos.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Link } from 'react-router-dom';
import {
  FaBookOpen,
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaChartLine,
} from 'react-icons/fa';
import './MisCursos.css';

const MisCursos = () => {
  const { currentUser } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    fetchUserCourses();
  }, [currentUser]);

  const fetchUserCourses = async () => {
    if (!currentUser) return;

    try {
      // Obtener inscripciones del usuario
      const userEnrollments = await enrollmentService.getUserEnrollments(
        currentUser.uid
      );
      setEnrollments(userEnrollments);

      // Obtener detalles de los cursos
      const courseIds = userEnrollments.map((e) => e.courseId);
      const coursesData = {};

      for (const courseId of courseIds) {
        const courseQuery = query(
          collection(db, 'courses'),
          where('__name__', '==', courseId)
        );
        const courseSnapshot = await getDocs(courseQuery);
        if (!courseSnapshot.empty) {
          coursesData[courseId] = {
            id: courseId,
            ...courseSnapshot.docs[0].data(),
          };
        }
      }

      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching user courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEnrollments = () => {
    switch (filter) {
      case 'active':
        return enrollments.filter((e) => e.status === 'active');
      case 'completed':
        return enrollments.filter((e) => e.status === 'completed');
      default:
        return enrollments;
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'active':
        return <FaPlay className="status-icon active" />;
      default:
        return <FaClock className="status-icon paused" />;
    }
  };

  if (loading) {
    return <div className="loading">Cargando tus cursos...</div>;
  }

  const filteredEnrollments = getFilteredEnrollments();

  return (
    <div className="mis-cursos-container">
      {' '}
      {/* CONTENEDOR PRINCIPAL AGREGADO */}
      <div className="mis-cursos-header">
        <h1>Mis Cursos</h1>
      </div>
      <div className="courses-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos ({enrollments.length})
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            En progreso (
            {enrollments.filter((e) => e.status === 'active').length})
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completados (
            {enrollments.filter((e) => e.status === 'completed').length})
          </button>
        </div>
      </div>
      {filteredEnrollments.length > 0 ? (
        <div className="courses-grid">
          {filteredEnrollments.map((enrollment) => {
            const course = courses[enrollment.courseId];
            if (!course) return null;

            return (
              <div key={enrollment.id} className="course-card">
                <div className="course-header">
                  <div className="course-status">
                    {getStatusIcon(enrollment.status)}
                    <span className={`status-text ${enrollment.status}`}>
                      {getStatusLabel(enrollment.status)}
                    </span>
                  </div>
                  <div className="course-category">{course.category}</div>
                </div>

                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>

                  <div className="course-progress">
                    <div className="progress-header">
                      <span>Progreso del curso</span>
                      <span className="progress-percentage">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="course-meta">
                    <div className="meta-item">
                      <FaBookOpen />
                      <span>{course.modules?.length || 0} módulos</span>
                    </div>
                    <div className="meta-item">
                      <FaClock />
                      <span>{course.duration}h total</span>
                    </div>
                    <div className="meta-item">
                      <FaGraduationCap />
                      <span>{course.level}</span>
                    </div>
                  </div>

                  <div className="course-stats">
                    <div className="stat">
                      <span className="stat-label">Lecciones completadas</span>
                      <span className="stat-value">
                        {enrollment.completedLessons?.length || 0}
                      </span>
                    </div>
                    {enrollment.status === 'completed' &&
                      enrollment.completedAt && (
                        <div className="stat">
                          <span className="stat-label">Completado el</span>
                          <span className="stat-value">
                            {new Date(
                              enrollment.completedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="course-actions">
                  <Link
                    to={`/dashboard/course/${course.id}`}
                    className="btn-continue"
                  >
                    {enrollment.status === 'completed' ? (
                      <>
                        <FaCheckCircle />
                        Revisar curso
                      </>
                    ) : (
                      <>
                        <FaPlay />
                        {enrollment.progress > 0 ? 'Continuar' : 'Comenzar'}
                      </>
                    )}
                  </Link>

                  <Link
                    to={`/dashboard/course-details/${course.id}`}
                    className="btn-details"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-courses">
          <div className="empty-content">
            <FaBookOpen className="empty-icon" />
            <h3>
              {filter === 'all'
                ? 'No tienes cursos inscritos'
                : filter === 'active'
                  ? 'No tienes cursos en progreso'
                  : 'No has completado ningún curso aún'}
            </h3>
            <p>
              {filter === 'all'
                ? 'Explora nuestro catálogo y comienza tu journey de aprendizaje'
                : filter === 'active'
                  ? 'Los cursos que estés estudiando aparecerán aquí'
                  : 'Los cursos completados aparecerán aquí'}
            </p>
            {filter === 'all' && (
              <Link to="/dashboard/cursos" className="btn-primary">
                <FaBookOpen />
                Explorar cursos
              </Link>
            )}
          </div>
        </div>
      )}
      {enrollments.length > 0 && (
        <div className="learning-summary">
          <h2>Resumen de aprendizaje</h2>
          <div className="summary-stats">
            <div className="summary-card">
              <div className="summary-icon">
                <FaBookOpen />
              </div>
              <div className="summary-content">
                <h3>{enrollments.length}</h3>
                <p>Cursos inscritos</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <FaChartLine />
              </div>
              <div className="summary-content">
                <h3>
                  {enrollments.filter((e) => e.status === 'active').length}
                </h3>
                <p>En progreso</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <FaCheckCircle />
              </div>
              <div className="summary-content">
                <h3>
                  {enrollments.filter((e) => e.status === 'completed').length}
                </h3>
                <p>Completados</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <FaClock />
              </div>
              <div className="summary-content">
                <h3>
                  {enrollments.reduce((total, enrollment) => {
                    const course = courses[enrollment.courseId];
                    return total + (course?.duration || 0);
                  }, 0)}
                  h
                </h3>
                <p>Horas de contenido</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCursos;
