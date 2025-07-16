import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CreateCourse.css';

const CreateCourse = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  // Detectar si es admin
  const isAdmin =
    currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    department: '',
    maxStudents: 25,
    // Campo para admin - seleccionar instructor
    ...(isAdmin && {
      selectedInstructorId: '', // ID del instructor seleccionado
    }),
  });

  // ✅ AGREGAR: Fetch de instructores cuando es admin
  useEffect(() => {
    if (isAdmin) {
      fetchInstructors();
    }
  }, [isAdmin]);

  const fetchInstructors = async () => {
    setLoadingInstructors(true);
    try {
      // Consultar usuarios con rol instructor
      const instructorsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'instructor')
      );

      const instructorsSnapshot = await getDocs(instructorsQuery);
      const instructorsData = instructorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInstructors(instructorsData);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoadingInstructors(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Navegación según rol
  const handleCancel = () => {
    if (isAdmin) {
      navigate('/dashboard/admin/courses');
    } else {
      navigate('/dashboard/instructor/classes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ MODIFICAR: Lógica para obtener datos del instructor
      let instructorId = currentUser.uid;
      let instructorName = currentUser.displayName;

      // Si es admin y seleccionó un instructor
      if (isAdmin && formData.selectedInstructorId) {
        const selectedInstructor = instructors.find(
          (instructor) => instructor.id === formData.selectedInstructorId
        );

        if (selectedInstructor) {
          instructorId = selectedInstructor.id;
          instructorName =
            selectedInstructor.displayName ||
            selectedInstructor.firstName + ' ' + selectedInstructor.lastName;
        }
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        department: formData.department,
        maxStudents: formData.maxStudents,
        // Instructor asignado
        instructorId: instructorId,
        instructorName: instructorName,
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enrolledUsers: [],
        // Información del creador
        createdBy: currentUser.uid,
        createdByRole: currentUser.role,
        createdByName: currentUser.displayName,
      };

      await addDoc(collection(db, 'courses'), courseData);

      // Navegación según rol después de crear
      if (isAdmin) {
        navigate('/dashboard/admin/courses');
      } else {
        navigate('/dashboard/instructor/classes');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear el curso. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course">
      <div className="page-header">
        <h1>Crear Nuevo Curso</h1>
        <p>
          {isAdmin
            ? 'Completa la información para crear un curso (como administrador)'
            : 'Completa la información para crear tu curso'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="title">Título del Curso *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Liderazgo">Liderazgo</option>
              <option value="Comunicación">Comunicación</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Ventas">Ventas</option>
              <option value="Marketing">Marketing</option>
              <option value="Operaciones">Operaciones</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">Nivel *</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">Duración (horas) *</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              max="200"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxStudents">Máximo de Estudiantes</label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              value={formData.maxStudents}
              onChange={handleChange}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="department">Departamento</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Ej: Recursos Humanos, IT, Ventas..."
          />
        </div>

        {/* ✅ MODIFICAR: Selector de instructor para admin */}
        {isAdmin && (
          <div className="admin-section">
            <h3>Asignación de Instructor</h3>
            <div className="form-group">
              <label htmlFor="selectedInstructorId">Instructor Asignado</label>
              {loadingInstructors ? (
                <div className="loading-instructors">
                  Cargando instructores...
                </div>
              ) : (
                <select
                  id="selectedInstructorId"
                  name="selectedInstructorId"
                  value={formData.selectedInstructorId}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.displayName ||
                        `${instructor.firstName} ${instructor.lastName}` ||
                        instructor.email}
                    </option>
                  ))}
                </select>
              )}
              <small className="form-help">
                Si no seleccionas un instructor, te asignarás automáticamente
                como instructor del curso.
              </small>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Curso'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
