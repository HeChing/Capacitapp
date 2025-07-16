// ✅ CREAR: src/pages/admin/EnrollmentManagement.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { enrollmentService } from '../../services/enrollmentService';
import {
  FaUserPlus,
  FaUsers,
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaChartLine,
} from 'react-icons/fa';
import './EnrollmentManagement.css';

const EnrollmentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Obtener todos los cursos
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);

      // Obtener todos los usuarios (solo empleados)
      const usersQuery = query(
        collection(db, 'users'),
        where('role', 'in', ['employee', 'manager'])
      );
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

      // Obtener todas las inscripciones
      const enrollmentsSnapshot = await getDocs(collection(db, 'enrollmentId'));
      const enrollmentsData = enrollmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkEnroll = async (courseId, userIds) => {
    const results = [];
    for (const userId of userIds) {
      try {
        await enrollmentService.enrollUserInCourse(userId, courseId);
        results.push({ userId, success: true });
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }

    // Refresh data
    fetchInitialData();
    return results;
  };

  const getCourseEnrollments = (courseId) => {
    return enrollments.filter((e) => e.courseId === courseId);
  };

  const getUserEnrollments = (userId) => {
    return enrollments.filter((e) => e.userId === userId);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = selectedCourse
    ? courses.filter((course) => course.id === selectedCourse)
    : courses;

  if (loading) {
    return <div className="loading">Cargando gestión de inscripciones...</div>;
  }

  return (
    <div className="enrollment-management">
      <div className="page-header">
        <h1>Gestión de Inscripciones</h1>
        <button
          className="btn-primary"
          onClick={() => setShowEnrollModal(true)}
        >
          <FaUserPlus />
          Inscribir Empleados
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <FaFilter />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vista por Cursos */}
      <div className="courses-enrollment-view">
        <h2>Inscripciones por Curso</h2>
        <div className="courses-grid">
          {filteredCourses.map((course) => {
            const courseEnrollments = getCourseEnrollments(course.id);
            const completedCount = courseEnrollments.filter(
              (e) => e.status === 'completed'
            ).length;
            const activeCount = courseEnrollments.filter(
              (e) => e.status === 'active'
            ).length;

            return (
              <div key={course.id} className="course-enrollment-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <div className="enrollment-stats">
                    <span className="total-enrolled">
                      {courseEnrollments.length} inscritos
                    </span>
                  </div>
                </div>

                <div className="course-progress-stats">
                  <div className="stat-item">
                    <span className="stat-label">Activos</span>
                    <span className="stat-value active">{activeCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Completados</span>
                    <span className="stat-value completed">
                      {completedCount}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Progreso promedio</span>
                    <span className="stat-value">
                      {courseEnrollments.length > 0
                        ? Math.round(
                            courseEnrollments.reduce(
                              (sum, e) => sum + (e.progress || 0),
                              0
                            ) / courseEnrollments.length
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>

                <div className="enrolled-users-preview">
                  {courseEnrollments.slice(0, 3).map((enrollment) => {
                    const user = users.find((u) => u.uid === enrollment.userId);
                    return user ? (
                      <div key={enrollment.id} className="user-preview">
                        <span className="user-name">{user.displayName}</span>
                        <span className="user-progress">
                          {enrollment.progress}%
                        </span>
                      </div>
                    ) : null;
                  })}
                  {courseEnrollments.length > 3 && (
                    <div className="more-users">
                      +{courseEnrollments.length - 3} más
                    </div>
                  )}
                </div>

                <div className="course-actions">
                  <button
                    className="btn-view-details"
                    onClick={() => {
                      /* Ver detalles de inscripciones */
                    }}
                  >
                    <FaEye />
                    Ver detalles
                  </button>
                  <button
                    className="btn-enroll-users"
                    onClick={() => {
                      /* Abrir modal para inscribir más usuarios */
                    }}
                  >
                    <FaUserPlus />
                    Inscribir más
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vista por Empleados */}
      <div className="users-enrollment-view">
        <h2>Progreso por Empleado</h2>
        <div className="users-table">
          <div className="table-header">
            <span>Empleado</span>
            <span>Cursos Inscritos</span>
            <span>Completados</span>
            <span>En Progreso</span>
            <span>Progreso Promedio</span>
            <span>Acciones</span>
          </div>

          {filteredUsers.map((user) => {
            const userEnrollments = getUserEnrollments(user.uid);
            const completedCourses = userEnrollments.filter(
              (e) => e.status === 'completed'
            ).length;
            const activeCourses = userEnrollments.filter(
              (e) => e.status === 'active'
            ).length;
            const avgProgress =
              userEnrollments.length > 0
                ? Math.round(
                    userEnrollments.reduce(
                      (sum, e) => sum + (e.progress || 0),
                      0
                    ) / userEnrollments.length
                  )
                : 0;

            return (
              <div key={user.id} className="user-row">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user.displayName}</span>
                    <span className="user-email">{user.email}</span>
                    <span className="user-department">{user.department}</span>
                  </div>
                </div>

                <span className="enrolled-count">{userEnrollments.length}</span>
                <span className="completed-count">{completedCourses}</span>
                <span className="active-count">{activeCourses}</span>

                <div className="progress-indicator">
                  <span className="progress-text">{avgProgress}%</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${avgProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="user-actions">
                  <button className="btn-view-progress">
                    <FaChartLine />
                  </button>
                  <button className="btn-enroll-user">
                    <FaUserPlus />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para inscripciones masivas */}
      {showEnrollModal && (
        <BulkEnrollmentModal
          courses={courses}
          users={users}
          onClose={() => setShowEnrollModal(false)}
          onEnroll={handleBulkEnroll}
        />
      )}
    </div>
  );
};

// Componente Modal para inscripciones masivas
const BulkEnrollmentModal = ({ courses, users, onClose, onEnroll }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [enrolling, setEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!selectedCourse || selectedUsers.length === 0) return;

    setEnrolling(true);
    try {
      const results = await onEnroll(selectedCourse, selectedUsers);
      const successCount = results.filter((r) => r.success).length;
      alert(
        `${successCount} de ${results.length} inscripciones realizadas exitosamente`
      );
      onClose();
    } catch (error) {
      // Cambié 'err' por 'error'
      console.error('Error en las inscripciones:', error);
      alert('Error en las inscripciones');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Inscribir Empleados a Curso</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Seleccionar Curso</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Selecciona un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Seleccionar Empleados</label>
            <div className="users-list">
              {users.map((user) => (
                <label key={user.id} className="user-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.uid)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.uid]);
                      } else {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== user.uid)
                        );
                      }
                    }}
                  />
                  <span>
                    {user.displayName} ({user.email})
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-enroll"
            onClick={handleEnroll}
            disabled={
              !selectedCourse || selectedUsers.length === 0 || enrolling
            }
          >
            {enrolling
              ? 'Inscribiendo...'
              : `Inscribir ${selectedUsers.length} empleados`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentManagement;
