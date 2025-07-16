// ✅ CREAR: src/pages/CoursesCatalog.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  FaBookOpen,
  FaClock,
  FaUsers,
  FaGraduationCap,
  FaSearch,
  FaFilter,
} from 'react-icons/fa';
import './CoursesCatalog.css';

const CoursesCatalog = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [userEnrollments, setUserEnrollments] = useState([]);

  const categories = ['Seguridad', 'IT', 'RRHH', 'Ventas', 'Marketing'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchCourses();
    fetchUserEnrollments();
  }, [currentUser]);

  const fetchCourses = async () => {
    try {
      const q = query(
        collection(db, 'courses'),
        where('isPublished', '==', true)
      );

      const coursesSnapshot = await getDocs(q);
      const coursesData = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollments = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, 'enrollmentId'),
        where('userId', '==', currentUser.uid)
      );

      const enrollmentsSnapshot = await getDocs(q);
      const enrollmentsData = enrollmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
    }
  };

  const isEnrolled = (courseId) => {
    return userEnrollments.some(
      (enrollment) => enrollment.courseId === courseId
    );
  };

  const getEnrollmentStatus = (courseId) => {
    const enrollment = userEnrollments.find((e) => e.courseId === courseId);
    return enrollment ? enrollment.status : null;
  };

  const getEnrollmentProgress = (courseId) => {
    const enrollment = userEnrollments.find((e) => e.courseId === courseId);
    return enrollment ? enrollment.progress : 0;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelLabel = (level) => {
    const labels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[level] || level;
  };

  if (loading) {
    return <div className="loading">Cargando catálogo de cursos...</div>;
  }

  return (
    <div className="courses-catalog">
      <div className="catalog-header">
        <div className="header-content">
          <h1>Catálogo de Cursos</h1>
          <p>Descubre y únete a nuestros cursos de capacitación</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <FaGraduationCap className="filter-icon" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Todos los niveles</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {getLevelLabel(level)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <div className="course-category">{course.category}</div>
              <div className="course-level">{getLevelLabel(course.level)}</div>
            </div>

            <div className="course-content">
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                <div className="meta-item">
                  <FaClock />
                  <span>{course.duration}h</span>
                </div>
                <div className="meta-item">
                  <FaUsers />
                  <span>{course.enrolledUsers?.length || 0} estudiantes</span>
                </div>
                <div className="meta-item">
                  <FaBookOpen />
                  <span>{course.modules?.length || 0} módulos</span>
                </div>
              </div>

              {isEnrolled(course.id) ? (
                <div className="enrollment-status">
                  <div className="status-info">
                    <span
                      className={`status-badge ${getEnrollmentStatus(course.id)}`}
                    >
                      {getEnrollmentStatus(course.id) === 'completed'
                        ? 'Completado'
                        : getEnrollmentStatus(course.id) === 'active'
                          ? 'En progreso'
                          : 'Inscrito'}
                    </span>
                    <span className="progress-text">
                      {getEnrollmentProgress(course.id)}% completado
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${getEnrollmentProgress(course.id)}%` }}
                    ></div>
                  </div>

                  <Link
                    to={`/dashboard/course/${course.id}`}
                    className="btn-continue"
                  >
                    {getEnrollmentStatus(course.id) === 'completed'
                      ? 'Revisar'
                      : 'Continuar'}
                  </Link>
                </div>
              ) : (
                <div className="course-actions">
                  <Link
                    to={`/dashboard/course-details/${course.id}`}
                    className="btn-view-details"
                  >
                    Ver detalles
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty-catalog">
          <div className="empty-content">
            <FaBookOpen className="empty-icon" />
            <h3>No se encontraron cursos</h3>
            <p>
              {searchTerm || selectedCategory || selectedLevel
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay cursos disponibles en el catálogo'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesCatalog;
