// ✅ ACTUALIZAR: src/pages/admin/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaUsers,
  FaUserPlus,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CourseManagement.css';

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
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
    navigate(`/dashboard/admin/courses/edit/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (
      window.confirm(
        '¿Estás seguro de eliminar este curso? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        setCourses(courses.filter((course) => course.id !== courseId));
        alert('Curso eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error al eliminar el curso');
      }
    }
  };

  const handleCreateCourse = () => {
    navigate('/dashboard/admin/courses/create-course');
  };

  const handleViewCourse = (courseId) => {
    navigate(`/dashboard/course-details/${courseId}`);
  };

  const handleManageEnrollments = (courseId = null) => {
    if (courseId) {
      navigate(`/dashboard/admin/enrollments?course=${courseId}`);
    } else {
      navigate('/dashboard/admin/enrollments');
    }
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
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Agregar búsqueda por instructor
  );

  if (loading) {
    return <div className="loading">Cargando cursos...</div>;
  }

  return (
    <div className="course-management">
      <div className="page-header">
        <h1>Gestión de Cursos</h1>
        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() => handleManageEnrollments()}
          >
            <FaUserPlus />
            Gestionar Inscripciones
          </button>
          <button className="btn-primary" onClick={handleCreateCourse}>
            <FaPlus />
            Crear Curso
          </button>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por título, categoría o instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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

            {/* ✅ AGREGAR: Información del instructor */}
            <div className="course-instructor">
              <small>
                <strong>Instructor:</strong>{' '}
                {course.instructorName || 'No asignado'}
              </small>
              {course.createdByRole && course.createdByRole === 'admin' && (
                <small className="admin-created">
                  <span>👑 Creado por Admin</span>
                </small>
              )}
            </div>

            <div className="course-meta">
              <span className="category">{course.category}</span>
              <span className="duration">{course.duration}h</span>
              <span className="level">{course.level}</span>
            </div>

            <div className="course-stats">
              <div className="stat">
                <FaUsers />
                <span>{course.enrolledUsers?.length || 0} inscritos</span>
              </div>
              {course.maxStudents && (
                <div className="stat">
                  <span>Max: {course.maxStudents}</span>
                </div>
              )}
            </div>

            <div className="course-actions">
              <button
                className="btn-action view"
                onClick={() => handleViewCourse(course.id)}
                title="Ver curso"
              >
                <FaEye />
              </button>
              <button
                className="btn-action edit"
                onClick={() => handleEditCourse(course.id)}
                title="Editar curso"
              >
                <FaEdit />
              </button>
              <button
                className="btn-action enroll"
                onClick={() => handleManageEnrollments(course.id)}
                title="Inscribir empleados a este curso"
              >
                <FaUserPlus />
              </button>
              <button
                className={`btn-action ${course.isPublished ? 'unpublish' : 'publish'}`}
                onClick={() =>
                  handleTogglePublish(course.id, course.isPublished)
                }
                title={course.isPublished ? 'Despublicar' : 'Publicar'}
              >
                {course.isPublished ? '❌' : '✅'}
              </button>
              <button
                className="btn-action delete"
                onClick={() => handleDeleteCourse(course.id)}
                title="Eliminar curso"
              >
                <FaTrash />
              </button>
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
                : 'Aún no hay cursos creados.'}
            </p>
            {!searchTerm && (
              <button className="btn-primary" onClick={handleCreateCourse}>
                <FaPlus />
                Crear primer curso
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
