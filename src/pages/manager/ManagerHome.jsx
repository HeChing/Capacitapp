// ✅ CREAR: src/pages/manager/ManagerHome.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUsers, FaChartLine, FaBookOpen, FaTasks } from 'react-icons/fa';
import './ManagerHome.css';

const ManagerHome = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    teamMembers: 0,
    assignedCourses: 0,
    completionRate: 0,
    activeTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del manager
    const fetchManagerData = async () => {
      try {
        // Aquí implementarías la lógica real para obtener datos del equipo
        setStats({
          teamMembers: 8,
          assignedCourses: 12,
          completionRate: 85,
          activeTasks: 5,
        });
      } catch (error) {
        console.error('Error fetching manager data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, []);

  if (loading) {
    return <div className="loading">Cargando datos del equipo...</div>;
  }

  return (
    <div className="manager-home">
      <div className="dashboard-header">
        <h1>Panel de Gestión</h1>
        <p>Bienvenido, {currentUser?.displayName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon team">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{stats.teamMembers}</h3>
            <p>Miembros del Equipo</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon courses">
            <FaBookOpen />
          </div>
          <div className="stat-content">
            <h3>{stats.assignedCourses}</h3>
            <p>Cursos Asignados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completion">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats.completionRate}%</h3>
            <p>Tasa de Finalización</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tasks">
            <FaTasks />
          </div>
          <div className="stat-content">
            <h3>{stats.activeTasks}</h3>
            <p>Tareas Activas</p>
          </div>
        </div>
      </div>

      <div className="manager-widgets">
        <div className="widget">
          <h3>Progreso del Equipo</h3>
          <div className="team-progress">
            <div className="team-member">
              <span className="member-name">Ana García</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-text">75%</span>
            </div>
            <div className="team-member">
              <span className="member-name">Carlos López</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '90%' }}></div>
              </div>
              <span className="progress-text">90%</span>
            </div>
            <div className="team-member">
              <span className="member-name">María Rodríguez</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span className="progress-text">60%</span>
            </div>
          </div>
        </div>

        <div className="widget">
          <h3>Tareas Pendientes</h3>
          <div className="pending-tasks">
            <div className="task-item">
              <span className="task-name">Revisar progreso de Q1</span>
              <span className="task-due">Vence en 2 días</span>
            </div>
            <div className="task-item">
              <span className="task-name">Asignar curso de liderazgo</span>
              <span className="task-due">Vence mañana</span>
            </div>
            <div className="task-item">
              <span className="task-name">Evaluación de desempeño</span>
              <span className="task-due">Vence en 1 semana</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
