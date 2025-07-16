// ✅ CREAR: src/pages/CourseDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import {
  FaArrowLeft,
  FaBookOpen,
  FaClock,
  FaUsers,
  FaGraduationCap,
  FaCheckCircle,
  FaPlayCircle,
  FaSpinner,
} from 'react-icons/fa';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollmentStatus();
  }, [courseId, currentUser]);

  const fetchCourseDetails = async () => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        setCourse({ id: courseDoc.id, ...courseDoc.data() });
      } else {
        navigate('/dashboard/cursos');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!currentUser) return;

    try {
      const userEnrollment = await enrollmentService.getUserEnrollment(
        currentUser.uid,
        courseId
      );
      setEnrollment(userEnrollment);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const handleEnrollment = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enrollUserInCourse(currentUser.uid, courseId);
      alert('¡Te has inscrito exitosamente al curso!');
      checkEnrollmentStatus(); // Refresh enrollment status
    } catch (error) {
      alert(error.message || 'Error al inscribirse al curso');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartCourse = () => {
    navigate(`/dashboard/course/${courseId}`);
  };

  const getLevelLabel = (level) => {
    const labels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[level] || level;
  };

  const getTotalLessons = () => {
    return (
      course?.modules?.reduce(
        (total, module) => total + (module.lessons?.length || 0),
        0
      ) || 0
    );
  };

  if (loading) {
    return <div className="loading">Cargando detalles del curso...</div>;
  }

  if (!course) {
    return <div className="error">Curso no encontrado</div>;
  }

  return (
    <div className="course-details">
      <div className="course-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Volver
        </button>

        <div className="course-hero">
          <div className="hero-content">
            <div className="course-badges">
              <span className="category-badge">{course.category}</span>
              <span className="level-badge">{getLevelLabel(course.level)}</span>
            </div>

            <h1>{course.title}</h1>
            <p className="course-subtitle">{course.description}</p>

            <div className="course-stats">
              <div className="stat">
                <FaClock />
                <span>{course.duration} horas</span>
              </div>
              <div className="stat">
                <FaBookOpen />
                <span>{course.modules?.length || 0} módulos</span>
              </div>
              <div className="stat">
                <FaPlayCircle />
                <span>{getTotalLessons()} lecciones</span>
              </div>
              <div className="stat">
                <FaUsers />
                <span>{course.enrolledUsers?.length || 0} estudiantes</span>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            {enrollment ? (
              <div className="enrollment-info">
                <div className="enrollment-status">
                  <FaCheckCircle className="check-icon" />
                  <span>Ya estás inscrito</span>
                </div>
                <div className="progress-info">
                  <span>Progreso: {enrollment.progress}%</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  className="btn-start-course"
                  onClick={handleStartCourse}
                >
                  {enrollment.progress > 0
                    ? 'Continuar curso'
                    : 'Comenzar curso'}
                </button>
              </div>
            ) : (
              <div className="enrollment-actions">
                <div className="course-availability">
                  {course.enrolledUsers?.length >= course.maxStudents ? (
                    <span className="availability-warning">
                      Curso lleno ({course.maxStudents} estudiantes máximo)
                    </span>
                  ) : (
                    <span className="availability-info">
                      {course.maxStudents - (course.enrolledUsers?.length || 0)}{' '}
                      lugares disponibles
                    </span>
                  )}
                </div>

                <button
                  className="btn-enroll"
                  onClick={handleEnrollment}
                  disabled={
                    enrolling ||
                    course.enrolledUsers?.length >= course.maxStudents
                  }
                >
                  {enrolling ? (
                    <>
                      <FaSpinner className="spinner" />
                      Inscribiendo...
                    </>
                  ) : (
                    'Inscribirse al curso'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="content-main">
          <section className="course-overview">
            <h2>Descripción del curso</h2>
            <div className="overview-content">
              <p>{course.description}</p>

              <div className="course-details-grid">
                <div className="detail-item">
                  <h4>Instructor</h4>
                  <p>{course.instructorName || 'Por asignar'}</p>
                </div>
                <div className="detail-item">
                  <h4>Departamento</h4>
                  <p>{course.department}</p>
                </div>
                <div className="detail-item">
                  <h4>Duración</h4>
                  <p>{course.duration} horas</p>
                </div>
                <div className="detail-item">
                  <h4>Nivel</h4>
                  <p>{getLevelLabel(course.level)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="course-curriculum">
            <h2>Contenido del curso</h2>
            <div className="modules-list">
              {course.modules?.map((module, moduleIndex) => (
                <div key={moduleIndex} className="module-item">
                  <div className="module-header">
                    <h3>{module.title}</h3>
                    <div className="module-meta">
                      <span>{module.lessons?.length || 0} lecciones</span>
                      <span>{module.duration}h</span>
                    </div>
                  </div>
                  <p className="module-description">{module.description}</p>

                  {module.lessons && (
                    <div className="lessons-preview">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="lesson-preview">
                          <div className="lesson-info">
                            <span className="lesson-title">{lesson.title}</span>
                            <span className="lesson-duration">
                              {lesson.duration} min
                            </span>
                          </div>
                          <div className="lesson-type">
                            {lesson.type === 'video' && <FaPlayCircle />}
                            {lesson.type === 'document' && <FaBookOpen />}
                            {lesson.isRequired && (
                              <span className="required">Obligatorio</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(!course.modules || course.modules.length === 0) && (
              <div className="no-content">
                <p>El contenido del curso está siendo preparado.</p>
              </div>
            )}
          </section>
        </div>

        <div className="content-sidebar">
          <div className="sidebar-card">
            <h3>Información del curso</h3>
            <div className="course-info-list">
              <div className="info-item">
                <strong>Categoría:</strong>
                <span>{course.category}</span>
              </div>
              <div className="info-item">
                <strong>Nivel:</strong>
                <span>{getLevelLabel(course.level)}</span>
              </div>
              <div className="info-item">
                <strong>Duración:</strong>
                <span>{course.duration} horas</span>
              </div>
              <div className="info-item">
                <strong>Módulos:</strong>
                <span>{course.modules?.length || 0}</span>
              </div>
              <div className="info-item">
                <strong>Lecciones:</strong>
                <span>{getTotalLessons()}</span>
              </div>
              <div className="info-item">
                <strong>Estudiantes:</strong>
                <span>
                  {course.enrolledUsers?.length || 0}/{course.maxStudents}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
