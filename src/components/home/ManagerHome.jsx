// ✅ CREAR: src/components/home/ManagerHome.jsx

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { usePermissions } from '../../hooks/usePermissions';
import DashboardLayout from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import './ManagerHome.css';

function ManagerHome() {
  const [teamStats, setTeamStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    coursesInProgress: 0,
    completionRate: 0,
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = usePermissions();

  useEffect(() => {
    if (currentUser) {
      fetchManagerData();
    }
  }, [currentUser]);

  const fetchManagerData = async () => {
    try {
      // Obtener miembros del equipo
      const teamQuery = query(
        collection(db, 'users'),
        where('managerId', '==', currentUser.uid)
      );
      const teamSnapshot = await getDocs(teamQuery);
      const team = teamSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Obtener estadísticas del equipo
      const activeEmployees = team.filter((member) => member.isActive).length;

      // Simular datos de progreso de cursos
      const coursesInProgress = Math.floor(Math.random() * 20) + 10;
      const completionRate = Math.floor(Math.random() * 30) + 60;

      setTeamStats({
        totalEmployees: team.length,
        activeEmployees: activeEmployees,
        coursesInProgress: coursesInProgress,
        completionRate: completionRate,
      });

      // Obtener los primeros 5 miembros del equipo para mostrar
      setTeamMembers(team.slice(0, 5));

      // Simular solicitudes pendientes
      setPendingApprovals([
        {
          id: 1,
          employeeName: 'Juan Pérez',
          courseName: 'React Avanzado',
          type: 'enrollment',
        },
        {
          id: 2,
          employeeName: 'María García',
          courseName: 'Liderazgo Efectivo',
          type: 'completion',
        },
      ]);
    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = (approvalId, approved) => {
    // Lógica para aprobar/rechazar solicitudes
    setPendingApprovals((prev) =>
      prev.filter((item) => item.id !== approvalId)
    );
    alert(approved ? 'Solicitud aprobada' : 'Solicitud rechazada');
  };

  return (
    <DashboardLayout>
      <div className="manager-home">
        <div className="welcome-section">
          <h1>Panel de Gerente</h1>
          <p>Bienvenido, {currentUser?.displayName || 'Gerente'}</p>
        </div>

        <div className="team-stats">
          <div className="stat-box">
            <div className="stat-icon team">👥</div>
            <div className="stat-content">
              <h3>Mi Equipo</h3>
              <p className="stat-value">{teamStats.totalEmployees}</p>
              <span className="stat-label">
                {teamStats.activeEmployees} activos
              </span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon progress">📚</div>
            <div className="stat-content">
              <h3>Cursos en Progreso</h3>
              <p className="stat-value">{teamStats.coursesInProgress}</p>
              <span className="stat-label">En todo el equipo</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon completion">✅</div>
            <div className="stat-content">
              <h3>Tasa de Completación</h3>
              <p className="stat-value">{teamStats.completionRate}%</p>
              <span className="stat-label">Promedio del equipo</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-content">
              <h3>Pendientes</h3>
              <p className="stat-value">{pendingApprovals.length}</p>
              <span className="stat-label">Solicitudes</span>
            </div>
          </div>
        </div>

        {/* Solicitudes pendientes */}
        {pendingApprovals.length > 0 && (
          <div className="pending-section">
            <h2>Solicitudes Pendientes</h2>
            <div className="pending-list">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="pending-item">
                  <div className="pending-info">
                    <h4>{approval.employeeName}</h4>
                    <p>
                      {approval.type === 'enrollment'
                        ? 'Solicita inscripción en'
                        : 'Completó'}
                      :<strong> {approval.courseName}</strong>
                    </p>
                  </div>
                  <div className="pending-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApproval(approval.id, true)}
                    >
                      Aprobar
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleApproval(approval.id, false)}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Miembros del equipo */}
        <div className="team-section">
          <div className="section-header">
            <h2>Miembros del Equipo</h2>
            <Link to="/mi-equipo" className="view-all">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <div className="loading">Cargando equipo...</div>
          ) : teamMembers.length > 0 ? (
            <div className="team-members-grid">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member-card">
                  <div className="member-header">
                    <h3>{member.displayName}</h3>
                    <span
                      className={`member-status ${member.isActive ? 'active' : 'inactive'}`}
                    >
                      {member.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="member-role">{member.role}</p>
                  <p className="member-email">{member.email}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-members">No hay miembros en tu equipo</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManagerHome;
