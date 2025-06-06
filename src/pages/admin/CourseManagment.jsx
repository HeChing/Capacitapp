// ✅ CREAR: src/pages/admin/CourseManagement.jsx

import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PermissionGate from '../../hooks/PermissionGate';
import './CourseManagement.css';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    category: '',
    isPublished: false,
  });

  const { currentUser, isInstructor, hasPermission, ROLES } = usePermissions();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      let q;
      // Si es instructor, solo mostrar sus cursos
      if (isInstructor() && !hasPermission('courses.view')) {
        q = query(
          collection(db, 'courses'),
          where('instructorId', '==', currentUser.uid)
        );
      } else {
        q = collection(db, 'courses');
      }

      const coursesSnapshot = await getDocs(q);
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const courseData = {
        ...formData,
        instructorId: currentUser.uid,
        instructorName: currentUser.displayName || currentUser.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingCourse) {
        // Actualizar curso existente
        const courseRef = doc(db, 'courses', editingCourse.id);
        await updateDoc(courseRef, {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        alert('Curso actualizado correctamente');
      } else {
        // Crear nuevo curso
        await addDoc(collection(db, 'courses'), courseData);
        alert('Curso creado correctamente');
      }

      // Resetear formulario y recargar cursos
      setFormData({
        title: '',
        description: '',
        duration: '',
        level: 'beginner',
        category: '',
        isPublished: false,
      });
      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error al guardar el curso');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      category: course.category,
      isPublished: course.isPublished,
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        alert('Curso eliminado correctamente');
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error al eliminar el curso');
      }
    }
  };

  const handlePublishToggle = async (courseId, currentStatus) => {
    try {
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, {
        isPublished: !currentStatus,
        updatedAt: new Date().toISOString(),
      });
      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Error al actualizar el estado del curso');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Cargando cursos...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="course-management">
        <div className="header">
          <h1>Gestión de Cursos</h1>
          <PermissionGate permissions={['courses.create']}>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : 'Nuevo Curso'}
            </button>
          </PermissionGate>
        </div>

        {showForm && (
          <div className="course-form-container">
            <h2>{editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}</h2>
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-group">
                <label htmlFor="title">Título del Curso</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration">Duración (horas)</label>
                  <input
                    type="number"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="level">Nivel</label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                  >
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Categoría</label>
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPublished: e.target.checked,
                      })
                    }
                  />
                  Publicar inmediatamente
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingCourse ? 'Actualizar' : 'Crear'} Curso
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCourse(null);
                    setFormData({
                      title: '',
                      description: '',
                      duration: '',
                      level: 'beginner',
                      category: '',
                      isPublished: false,
                    });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3>{course.title}</h3>
                <span
                  className={`course-status ${course.isPublished ? 'published' : 'draft'}`}
                >
                  {course.isPublished ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              <p className="course-description">{course.description}</p>

              <div className="course-meta">
                <span>⏱️ {course.duration} horas</span>
                <span>📊 {course.level}</span>
                <span>🏷️ {course.category}</span>
              </div>

              <div className="course-instructor">
                <small>Instructor: {course.instructorName}</small>
              </div>

              <div className="course-actions">
                <PermissionGate
                  permissions={['courses.edit']}
                  fallback={
                    course.instructorId === currentUser.uid && (
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEdit(course)}
                      >
                        Editar
                      </button>
                    )
                  }
                >
                  <button
                    className="btn-small btn-edit"
                    onClick={() => handleEdit(course)}
                  >
                    Editar
                  </button>
                </PermissionGate>

                <PermissionGate permissions={['courses.publish']}>
                  <button
                    className={`btn-small ${course.isPublished ? 'btn-unpublish' : 'btn-publish'}`}
                    onClick={() =>
                      handlePublishToggle(course.id, course.isPublished)
                    }
                  >
                    {course.isPublished ? 'Despublicar' : 'Publicar'}
                  </button>
                </PermissionGate>

                <PermissionGate permissions={['courses.delete']}>
                  <button
                    className="btn-small btn-delete"
                    onClick={() => handleDelete(course.id)}
                  >
                    Eliminar
                  </button>
                </PermissionGate>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CourseManagement;
