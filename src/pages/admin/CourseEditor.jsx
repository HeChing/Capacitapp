// ✅ CREAR: src/pages/admin/CourseEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import ModuleManager from '../../components/course/ModuleManager';
import {
  FaArrowLeft,
  FaSave,
  FaEye,
  FaPlus,
  FaCog,
  FaUsers,
  FaChartBar,
} from 'react-icons/fa';
import './CourseEditor.css';

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        setCourse({ id: courseDoc.id, ...courseDoc.data() });
      } else {
        console.error('Course not found');
        navigate('/admin/courses');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        ...course,
        updatedAt: new Date().toISOString(),
      });
      alert('Curso guardado exitosamente');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error al guardar el curso');
    } finally {
      setSaving(false);
    }
  };

  const updateCourseField = (field, value) => {
    setCourse((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="loading">Cargando curso...</div>;
  }

  if (!course) {
    return <div className="error">Curso no encontrado</div>;
  }

  return (
    <div className="course-editor">
      {/* Header */}
      <div className="editor-header">
        <div className="header-left">
          <button
            className="btn-back"
            onClick={() => navigate('/admin/courses')}
          >
            <FaArrowLeft />
            Volver
          </button>
          <div className="course-info">
            <h1>{course.title}</h1>
            <span
              className={`status ${course.isPublished ? 'published' : 'draft'}`}
            >
              {course.isPublished ? 'Publicado' : 'Borrador'}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-preview">
            <FaEye />
            Vista previa
          </button>
          <button
            className="btn-save"
            onClick={handleSaveCourse}
            disabled={saving}
          >
            <FaSave />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="editor-tabs">
        <button
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <FaPlus />
          Contenido
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog />
          Configuración
        </button>
        <button
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <FaUsers />
          Estudiantes
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FaChartBar />
          Analíticas
        </button>
      </div>

      {/* Content */}
      <div className="editor-content">
        {activeTab === 'content' && (
          <div className="content-tab">
            <div className="course-overview">
              <div className="overview-card">
                <h3>Información General</h3>
                <div className="form-group">
                  <label>Título del Curso</label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => updateCourseField('title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={course.description}
                    onChange={(e) =>
                      updateCourseField('description', e.target.value)
                    }
                    rows="4"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Categoría</label>
                    <select
                      value={course.category}
                      onChange={(e) =>
                        updateCourseField('category', e.target.value)
                      }
                    >
                      <option value="Seguridad">Seguridad</option>
                      <option value="IT">IT</option>
                      <option value="RRHH">RRHH</option>
                      <option value="Ventas">Ventas</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nivel</label>
                    <select
                      value={course.level}
                      onChange={(e) =>
                        updateCourseField('level', e.target.value)
                      }
                    >
                      <option value="beginner">Principiante</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duración (horas)</label>
                    <input
                      type="number"
                      value={course.duration}
                      onChange={(e) =>
                        updateCourseField('duration', Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <ModuleManager course={course} onUpdateCourse={setCourse} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="settings-card">
              <h3>Configuración del Curso</h3>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={course.isPublished}
                    onChange={(e) =>
                      updateCourseField('isPublished', e.target.checked)
                    }
                  />
                  Publicar curso
                </label>
              </div>
              <div className="form-group">
                <label>Máximo de estudiantes</label>
                <input
                  type="number"
                  value={course.maxStudents}
                  onChange={(e) =>
                    updateCourseField('maxStudents', Number(e.target.value))
                  }
                />
              </div>
              <div className="form-group">
                <label>Departamento</label>
                <input
                  type="text"
                  value={course.department}
                  onChange={(e) =>
                    updateCourseField('department', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="students-tab">
            <div className="students-card">
              <h3>Estudiantes Inscritos</h3>
              <p>Total: {course.enrolledUsers?.length || 0} estudiantes</p>
              {/* Aquí puedes agregar la lista de estudiantes */}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="analytics-card">
              <h3>Analíticas del Curso</h3>
              <p>Estadísticas de progreso y completitud</p>
              {/* Aquí puedes agregar gráficos y estadísticas */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditor;
