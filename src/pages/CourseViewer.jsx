// ✅ CREAR: src/pages/CourseViewer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import LessonViewer from '../components/course/LessonViewer';
import ProgressTracker from '../components/course/ProgressTracker';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
  FaPlay,
  FaLock,
} from 'react-icons/fa';
import './CourseViewer.css';

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId, currentUser]);

  const fetchCourseData = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      // Obtener datos del curso
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (!courseDoc.exists()) {
        navigate('/dashboard/mis-cursos');
        return;
      }

      const courseData = { id: courseDoc.id, ...courseDoc.data() };
      setCourse(courseData);

      // Verificar inscripción
      const userEnrollment = await enrollmentService.getUserEnrollment(
        currentUser.uid,
        courseId
      );
      if (!userEnrollment) {
        navigate(`/dashboard/course-details/${courseId}`);
        return;
      }

      setEnrollment(userEnrollment);
      setCurrentModule(userEnrollment.currentModule || 0);
      setCurrentLesson(userEnrollment.currentLesson || 0);
    } catch (error) {
      console.error('Error fetching course data:', error);
      navigate('/dashboard/mis-cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (moduleIndex, lessonIndex) => {
    try {
      const updatedEnrollment = await enrollmentService.updateLessonProgress(
        enrollment.id,
        moduleIndex,
        lessonIndex,
        true
      );
      setEnrollment(updatedEnrollment);

      // Auto-advance to next lesson
      const nextLesson = getNextLesson(moduleIndex, lessonIndex);
      if (nextLesson) {
        setCurrentModule(nextLesson.moduleIndex);
        setCurrentLesson(nextLesson.lessonIndex);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const getNextLesson = (moduleIndex, lessonIndex) => {
    if (!course?.modules) return null;

    const currentModuleData = course.modules[moduleIndex];

    // Next lesson in current module
    if (lessonIndex + 1 < currentModuleData.lessons?.length) {
      return { moduleIndex, lessonIndex: lessonIndex + 1 };
    }

    // First lesson of next module
    if (moduleIndex + 1 < course.modules.length) {
      return { moduleIndex: moduleIndex + 1, lessonIndex: 0 };
    }

    return null;
  };

  const getPreviousLesson = (moduleIndex, lessonIndex) => {
    // Previous lesson in current module
    if (lessonIndex > 0) {
      return { moduleIndex, lessonIndex: lessonIndex - 1 };
    }

    // Last lesson of previous module
    if (moduleIndex > 0) {
      const prevModule = course.modules[moduleIndex - 1];
      return {
        moduleIndex: moduleIndex - 1,
        lessonIndex: (prevModule.lessons?.length || 1) - 1,
      };
    }

    return null;
  };

  const isLessonCompleted = (moduleIndex, lessonIndex) => {
    const lessonKey = `${moduleIndex}-${lessonIndex}`;
    return enrollment?.completedLessons?.includes(lessonKey) || false;
  };

  const navigateToLesson = (moduleIndex, lessonIndex) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  if (loading) {
    return <div className="loading">Cargando curso...</div>;
  }

  if (!course || !enrollment) {
    return <div className="error">No se pudo cargar el curso</div>;
  }

  const currentModuleData = course.modules?.[currentModule];
  const currentLessonData = currentModuleData?.lessons?.[currentLesson];

  return (
    <div className="course-viewer">
      <div className="viewer-header">
        <button
          className="btn-back"
          onClick={() => navigate('/dashboard/mis-cursos')}
        >
          <FaArrowLeft />
          Mis cursos
        </button>

        <div className="course-info">
          <h1>{course.title}</h1>
          <div className="module-info">
            <span>
              Módulo {currentModule + 1}: {currentModuleData?.title}
            </span>
          </div>
        </div>

        <ProgressTracker course={course} enrollment={enrollment} />
      </div>

      <div className="viewer-content">
        <div className="lesson-sidebar">
          <div className="sidebar-content">
            <h3>Contenido del curso</h3>

            {course.modules?.map((module, moduleIndex) => (
              <div key={moduleIndex} className="module-section">
                <div
                  className={`module-header ${moduleIndex === currentModule ? 'active' : ''}`}
                >
                  <h4>{module.title}</h4>
                  <span className="module-progress">
                    {module.lessons?.filter((_, lessonIndex) =>
                      isLessonCompleted(moduleIndex, lessonIndex)
                    ).length || 0}
                    /{module.lessons?.length || 0}
                  </span>
                </div>

                <div className="lessons-list">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <button
                      key={lessonIndex}
                      className={`lesson-item ${
                        moduleIndex === currentModule &&
                        lessonIndex === currentLesson
                          ? 'active'
                          : ''
                      } ${isLessonCompleted(moduleIndex, lessonIndex) ? 'completed' : ''}`}
                      onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                    >
                      <div className="lesson-icon">
                        {isLessonCompleted(moduleIndex, lessonIndex) ? (
                          <FaCheckCircle className="completed-icon" />
                        ) : moduleIndex === currentModule &&
                          lessonIndex === currentLesson ? (
                          <FaPlay className="current-icon" />
                        ) : (
                          <FaBookOpen className="pending-icon" />
                        )}
                      </div>

                      <div className="lesson-details">
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-duration">
                          {lesson.duration} min
                        </span>
                      </div>

                      {lesson.isRequired && (
                        <span className="required-badge">Obligatorio</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-content">
          {currentLessonData ? (
            <LessonViewer
              lesson={currentLessonData}
              moduleIndex={currentModule}
              lessonIndex={currentLesson}
              isCompleted={isLessonCompleted(currentModule, currentLesson)}
              onComplete={() =>
                handleLessonComplete(currentModule, currentLesson)
              }
            />
          ) : (
            <div className="no-lesson">
              <FaLock />
              <h3>Lección no disponible</h3>
              <p>Esta lección aún no está disponible o no existe.</p>
            </div>
          )}
        </div>
      </div>

      <div className="lesson-navigation">
        <button
          className="btn-nav prev"
          onClick={() => {
            const prev = getPreviousLesson(currentModule, currentLesson);
            if (prev) navigateToLesson(prev.moduleIndex, prev.lessonIndex);
          }}
          disabled={!getPreviousLesson(currentModule, currentLesson)}
        >
          <FaArrowLeft />
          Lección anterior
        </button>

        <div className="lesson-progress">
          <span>
            Lección {currentLesson + 1} de{' '}
            {currentModuleData?.lessons?.length || 0}
          </span>
        </div>

        <button
          className="btn-nav next"
          onClick={() => {
            const next = getNextLesson(currentModule, currentLesson);
            if (next) navigateToLesson(next.moduleIndex, next.lessonIndex);
          }}
          disabled={!getNextLesson(currentModule, currentLesson)}
        >
          Siguiente lección
          <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
        </button>
      </div>
    </div>
  );
};

export default CourseViewer;
