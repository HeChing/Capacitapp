// ✅ CREAR: src/components/home/EmployeeHome.jsx

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import './EmployeeHome.css';

function EmployeeHome() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = usePermissions();

  useEffect(() => {
    if (currentUser) {
      fetchEnrolledCourses();
    }
  }, [currentUser]);

  const fetchEnrolledCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (course) =>
            course.enrolledUsers &&
            course.enrolledUsers.includes(currentUser.uid)
        )
        .slice(0, 3); // Solo mostrar los primeros 3

      setEnrolledCourses(courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="employee-home">
        <div className="welcome-section">
          <h1>¡Bienvenido a CapacitApp!</h1>
          <p>
            Hola {currentUser?.displayName || 'Usuario'}, continúa tu
            aprendizaje
          </p>
        </div>

        <div className="progress-overview">
          <h2>Tu Progreso</h2>
          <div className="progress-stats">
            <div className="progress-item">
              <span className="progress-label">Cursos Activos</span>
              <span className="progress-value">{enrolledCourses.length}</span>
            </div>
            <div className="progress-item">
              <span className="progress-label">Horas Completadas</span>
              <span className="progress-value">0</span>
            </div>
            <div className="progress-item">
              <span className="progress-label">Certificados</span>
              <span className="progress-value">0</span>
            </div>
          </div>
        </div>

        <div className="current-courses">
          <div className="section-header">
            <h2>Cursos en Progreso</h2>
            <Link to="/cursos" className="view-all">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <p>Cargando cursos...</p>
          ) : enrolledCourses.length > 0 ? (
            <div className="courses-preview">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="course-preview-card">
                  <h3>{course.title}</h3>
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
                  <button className="btn-continue-course">Continuar</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-courses">
              <p>No estás inscrito en ningún curso</p>
              <Link to="/cursos" className="btn-primary">
                Explorar Cursos
              </Link>
            </div>
          )}
        </div>

        <div className="quick-links">
          <h2>Acceso Rápido</h2>
          <div className="links-grid">
            <Link to="/cursos" className="quick-link-card">
              <span className="link-icon">📚</span>
              <span>Mis Cursos</span>
            </Link>
            <Link to="/logros" className="quick-link-card">
              <span className="link-icon">🏆</span>
              <span>Mis Logros</span>
            </Link>
            <Link to="/certificados" className="quick-link-card">
              <span className="link-icon">📜</span>
              <span>Certificados</span>
            </Link>
            <Link to="/ayuda" className="quick-link-card">
              <span className="link-icon">❓</span>
              <span>Ayuda</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeHome;
