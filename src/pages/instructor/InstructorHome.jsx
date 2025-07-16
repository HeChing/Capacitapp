// ✅ ACTUALIZAR: src/pages/instructor/InstructorHome.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { FaBookOpen, FaUsers, FaChartLine, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './InstructorHome.css';

const InstructorHome = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    myCourses: 0,
    totalStudents: 0,
    activeCourses: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const coursesQuery = query(
          collection(db, 'courses'),
          where('instructorId', '==', currentUser.uid)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const courses = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const myCourses = courses.length;
        const activeCourses = courses.filter(
          (course) => course.isPublished
        ).length;
        const totalStudents = courses.reduce((total, course) => {
          return total + (course.enrolledUsers?.length || 0);
        }, 0);

        setStats({ myCourses, totalStudents, activeCourses });
        setRecentCourses(courses.slice(0, 3));
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchInstructorData();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="loading">Cargando datos del instructor...</div>;
  }

  return (
    <div className="instructor-home">
      {/* ❌ REMOVER: dashboard-header duplicado */}

      {/* Bienvenida sin título duplicado */}
      <div className="welcome-message">
        <p>Bienvenido, {currentUser?.displayName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon courses">
            <FaBookOpen />
          </div>
          <div className="stat-content">
            <h3>{stats.myCourses}</h3>
            <p>Mis Cursos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon students">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Estudiantes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats.activeCourses}</h3>
            <p>Cursos Activos</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link
          to="/dashboard/instructor/create-course"
          className="action-btn primary"
        >
          <FaPlus />
          Crear Nuevo Curso
        </Link>
        <Link
          to="/dashboard/instructor/classes"
          className="action-btn secondary"
        >
          <FaBookOpen />
          Ver Mis Clases
        </Link>
      </div>

      <div className="recent-courses">
        <h3>Mis Cursos Recientes</h3>
        {recentCourses.length > 0 ? (
          <div className="courses-grid">
            {recentCourses.map((course) => (
              <div key={course.id} className="course-card">
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span className="enrolled">
                    {course.enrolledUsers?.length || 0} inscritos
                  </span>
                  <span
                    className={`status ${course.isPublished ? 'published' : 'draft'}`}
                  >
                    {course.isPublished ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tienes cursos creados aún.</p>
            <Link
              to="/dashboard/instructor/create-course"
              className="action-btn primary"
            >
              Crear tu primer curso
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorHome;
