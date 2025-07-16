// ✅ CREAR: src/pages/instructor/InstructorClasses.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { FaUsers, FaCalendar, FaEdit, FaEye } from 'react-icons/fa';
import './InstructorClasses.css';

const InstructorClasses = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorClasses();
  }, [currentUser]);

  const fetchInstructorClasses = async () => {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('instructorId', '==', currentUser.uid)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(coursesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando tus clases...</div>;
  }

  return (
    <div className="instructor-classes">
      <div className="page-header">
        <h1>Mis Clases</h1>
        <p>Gestiona tus cursos y estudiantes</p>
      </div>

      {classes.length === 0 ? (
        <div className="empty-state">
          <p>No tienes clases asignadas aún.</p>
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map((course) => (
            <div key={course.id} className="class-card">
              <div className="class-header">
                <h3>{course.title}</h3>
                <span
                  className={`status ${course.isPublished ? 'published' : 'draft'}`}
                >
                  {course.isPublished ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              <p className="class-description">{course.description}</p>

              <div className="class-meta">
                <div className="meta-item">
                  <FaUsers />
                  <span>{course.enrolledUsers?.length || 0} estudiantes</span>
                </div>
                <div className="meta-item">
                  <FaCalendar />
                  <span>{course.duration}h duración</span>
                </div>
              </div>

              <div className="class-actions">
                <button className="btn-action view">
                  <FaEye />
                  Ver Detalles
                </button>
                <button className="btn-action edit">
                  <FaEdit />
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorClasses;
