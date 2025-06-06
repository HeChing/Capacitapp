// ✅ ACTUALIZAR: src/pages/MisCursos.jsx

import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { usePermissions } from '../hooks/usePermissions';
import DashboardLayout from '../components/layout/DashboardLayout';
import PermissionGate from '../hooks/PermissionGate';
import './MisCursos.css';

function MisCursos() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]); // Para instructores
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  const { currentUser, isAdmin, isInstructor, userRole, ROLES } =
    usePermissions();

  useEffect(() => {
    if (currentUser) {
      fetchCourses();
    }
  }, [currentUser, userRole]);

  const fetchCourses = async () => {
    if (!currentUser) return;

    try {
      // Si es admin o super admin, mostrar vista diferente
      if (isAdmin()) {
        await fetchAdminView();
      }
      // Si es instructor, mostrar sus cursos creados
      else if (isInstructor()) {
        await fetchInstructorView();
      }
      // Si es empleado o manager, mostrar cursos disponibles/inscritos
      else {
        await fetchEmployeeView();
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vista para administradores
  const fetchAdminView = async () => {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const allCourses = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(allCourses);
    setActiveTab('all'); // Tab especial para admins
  };

  // Vista para instructores
  const fetchInstructorView = async () => {
    // Cursos creados por el instructor
    const myCoursesQuery = query(
      collection(db, 'courses'),
      where('instructorId', '==', currentUser.uid)
    );
    const myCoursesSnapshot = await getDocs(myCoursesQuery);
    const instructorCourses = myCoursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMyCourses(instructorCourses);

    // También pueden ver cursos disponibles para inscribirse
    const availableQuery = query(
      collection(db, 'courses'),
      where('instructorId', '!=', currentUser.uid),
      where('isPublished', '==', true)
    );
    const availableSnapshot = await getDocs(availableQuery);
    const availableCourses = availableSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(availableCourses);
    setActiveTab('created'); // Tab por defecto para instructores
  };

  // Vista para empleados/managers
  const fetchEmployeeView = async () => {
    const coursesQuery = query(
      collection(db, 'courses'),
      where('isPublished', '==', true)
    );
    const coursesSnapshot = await getDocs(coursesQuery);
    const allCourses = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const userEnrolledCourses = allCourses.filter(
      (course) =>
        course.enrolledUsers && course.enrolledUsers.includes(currentUser.uid)
    );

    const availableCourses = allCourses.filter(
      (course) =>
        !course.enrolledUsers || !course.enrolledUsers.includes(currentUser.uid)
    );

    setCourses(availableCourses);
    setEnrolledCourses(userEnrolledCourses);
    setActiveTab('enrolled');
  };

  const handleEnrollment = async (courseId) => {
    try {
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, {
        enrolledUsers: arrayUnion(currentUser.uid),
      });

      alert('¡Te has inscrito exitosamente en el curso!');
      fetchCourses();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error al inscribirse en el curso');
    }
  };

  const handleUnenrollment = async (courseId) => {
    if (
      window.confirm('¿Estás seguro de que deseas cancelar tu inscripción?')
    ) {
      try {
        const courseRef = doc(db, 'courses', courseId);
        await updateDoc(courseRef, {
          enrolledUsers: arrayRemove(currentUser.uid),
        });

        alert('Has cancelado tu inscripción del curso');
        fetchCourses();
      } catch (error) {
        console.error('Error unenrolling from course:', error);
        alert('Error al cancelar la inscripción');
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Cargando cursos...</div>
      </DashboardLayout>
    );
  }

  // Vista para Administradores
  if (isAdmin()) {
    return (
      <DashboardLayout>
        <div className="mis-cursos">
          <h1>Gestión de Cursos - Vista Administrativa</h1>

          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total de Cursos</h3>
              <p className="stat-number">{courses.length}</p>
            </div>
            <div className="stat-card">
              <h3>Cursos Publicados</h3>
              <p className="stat-number">
                {courses.filter((c) => c.isPublished).length}
              </p>
            </div>
            <div className="stat-card">
              <h3>Cursos en Borrador</h3>
              <p className="stat-number">
                {courses.filter((c) => !c.isPublished).length}
              </p>
            </div>
          </div>

          <div className="admin-actions">
            <a href="/admin/cursos" className="btn-primary">
              Administrar Todos los Cursos
            </a>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card admin-view">
                <div
                  className={`course-status ${course.isPublished ? 'published' : 'draft'}`}
                >
                  {course.isPublished ? 'Publicado' : 'Borrador'}
                </div>
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <p>Instructor: {course.instructorName}</p>
                  <p>
                    Inscritos: {course.enrolledUsers?.length || 0} estudiantes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Vista para Instructores
  if (isInstructor()) {
    return (
      <DashboardLayout>
        <div className="mis-cursos">
          <h1>Mis Cursos - Panel de Instructor</h1>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'created' ? 'active' : ''}`}
              onClick={() => setActiveTab('created')}
            >
              Cursos Creados ({myCourses.length})
            </button>
            <button
              className={`tab ${activeTab === 'enrolled' ? 'active' : ''}`}
              onClick={() => setActiveTab('enrolled')}
            >
              Cursos Inscritos ({enrolledCourses.length})
            </button>
          </div>

          <div className="instructor-actions">
            <a href="/admin/cursos" className="btn-primary">
              Crear Nuevo Curso
            </a>
          </div>

          <div className="courses-container">
            {activeTab === 'created' ? (
              myCourses.length > 0 ? (
                <div className="courses-grid">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="course-card instructor-course"
                    >
                      <div
                        className={`course-status ${course.isPublished ? 'published' : 'draft'}`}
                      >
                        {course.isPublished ? 'Publicado' : 'Borrador'}
                      </div>
                      <h3>{course.title}</h3>
                      <p className="course-description">{course.description}</p>
                      <div className="course-stats">
                        <p>
                          👥 {course.enrolledUsers?.length || 0} estudiantes
                        </p>
                        <p>⏱️ {course.duration} horas</p>
                      </div>
                      <div className="course-actions">
                        <a
                          href={`/admin/cursos/edit/${course.id}`}
                          className="btn-edit"
                        >
                          Editar
                        </a>
                        <a
                          href={`/curso/${course.id}/students`}
                          className="btn-students"
                        >
                          Ver Estudiantes
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No has creado ningún curso todavía.</p>
                  <a href="/admin/cursos" className="btn-primary">
                    Crear mi primer curso
                  </a>
                </div>
              )
            ) : (
              // Tab de cursos en los que está inscrito el instructor
              <div className="courses-grid">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="course-card enrolled">
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-info">
                      <span>Instructor: {course.instructorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Vista normal para Empleados y Managers
  return (
    <DashboardLayout>
      <div className="mis-cursos">
        <h1>Mis Cursos</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveTab('enrolled')}
          >
            Mis Cursos ({enrolledCourses.length})
          </button>
          <button
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Cursos Disponibles ({courses.length})
          </button>
        </div>

        <div className="courses-container">
          {activeTab === 'enrolled' ? (
            enrolledCourses.length > 0 ? (
              <div className="courses-grid">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="course-card enrolled">
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.floor(Math.random() * 70) + 10}%`,
                          }}
                        />
                      </div>
                    </div>

                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>

                    <div className="course-info">
                      <span>⏱️ {course.duration} horas</span>
                      <span>📊 {course.level}</span>
                      <span>🏷️ {course.category}</span>
                    </div>

                    <div className="course-actions">
                      <button className="btn-continue">Continuar Curso</button>
                      <button
                        className="btn-unenroll"
                        onClick={() => handleUnenrollment(course.id)}
                      >
                        Cancelar Inscripción
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No estás inscrito en ningún curso actualmente.</p>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab('available')}
                >
                  Ver Cursos Disponibles
                </button>
              </div>
            )
          ) : courses.length > 0 ? (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-badge">Nuevo</div>

                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>

                  <div className="course-info">
                    <span>⏱️ {course.duration} horas</span>
                    <span>📊 {course.level}</span>
                    <span>🏷️ {course.category}</span>
                  </div>

                  <div className="course-instructor">
                    <small>Instructor: {course.instructorName}</small>
                  </div>

                  <button
                    className="btn-enroll"
                    onClick={() => handleEnrollment(course.id)}
                  >
                    Inscribirse
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay cursos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MisCursos;
