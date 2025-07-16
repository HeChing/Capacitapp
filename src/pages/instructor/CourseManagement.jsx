// ✅ ACTUALIZAR: src/pages/instructor/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  or,
} from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import {
  FaEdit,
  FaPlus,
  FaEye,
  FaUsers,
  FaChartBar,
  FaClipboardList,
  FaCalendar,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './CourseManagement.css';

const InstructorCourseManagement = () => {
  const navigate = useNavigate();
  const { user, currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'published', 'draft'

  useEffect(() => {
    fetchInstructorCourses();
  }, [user, currentUser]);

  const fetchInstructorCourses = async () => {
    try {
      const userId = user?.uid || currentUser?.uid;

      // Obtener cursos donde el instructor es el creador O está asignado como instructor
      const coursesQuery = query(
        collection(db, 'courses'),
        or(
          where('createdBy', '==', userId),
          where('instructorId', '==', userId)
        )
      );

      const coursesSnapshot = await getDocs(coursesQuery);
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

  const handleEditCourse = (courseId) => {
    navigate(`/dashboard/instructor/courses/edit/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate('/dashboard/instructor/create-course');
  };

  const handleViewCourse = (courseId) => {
    navigate(`/dashboard/course-details/${courseId}`);
  };

  const handleViewStudents = (courseId) => {
    navigate(`/dashboard/instructor/course/${courseId}/students`);
  };

  const handleViewProgress = (courseId) => {
    navigate(`/dashboard/instructor/course/${courseId}/progress`);
  };

  const handleTogglePublish = async (courseId, isPublished) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        isPublished: !isPublished,
        updatedAt: new Date().toISOString(),
      });

      setCourses(
        courses.map((course) =>
          course.id === courseId
            ? { ...course, isPublished: !isPublished }
            : course
        )
      );

      alert(
        !isPublished
          ? 'Curso publicado exitosamente'
          : 'Curso despublicado exitosamente'
      );
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error al actualizar el estado del curso');
    }
  };

  // Filtrar cursos por búsqueda y tipo
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'published' && course.isPublished) ||
      (filterType === 'draft' && !course.isPublished);

    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.isPublished).length,
    students: courses.reduce(
      (acc, course) => acc + (course.enrolledUsers?.length || 0),
      0
    ),
  };

  if (loading) {
    return <div className="loading">Cargando tus cursos y clases...</div>;
  }

  return (
    <div className="course-management instructor-view">
      <div className="page-header">
        <h1>Mis Cursos y Clases</h1>
        {/* <p>Gestiona todos tus cursos y estudiantes en un solo lugar</p> */}
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCreateCourse}>
            <FaPlus />
            Crear Nuevo Curso
          </button>
        </div>
      </div>
      {/* 
      {/* Estadísticas */}
      {/* <div className="instructor-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total de Cursos</p>
        </div>
        <div className="stat-card">
          <h3>{stats.published}</h3>
          <p>Cursos Publicados</p>
        </div>
        <div className="stat-card">
          <h3>{stats.students}</h3>
          <p>Total de Estudiantes</p>
        </div>
      </div>  */}

      {/* Filtros y búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por título, categoría o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Todos ({courses.length})
          </button>
          <button
            className={`filter-btn ${filterType === 'published' ? 'active' : ''}`}
            onClick={() => setFilterType('published')}
          >
            Publicados ({stats.published})
          </button>
          <button
            className={`filter-btn ${filterType === 'draft' ? 'active' : ''}`}
            onClick={() => setFilterType('draft')}
          >
            Borradores ({courses.length - stats.published})
          </button>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.title}</h3>
              <span
                className={`status ${course.isPublished ? 'published' : 'draft'}`}
              >
                {course.isPublished ? 'Publicado' : 'Borrador'}
              </span>
            </div>

            <p className="course-description">{course.description}</p>

            <div className="course-meta">
              <span className="category">{course.category}</span>
              <span className="duration">
                <FaCalendar /> {course.duration}h
              </span>
              <span className="level">{course.level}</span>
            </div>

            <div className="course-stats">
              <div className="stat">
                <FaUsers />
                <span>{course.enrolledUsers?.length || 0} estudiantes</span>
              </div>
              {course.maxStudents && (
                <div className="stat">
                  <span>Límite: {course.maxStudents}</span>
                </div>
              )}
              <div className="stat">
                <span
                  className={
                    course.enrolledUsers?.length >= course.maxStudents
                      ? 'full'
                      : 'available'
                  }
                >
                  {course.enrolledUsers?.length >= course.maxStudents
                    ? 'Lleno'
                    : 'Disponible'}
                </span>
              </div>
            </div>

            <div className="course-actions">
              <button
                className="btn-action view"
                onClick={() => handleViewCourse(course.id)}
                title="Ver detalles del curso"
              >
                <FaEye />
                <span>Ver</span>
              </button>
              <button
                className="btn-action edit"
                onClick={() => handleEditCourse(course.id)}
                title="Editar curso"
              >
                <FaEdit />
                <span>Editar</span>
              </button>
              <button
                className="btn-action students"
                onClick={() => handleViewStudents(course.id)}
                title="Ver estudiantes"
              >
                <FaUsers />
                <span>Estudiantes</span>
              </button>
              <button
                className="btn-action progress"
                onClick={() => handleViewProgress(course.id)}
                title="Ver progreso"
              >
                <FaClipboardList />
                <span>Progreso</span>
              </button>
              <button
                className={`btn-action ${course.isPublished ? 'unpublish' : 'publish'}`}
                onClick={() =>
                  handleTogglePublish(course.id, course.isPublished)
                }
                title={course.isPublished ? 'Despublicar' : 'Publicar'}
              >
                {course.isPublished ? '📚' : '📖'}
                <span>{course.isPublished ? 'Despublicar' : 'Publicar'}</span>
              </button>
            </div>

            {/* Información adicional del curso */}
            <div className="course-footer">
              {course.createdBy === (user?.uid || currentUser?.uid) ? (
                <small className="course-ownership">
                  <span>✏️ Creado por ti</span>
                </small>
              ) : (
                <small className="course-ownership">
                  <span>👥 Asignado como instructor</span>
                </small>
              )}
              <small>
                {course.createdAt &&
                  `Creado: ${new Date(course.createdAt).toLocaleDateString()}`}
              </small>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-content">
            <h3>No se encontraron cursos</h3>
            <p>
              {searchTerm
                ? 'No hay cursos que coincidan con tu búsqueda.'
                : filterType !== 'all'
                  ? `No tienes cursos ${filterType === 'published' ? 'publicados' : 'en borrador'}.`
                  : 'Aún no tienes cursos creados o asignados.'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <button className="btn-primary" onClick={handleCreateCourse}>
                <FaPlus />
                Crear mi primer curso
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourseManagement;
